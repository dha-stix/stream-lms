"use client";
import {
	Chat,
	Channel,
	ChannelList,
	Window,
	ChannelHeader,
	MessageList,
	MessageInput,
	useCreateChatClient,
} from "stream-chat-react";
import { useCallback } from "react";
import { EmojiPicker } from "stream-chat-react/emojis";
import { init, SearchIndex } from "emoji-mart";
import data from "@emoji-mart/data";
init({ data });
import { createToken } from "../../../../../actions/stream.action";

export default function StreamChat({ user }: { user: UserData }) {
	const tokenProvider = useCallback(async () => {
		return await createToken();
	}, []);

	const filters = { members: { $in: [user.id] }, type: "messaging" };
	const options = { presence: true, state: true };

	const client = useCreateChatClient({
		apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
		tokenOrProvider: tokenProvider,
		userData: { id: user.id, name: user.name, image: user.image },
	});

	if (!client) return <div>Loading...</div>;

	return (
		<Chat client={client}>
			<div className='chat-container'>
				{/* Channel List */}
				<div className='channel-list'>
					<ChannelList
						sort={{ last_message_at: -1 }}
						filters={filters}
						options={options}
					/>
				</div>

				{/* Messages Panel */}
				<div className='chat-panel'>
					<Channel EmojiPicker={EmojiPicker} emojiSearchIndex={SearchIndex}>
						<Window>
							<ChannelHeader />
							<MessageList />
							<MessageInput />
						</Window>
					</Channel>
				</div>
			</div>
		</Chat>
	);
}