"use client";
import { formatDateTime } from "@/lib/utils";
import { Call } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function MeetingsBox({
	upcomingCalls,
	isLoading,
	ongoingCalls,
}: {
	upcomingCalls: Call[] | undefined;
	isLoading: boolean;
	ongoingCalls: Call[] | undefined;
}) {
	const router = useRouter();
	const { toast } = useToast();

	if (isLoading || !upcomingCalls || !ongoingCalls) {
		return <p className='text-xs opacity-60'>Fetching calls...</p>;
	}
	if (upcomingCalls.length === 0) {
		return <p className='text-xs  opacity-60'>No upcoming meetings</p>;
	}

	const handleJoinCall = (call: Call) => {
		router.push(`/call/${call.id}`);
	};

	const handleCopyLink = (call: Call) => { 
		navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_PAGE_URL!}/call/${call.id}`);
		toast({
			title: "Link copied to clipboard",
			description: "You can now share the link with interested participants",
		})
	}

	return (
		<div className='space-y-4'>
			{ongoingCalls.map((call) => (
					<div className='bg-white p-2 rounded-md' key={call.id}>
						<h3 className='text-sm font-bold text-gray-500 mb-2'>
							{call.state.custom.description}
						</h3>
						<p className='text-xs'>
							Started: {formatDateTime(call.state?.startsAt?.toLocaleString())}
						</p>
						<div className='flex items-center space-x-4'>
							<button
								className='bg-blue-500 text-white px-4 py-2 text-xs rounded-md mt-2'
								onClick={() => handleJoinCall(call)}
							>
								Join In
						</button>
						
						<button className="bg-gray-500 text-white px-4 py-2 text-xs rounded-md mt-2"
							onClick={() => handleCopyLink(call)}>
							Copy Link
						</button>
						</div>
					</div>
				))}

			{upcomingCalls.map((call) => (
					<div className='bg-white p-2 rounded-md' key={call.id}>
						<h3 className='text-sm font-bold text-gray-500 mb-2'>
							{call.state.custom.description}
						</h3>

					<div className="flex items-center space-x-4">
						<button
							className='bg-blue-500 text-white px-4 py-2 text-xs rounded-md mt-2'
							disabled={true}
						>
							{formatDateTime(call.state?.startsAt?.toLocaleString())}
						</button>

						<button className="bg-gray-500 text-white px-4 py-2 text-xs rounded-md mt-2"
							onClick={() => handleCopyLink(call)}>
							Copy Link
						</button>
						
					</div>
						
					</div>
				))
			}
		</div>
	);
}