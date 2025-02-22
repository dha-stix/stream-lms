import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDatePosted, handleLike } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function FeedComponent({
	feed,
	userID,
}: {
	feed: Feed;
	userID: string;
	}) {
	const { toast } = useToast();
	
	
	const handleLikeFn = async () => { 
		const status = await handleLike(feed.id, userID, feed);

			if (status) {
			toast({
				title: "Action Successful",
				description: "You've reacted the post",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Action Failed",
				description: "Try again.",
			});
			}
		location.reload();
	}

	return (
		<section className='bg-gray-50 px-6 py-4 rounded-lg hover:shadow-md lg:w-2/3 w-full'>
			<div className='flex items-center  justify-between'>
				<div className='flex items-center space-x-2'>
					<Avatar className='w-12 h-12'>
						<AvatarImage src={feed.author_image} />
						<AvatarFallback>{feed.author_name}</AvatarFallback>
					</Avatar>

					<div className='flex flex-col items-start'>
						<Link
							href={`${process.env.NEXT_PUBLIC_PAGE_URL!}/instructor/${
								feed.author_id
							}`}
							className='text-sm font-bold'
						>
							{feed.author_name}
						</Link>
						<p className='text-xs opacity-60'>{feed.author_title}</p>
						<p className='text-blue-300 text-xs'>
							{getDatePosted(feed.created_at)}
						</p>
					</div>
				</div>
			</div>

			<p className='text-sm mt-2'>{feed.content}</p>

			<button
				className={`${
					feed.likes.includes(userID)
						? "bg-gray-400"
						: "bg-blue-400 hover:bg-blue-500"
				}  text-white px-4 py-2 mt-2 text-xs rounded-md`}
				onClick={() => handleLikeFn()}
				disabled={feed.likes.includes(userID)}
			>
				{feed.likes.length ? `Like (${feed.likes.length})` : "Like"}
			</button>
		</section>
	);
}