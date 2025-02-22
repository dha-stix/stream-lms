"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "../../../../utils/supabase/client";
import AnnouncementBox from "./(components)/AnnouncementBox";
import { useState, useCallback, useEffect } from "react";
import MeetingsBox from "./(components)/MeetingsBox";
import { User } from "@supabase/supabase-js";
import { useParams, useRouter } from "next/navigation";
import { FaLink } from "react-icons/fa6";
import Link from "next/link";
import { useGetCalls } from "@/app/hooks/useGetCalls";
import { getInstructorChannel } from "../../../../actions/stream.action";


export default function Profile() {
	const [user, setUser] = useState<User | null>(null);
	const [instructorData, setInstructorData] = useState<ProfileProps | null>(
		null
    );
    const [announcements, setAnnouncements] = useState<MiniFeedProps[]>([]);
	const params = useParams<{ id: string }>();
	const [channelLink, setChannelLink] = useState<string | null>(null);
	const router = useRouter();
	const { upcomingCalls, isLoading, ongoingCalls } = useGetCalls();

	const fetchInstructorData = useCallback(async () => {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("instructors")
			.select("name, bio, email, image, occupation, url")
			.eq("id", params.id)
            .single();
        
        const { data: announcements, error: announcementError } = await supabase.from("announcements").select("created_at, id, content, likes").eq("author_id", params.id).order("created_at", { ascending: false });
        if (announcementError) {
            console.error(announcementError);
            return;
        }
		if (error) {
			console.error(error);
			return;
		}
		const getInstructorChannelLink = await getInstructorChannel(params.id);
		setChannelLink(getInstructorChannelLink);
        setInstructorData(data);
        setAnnouncements(announcements);
	}, [params.id]);

	const authenticateUser = useCallback(async () => {
		const supabase = createClient();
		const user = await supabase.auth.getUser();
		const userData = user.data.user;
		if (!userData) {
			return router.push("/student/auth/login");
		}
		setUser(userData);
		fetchInstructorData();
	}, [router, fetchInstructorData]);

	useEffect(() => {
		authenticateUser();
	}, [authenticateUser]);

	return (
		<main className='w-full px-8'>
			<div className=' bg-gray-50 mx-auto rounded-md px-12 py-4 flex items-center flex-col space-x-6 mb-3'>
				<Avatar className='w-24 h-24'>
					<AvatarImage src={instructorData?.image} />
					<AvatarFallback>{instructorData?.name}</AvatarFallback>
				</Avatar>
				<div className='w-full flex items-center flex-col'>
					<h3 className='text-2xl font-bold'>{instructorData?.name}</h3>
					<p className='opacity-60'>{instructorData?.occupation}</p>
					<p className='text-sm opacity-60 text-center'>
						{instructorData?.bio}
					</p>

					<span className='flex items-center space-x-2'>
						<FaLink />
						<Link
							href={`${instructorData?.url}`}
							target='_blank'
							className='hover:underline text-sm text-blue-500 cursor-pointer'
						>
							{instructorData?.url}
						</Link>
					</span>
					{channelLink && (
						<Link
							href={`${channelLink}`} className='bg-blue-500 text-sm text-white px-4 py-2 rounded-md mt-2'
							target="_blank"
						>
						Join my Community Channel </Link>
						
 )}
					
				</div>
			</div>

			<main className='w-full flex lg:flex-row flex-col-reverse items-start justify-between gap-5 '>
				<div className='lg:w-3/5 w-full flex flex-col items-center overflow-y-scroll h-[40vh]'>
					<div className='w-full bg-white border-[1px] shadow-sm rounded-lg p-4'>
						<h2 className='text-lg font-bold'>Announcements</h2>

                        <div className='mt-4 space-y-4 min-h-max'>
                            {announcements.length > 0 ? announcements.map((announcement) => (
								<AnnouncementBox key={announcement.id} user={user} slugID={params.id} instructor={instructorData} content={announcement.content} likes_count={announcement.likes} timestamp={announcement.created_at} id={announcement.id} />
							)) : (
								<p className='text-xs'>No announcements yet</p>
							)}
						</div>
					</div>
				</div>

				<div className='lg:w-2/5 w-full'>
					<div className='lg:w-1/3 bg-[#F6F1F1] shadow-md overflow-y-scroll h-[40vh] rounded-lg lg:fixed w-full p-4'>
						<h2 className='text-lg font-bold mb-3'>Upcoming Meetings</h2>
						<MeetingsBox upcomingCalls={upcomingCalls} isLoading={isLoading} ongoingCalls={ongoingCalls} />
					</div>
				</div>
			</main>
		</main>
	);
}