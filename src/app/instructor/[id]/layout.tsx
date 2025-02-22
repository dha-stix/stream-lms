import type { Metadata } from "next";
import { logOut } from "../../../../actions/auth";
import Link from "next/link";
import { StreamVideoProvider } from "@/app/providers/StreamVideoProvider";

export const metadata: Metadata = {
	title: "Instructor Profile | LinkedUp",
	description: "Generated by create next app",
};

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<StreamVideoProvider>
				 <main className="w-full min-h-screen">
            	<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300 top-0 sticky bg-white z-10'>
				<Link href="/" className='font-bold text-2xl'>LinkedUp</Link>

             
                    <button className='bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={logOut}>
					Log Out
				</button>
            </nav>
					{children}
		</main>
		</StreamVideoProvider>
	);
}