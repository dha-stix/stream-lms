"use client"
import {
  DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { User } from "@supabase/supabase-js"
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast";

interface UserProps {
    user: User | null;
    setOpenCallModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ScheduleCall({ user, setOpenCallModal }: UserProps) {
    const [description, setDescription] = useState<string>('')
    const [dateTime, setDateTime] = useState<string>('')
    const [callDetail, setCallDetail] = useState<Call>();
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16)
    };
    const [minDateTime, setMinDateTime] = useState(getCurrentDateTime());
	const client = useStreamVideoClient();
	const { toast } = useToast();

    useEffect(() => {
        setMinDateTime(getCurrentDateTime());
    }, []);

    const handleScheduleMeeting = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault()
        if (!client || !user) return;

        try {
			const id = crypto.randomUUID();
			const call = client.call("default", id);
			if (!call) throw new Error("Failed to create meeting");

			await call.getOrCreate({
				data: {
					starts_at: new Date(dateTime).toISOString(),
					custom: {
						description,
					},
				},
			});

			setCallDetail(call);
         	toast({
				title: "Call Created",
				description: "Your call has been scheduled",
			});
            
            setOpenCallModal(false);
		} catch (error) {
			toast({
				title: "Call Creation Failed",
				description: "Failed to schedule the call",
			});
		}
    }

    return (
        <section className="p-4 w-full">
            <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-500">
                    Schedule a call
                </DialogTitle>
                <DialogDescription className='text-sm text-gray-500 mb-5'>
					Enter the name and description for the call
                </DialogDescription>
                
                	<form className='w-full' onSubmit={handleScheduleMeeting}>
				<label
					className='block text-left text-sm font-medium text-gray-700'
					htmlFor='description'
				>
					Meeting Description
				</label>
				<input
					type='text'
					name='description'
					id='description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className='mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
					required
					placeholder='Enter a description for the meeting'
				/>

				<label
					className='block text-left text-sm font-medium text-gray-700'
					htmlFor='date'
				>
					Date and Time
				</label>

				<input
					type='datetime-local'
					id='date'
					name='date'
					required
					className='mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
					value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    min={minDateTime}
				/>

				<button className='w-full bg-blue-600 text-white py-3 rounded mt-4 cursor-pointer'>
					Schedule Call
				</button>
			</form>

            </DialogHeader>

        </section>
    )
}