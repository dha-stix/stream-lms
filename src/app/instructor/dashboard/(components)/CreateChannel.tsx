/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"
import {
  DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import { createChannel } from "../../../../../actions/stream.action";

interface UserProps {
    user: User | null;
    setOpenCallModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateChannel({ user, setOpenCallModal }: UserProps) {
    const [channelName, setChannelName] = useState<string>('')
    const [channelDescription, setChannelDescription] = useState<string>('')
    const { toast } = useToast();
    const router = useRouter();

    const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault()
        if (!user) return;

        const imageURL = `${process.env.NEXT_PUBLIC_STREAM_CHANNEL_IMAGE_URL}${channelName}`

        try {
            
            const channelCreated = await createChannel({
                userId: user.id,
                data: {
                    name: channelName,
                    imageUrl: imageURL,
                }
            })

            if (channelCreated.success) {
                toast({
                    title: "Channel Created",
                    description: "Your channel has been created",
                });
                
                setOpenCallModal(false);
                return router.push(`/chat/${channelCreated.id}`);
            }

         	toast({
				title: "Channel Creation Failed",
				description: channelCreated.error,
              });
            router.push(`/chat/${channelCreated.id}`);
            
		} catch (error) {
			toast({
				title: "Channel Creation Failed",
				description: "An error occurred while creating the channel",
			});
		}
    }

    return (
        <section className="p-4 w-full">
            <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-500">
                    Create a Channel
                </DialogTitle>
                <DialogDescription className='text-sm text-gray-500 mb-5'>
					Enter the name and description for the channel
                </DialogDescription>
                
                <form className='w-full' onSubmit={handleCreateChannel}>
                    
                    <label
					className='block text-left text-sm font-medium text-gray-700'
					htmlFor='name'
				>
					Channel Name
				</label>
				<input
					type='text'
					name='name'
					id='name'
					value={channelName}
					onChange={(e) => setChannelName(e.target.value)}
					className='mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
					required
					placeholder='Enter a name for the channel'
                    />
                    
				<button className='w-full bg-blue-600 text-white py-3 rounded mt-4 cursor-pointer'>
					Create Channel
				</button>
			</form>

            </DialogHeader>

        </section>
    )
}