import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { handleUnFollow } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function FollowingProfile({
	following,
	userID,
}: {
	following: Following;
	userID: string;
}) {
	const { toast } = useToast();

	const handleUnFollowFn = async () => {
		const status = await handleUnFollow(
			following.followers,
			userID,
			following.id
		);
		if (status) {
			toast({
				title: "Action Successful",
				description: "You've unfollowed the instructor",
			});
		} else {
			toast({
				variant: "destructive",
				title: "Action Failed",
				description: "Try again.",
			});
		}
		location.reload();
	};

	return (
		<section className='flex items-center justify-between bg-gray-50 rounded-md p-4 mx-4 lg:w-2/3 w-full'>
			<div className='flex items-center space-x-4'>
				<Avatar className='w-20 h-20'>
					<AvatarImage src={following.image} />
					<AvatarFallback>{following.name}</AvatarFallback>
				</Avatar>
				<div>
					<Link href={`/instructor/${following.id}`} className='text-sm hover:text-blue-500'>{following.name}</Link>
					<p className='text-xs opacity-60 mb-2'>{following.occupation}</p>
				</div>
			</div>
			<div>
				<button
					className='bg-red-400 hover:bg-red-500 text-white px-4 py-2 text-sm rounded-md'
					onClick={() => handleUnFollowFn()}
				>
					Unfollow
				</button>
			</div>
		</section>
	);
}