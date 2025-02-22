"use client";
import { useEffect, useState, useCallback } from "react";
import FeedComponent from "./(components)/FeedComponent";
import NavBar from "./(components)/NavBar";
import FollowingProfile from "./(components)/FollowingProfile";
import ContainerRelatedProfile from "./(components)/ContainerRelatedProfile";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
	getRelatedInstructorsProfile,
	getStudentFeed,
	getStudentFollowingList,
} from "@/lib/utils";

export default function FeedPage() {
	const [showFollowingList, setShowFollowingList] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [feeds, setFeeds] = useState<Feed[] | null>([]);
	const [followingList, setFollowingList] = useState<Following[] | null>([]);
	const [relatedProfiles, setRelatedProfiles] = useState<
		InstructorProps[] | null
	>([]);
	const router = useRouter();

	const authenticateUser = useCallback(async () => {
		const supabase = createClient();
		const { data } = await supabase.auth.getUser();
		const userData = data.user;
		if (!userData || userData.user_metadata.image) {
			return router.push("/student/auth/login");
		}
		setUser(userData);
		const userFeed = await getStudentFeed(userData.id);
		const followingList = await getStudentFollowingList(userData.id);
		const relatedProfiles = await getRelatedInstructorsProfile(
			userData.user_metadata.interest,
			followingList
		);
		setRelatedProfiles(relatedProfiles);

		setFollowingList(followingList);
		setFeeds(userFeed);
	}, [router]);

	useEffect(() => {
		authenticateUser();
	}, [authenticateUser]);

	return (
		<main className='w-full min-h-screen'>
			<NavBar
				showFollowingList={showFollowingList}
				setShowFollowingList={setShowFollowingList}
				followingCount={followingList ? followingList.length : 0}
			/>
			{!user ? (
				<p>Authenticating...</p>
			) : (
				<div className='w-full lg:p-8 p-4 flex lg:flex-row flex-col items-start justify-between gap-5'>
					{showFollowingList ? (
						<div className='lg:w-3/5 w-full flex flex-col items-center space-y-4'>
							{followingList && followingList.length > 0 ? (
								followingList.map((following) => (
									<FollowingProfile
										key={following.id}
										following={following}
										userID={user.id}
									/>
								))
							) : (
								<p className='text-sm'>No following list yet</p>
							)}
						</div>
					) : (
						<div className='lg:w-3/5 w-full flex flex-col items-center space-y-4'>
							{feeds && feeds.length > 0 ? (
								feeds.map((feed) => (
									<FeedComponent key={feed.id} feed={feed} userID={user.id} />
								))
							) : (
								<p className='text-sm'>No feeds yet, follow instructors</p>
							)}
						</div>
					)}

					<div className='lg:w-2/5 w-full '>
						<div className='lg:w-1/3 bg-[#F6F1F1] overflow-y-auto md:max-h-[70vh] max-h-[30vh] shadow-md rounded-lg lg:fixed w-full p-4 scrollbar-custom'>
							<ContainerRelatedProfile
								relatedProfiles={relatedProfiles}
								userID={user.id}
							/>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}