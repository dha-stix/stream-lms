import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDatePosted, handleDeletePost } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AnnouncementBoxProps {
	user: User | null;
	slugID: string;
	instructor: ProfileProps | null;
    content: string;
    likes_count: string[],
	timestamp: string;
	id: string
}

export default function AnnouncementBox({ user, slugID, instructor, content, likes_count, timestamp, id }: AnnouncementBoxProps) {
	const { toast } = useToast();

	const handleDeleteFn = async () => {
		const status = await handleDeletePost(id)
		if (status) {
			toast({
				title: "Delete Action Successful",
				description: "Announcement deleted",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Action Failed",
				description: "Try again.",
			});
		}
		location.reload()
	}

	return (
		<section className='bg-gray-50 p-4 rounded-md'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<Avatar className='w-12 h-12'>
						<AvatarImage src={instructor?.image} />
						<AvatarFallback>{instructor?.name}</AvatarFallback>
					</Avatar>

					<div className='flex flex-col items-start'>
						<h3 className='text-sm font-bold'>{instructor?.name}</h3>
						<p className='text-xs opacity-60'>{instructor?.occupation}</p>
						<p className='text-blue-300 text-xs'>{getDatePosted(timestamp)}</p>
					</div>
				</div>
                {slugID === user?.id && (
                    <button className='bg-red-500 text-white px-4 py-2 text-xs rounded-md' onClick={()=> handleDeleteFn()}>
					Delete
				</button>
                )}
			</div>

			<p className='text-sm mt-2'>
				{content}
			</p>

            <div className='mt-2'>
                {slugID !== user?.id && (
                    <button className='bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 text-xs rounded-md'>
					Like {likes_count.length ? `(${likes_count.length})` : ''}
				</button>

                )}
				
			</div>
		</section>
	);
}