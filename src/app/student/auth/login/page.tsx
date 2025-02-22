"use client";
import Link from "next/link";
import { studentLogIn } from "../../../../../actions/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Login() {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const result = await studentLogIn(formData);
		if (!result.error) {
			toast({
				title: "Authentication Success",
				description: "Congrats! Login successful",
			});
			form.reset();
			router.push("/student/feed");
		} else {
			toast({
				variant: "destructive",
				title: "Authentication Failed",
				description: result.error,
			});
		}
		setButtonClicked(false);
	};

	return (
		<section className='md:w-3/4 w-full min-h-screen flex flex-col justify-center md:px-8 px-6 items-center'>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Student Sign in
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='email' className='mb-2 opacity-60'>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='password' className='mb-2 opacity-60'>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
					name='password'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
				/>

				<button
					className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
					disabled={buttonClicked}
				>
					{buttonClicked ? "Signing in" : "Sign in"}
				</button>
				<p className=' opacity-60 text-center'>
					Don&apos;t have an account?{" "}
					<Link href='/student/auth/register' className='text-blue-800'>
						Create one
					</Link>
				</p>
			</form>
		</section>
	);
}