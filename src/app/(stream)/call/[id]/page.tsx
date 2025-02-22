/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useGetCallById } from "@/app/hooks/useGetCallById";
import {
	StreamCall,
	StreamTheme,
	PaginatedGridLayout,
	SpeakerLayout,
	CallControls,
	Call
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import {  useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "../../../../../utils/supabase/client";
import { useCallStateHooks } from "@stream-io/video-react-sdk"
import { useToast } from "@/hooks/use-toast";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export default function CallPage() {
	const { id } = useParams<{ id: string }>();
	const { call, isCallLoading } = useGetCallById(id);
	const [confirmJoin, setConfirmJoin] = useState<boolean>(false);
    const [camMicEnabled, setCamMicEnabled] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	const authenticateUser = useCallback(async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getUser();
            const userData = data.user
            if (!userData) {
                return router.push("/student/auth/login");
            }
            setUser(userData);
            if (camMicEnabled) {
			call?.camera.enable();
			call?.microphone.enable();
		} else {
			call?.camera.disable();
			call?.microphone.disable();
            }
            
        }, [router, call, camMicEnabled]);
    
        useEffect(() => {
            authenticateUser();
        }, [authenticateUser]);
    
	const handleJoin = () => { 
		call?.join();
		setConfirmJoin(true)
	}

	if (isCallLoading) return <p>Loading...</p>;

	if (!call) return (<p>Call not found</p>);

	return (
		<main className='min-h-screen w-full items-center justify-center'>
			<StreamCall call={call}>
			<StreamTheme>
					{confirmJoin ? <MeetingRoom call={call} /> : (
					<div className='flex flex-col items-center justify-center gap-5 h-screen w-full'>
							<h1 className='text-3xl font-bold'>Join Call</h1>
							<p className='text-lg'>Are you sure you want to join this call?</p>
							<div className='flex gap-5'>
								<button onClick={handleJoin} className='px-4 py-3 bg-blue-600 text-blue-50'>Join</button>
								<button onClick={() => router.back()} className='px-4 py-3 bg-red-600 text-red-50'>Cancel</button>
							</div>
						</div>
				)}
				</StreamTheme>
			</StreamCall>
		</main>
	);

}

const MeetingRoom = ({call} : {call: Call}) => {
	const [layout, setLayout] = useState<CallLayoutType>("grid");
	const router = useRouter();

	const handleLeave = () => {
        if (confirm("Are you sure you want to leave the call?")) {
            router.push("/");
        }
	};

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout />;
			case "speaker-right":
				return <SpeakerLayout participantsBarPosition='left' />;
			default:
				return <SpeakerLayout participantsBarPosition='right' />;
		}
	};

	return (
		<section className='relative min-h-screen w-full overflow-hidden pt-4'>
			<div className='relative flex size-full items-center justify-center'>
				<div className='flex size-full max-w-[1000px] items-center'>
					<CallLayout />
				</div>
				<div className='fixed bottom-0 flex w-full items-center justify-center gap-5'>
					<CallControls onLeave={handleLeave} />
				</div>

				<div className='fixed bottom-0 right-0 flex items-center justify-center gap-5 p-5'>
					<EndCallButton call={call} />
				</div>
				
			</div>
		</section>
	);
};

const EndCallButton = ({ call }: {call: Call}) => {
	const { useLocalParticipant } = useCallStateHooks();
	const localParticipant = useLocalParticipant();
	const router = useRouter();
	const { toast } = useToast();

	const participantIsHost = localParticipant && call.state.createdBy && localParticipant.userId === call.state.createdBy.id

	if (!participantIsHost) return null;
	
	const handleEndCall = () => { 
		call.endCall()
		toast({
			title: "Call Ended",
			description: "The call has been ended for everyone",
		})
		router.push("/")

	}

	
    return (
        <button
			className='bg-red-500 text-white px-4 py-2 rounded-md mt-2'
			onClick={handleEndCall}
        >
            End Call for Everyone
        </button>
    )
}