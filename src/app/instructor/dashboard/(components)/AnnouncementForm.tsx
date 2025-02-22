"use client";
import {
	DialogHeader,
	DialogTitle,
	DialogClose,
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../../../../utils/supabase/client";
import ScheduleCall from "./ScheduleCall";
import { useToast } from "@/hooks/use-toast";
import {  useState } from "react";
import CreateChannel from "./CreateChannel";

interface ModalProps {
	user: User | null;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface AnnounceProps {
	user: User | null;
}

export default function AnnouncementContainer({ user }: AnnounceProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [openCallModal, setOpenCallModal] = useState<boolean>(false);
	const [openChatModal, setOpenChatModal] = useState<boolean>(false);


	return (
		<div className='mt-12 flex items-center justify-center w-full space-x-4'>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<button className='w-1/3 text-xl text-white h-[200px] border-[1px] rounded-md px-6 py-8 text-center bg-blue-400 hover:bg-blue-600 hover:shadow-md cursor-pointer'>
						Make an Announcement
					</button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-4xl'>
					<AnnouncementForm user={user} setOpen={setOpen} />
				</DialogContent>
			</Dialog>

			<Dialog open={openCallModal} onOpenChange={setOpenCallModal}>
				<DialogTrigger asChild>
					<button className='text-white text-xl w-1/3 h-[200px] border-[1px] rounded-md px-6 py-8 text-center bg-blue-400 hover:shadow-md hover:bg-blue-600 cursor-pointer'>
						Schedule a Call
					</button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-4xl'>
					<ScheduleCall user={user} setOpenCallModal={setOpenCallModal} />
				</DialogContent>
			</Dialog>


				<Dialog open={openChatModal} onOpenChange={setOpenChatModal}>
				<DialogTrigger asChild>
					<button className='text-white text-xl w-1/3 h-[200px] border-[1px] rounded-md px-6 py-8 text-center bg-blue-400 hover:shadow-md hover:bg-blue-600 cursor-pointer'>
						Community Channel
					</button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-4xl'>
					<CreateChannel user={user} setOpenCallModal={setOpenChatModal} />
				</DialogContent>
			</Dialog>

		
			
		</div>
	);
}

export function AnnouncementForm({ user, setOpen }: ModalProps) {
	const { toast } = useToast();
	const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const content = form.content.value;
		const announcementObject = {
			author_name: user?.user_metadata.name as string,
			interest: user?.user_metadata.interest as string,
			author_title: user?.user_metadata.occupation as string,
			author_id: user?.id as string,
			author_image: user?.user_metadata.image as string,
			content: content,
			likes: [],
		};
		await createAnnouncement(announcementObject);
		location.reload();
	};

	const createAnnouncement = async (announcementObject: AnnouncementProps) => {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("announcements")
			.insert(announcementObject)
			.single();
		if (error && !data) {
			toast({
				variant: "destructive",
				title: "Error creating announcement",
				description: error.message,
			});
		} else {
			setOpen(false);
			toast({
				title: "Annoucement Created",
				description: "Your announcement has been posted",
			});
		}
	};

	return (
		<section className='p-4 w-full'>
			<DialogHeader>
				<DialogTitle className='text-2xl font-bold text-blue-500'>
					Make an announcement
				</DialogTitle>
				<DialogDescription className='text-sm text-gray-500 mb-4'>
					Enter the content for the new post
				</DialogDescription>

				<form onSubmit={handlePost}>
					<textarea
						className='w-full text-sm border-[1px] rounded-md p-4 mb-4'
						placeholder='Type your announcement here'
						rows={5}
						required
						name='content'
						id='content'
					/>

					<div className='flex items-center justify-between'>
						<button className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'>
							Post
						</button>

						<DialogClose asChild>
							<button className='bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer'>
								Cancel
							</button>
						</DialogClose>
					</div>
				</form>
			</DialogHeader>
		</section>
	);
}