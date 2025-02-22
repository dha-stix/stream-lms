import { handleFollow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function RelatedProfile({
	name,
	occupation,
	image,
	id,
	followers,
	userID
}: RelatedProfileProps) {
	const { toast } = useToast();
	
	const handleFollowFn = async () => {
		const status = await handleFollow({ id, followers, userID })

		if (status) {
			toast({
				title: "Action Successful",
				description: "You've followed the instructor",
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
		<section className='flex items-center justify-between bg-white rounded-md p-4 mx-4'>
			<div className='flex items-center space-x-4'>
				<Avatar className='w-20 h-20'>
					<AvatarImage src={image} />
					<AvatarFallback>{name}</AvatarFallback>
				</Avatar>
				<div>
					<h3 className='text-sm'>{name}</h3>
					<p className='text-xs opacity-60 mb-2'>{occupation}</p>
				</div>
			</div>
			<div>
				<button className='bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 text-sm rounded-md' onClick={() => handleFollowFn()}>
					Follow
				</button>
			</div>
		</section>
	);
}