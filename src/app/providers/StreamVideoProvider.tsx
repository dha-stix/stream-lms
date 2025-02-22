"use client";
import { createClient } from "../../../utils/supabase/client";
import { tokenProvider } from "../../../actions/stream.action";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, ReactNode, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
	const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
	const supabase = createClient();

	const getUser = useCallback(async () => {
		const { data, error } = await supabase.auth.getUser();
		const { user } = data;
		if (error || !user || !apiKey) return;
		if (!tokenProvider) return;

		let streamUser;

		if (user.user_metadata?.image) { 
			streamUser = {
				id: user.id,
				name: user.user_metadata?.name,
				image: user.user_metadata?.image,
			}
		} else {
			streamUser = {
				id: user.id,
				name: user.user_metadata?.name,
			}

		}

		const client = new StreamVideoClient({
			apiKey,
			user: streamUser,
			tokenProvider,
		});

		setVideoClient(client);
	}, [supabase.auth]);

	useEffect(() => {
		getUser();
	}, [getUser]);

	if (!videoClient) return (
		<div className="h-screen flex items-center justify-center">
			<Loader2 size="32" className="mx-auto animate-spin"/>
		</div>
	)

	return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};