"use server";

import { getUserSession } from "./auth";
import { StreamClient } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY!;

const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

export const tokenProvider = async () => {
	const { user } = await getUserSession();

	if (!user) throw new Error("User is not authenticated");
	if (!STREAM_API_KEY) throw new Error("Stream API key secret is missing");
	if (!STREAM_API_SECRET) throw new Error("Stream API secret is missing");

	const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

	const expirationTime = Math.floor(Date.now() / 1000) + 3600;
	const issuedAt = Math.floor(Date.now() / 1000) - 60;

	const token = streamClient.generateUserToken({
		user_id: user.id,
		exp: expirationTime,
		validity_in_seconds: issuedAt,
	});

	return token;
};

export async function createToken(): Promise<string> {
	const { user } = await getUserSession();
	if (!user) throw new Error("User is not authenticated");
	return serverClient.createToken(user.id);
}

export async function createChannel({
	userId,
	data,
}: {
	userId: string;
	data: { name: string; imageUrl: string };
}) {
	try {
		const channels = await serverClient.queryChannels(
			{
				members: { $in: [userId] },
				type: "messaging",
			},
			{ last_message_at: -1 }
		);

		if (channels.length > 0) {
			return {
				success: false,
				error: "You already have an existing channel",
				id: channels[0].id,
			};
		}

		
		const channel = serverClient.channel("messaging", `channel-${userId}`, {
			name: data.name,
			image: data.imageUrl,
			members: [userId],
			created_by_id: userId,
		});
		await channel.create();
		return { success: true, error: null, id: channel.id };
	} catch (err) {
		return { success: false, error: "Failed to create channel", id: null };
	}
}

export async function getInstructorChannel(userId: string) {
	try {
		const channels = await serverClient.queryChannels(
			{
				members: { $in: [userId] },
				type: "messaging",
			},
			{ last_message_at: -1 }
		);
		return `/chat/${channels[0].id}`;
	} catch (err) {
		return null;
	}
}

export async function addUserToChannel(channelId: string, userId: string) {
	try {
		const channels = await serverClient.queryChannels(
			{
				members: { $in: [userId] },
				type: "messaging",
				id: channelId,
			},
			{ last_message_at: -1 }
		);

		if (channels.length > 0) {
			return {
				success: true,
				message: "Already a member",
				id: channels[0].id,
				error: null,
			};
		}

		const channel = serverClient.channel("messaging", channelId);

		await channel.addMembers([userId]);

		return {
			success: true,
			error: null,
			id: channel.id,
			message: "Member just added",
		};
	} catch (error) {
		console.error("Error adding user to channel:", error);
		return {
			success: false,
			error: "Failed to add user to channel",
			id: null,
			message: null,
		};
	}
}