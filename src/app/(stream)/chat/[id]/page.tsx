"use client";
import { useCallback, useEffect, useState } from "react";
import { getUserSession } from "../../../../../actions/auth";
import StreamChat from "./../(components)/StreamChat";
import { useParams } from "next/navigation";
import { addUserToChannel } from "../../../../../actions/stream.action";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ChatPage() {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [joinChannel, setJoinChannel] = useState<boolean>(false);
	const params = useParams<{ id: string }>();
	const { toast } = useToast();
	const router = useRouter();

	const fetchUserData = useCallback(async () => {
		const { user, error } = await getUserSession();
		if (error || !user) {
			return null;
		}

		setUserData({
			id: user.id,
			name: user.user_metadata.name,
			email: user.email!,
			image: user.user_metadata.image,
		});

		const {
			success,
			error: channelError,
			message,
		} = await addUserToChannel(params.id, user.id);
		if (success) {
			setJoinChannel(true);
		} else {
			toast({
				variant: "destructive",
				title: "Error",
				description: channelError || message,
			});
			router.back();
		}
	}, [params.id, router, toast]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	if (!userData) {
		return null;
	}

	return (
		<>{joinChannel ? <StreamChat user={userData} /> : <ConfirmMember />}</>
	);
}

function ConfirmMember() {
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-2xl font-bold mb-4 text-blue-500'>
				You are not a member of this channel
			</h1>
			<p className='text-lg mb-4'>
				Please wait while we add you to the channel
			</p>

			<div className='loader'>
				<Loader2 size={48} className='animate-spin' />
			</div>
		</div>
	);
}