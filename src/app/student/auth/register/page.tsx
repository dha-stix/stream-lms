"use client";
import { studentSignUp } from "../../../../../actions/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { interests } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonClicked(true);
		const form = e.currentTarget;
		const formData = new FormData(form);
		const result = await studentSignUp(formData);
		if (!result.error) {
			toast({
				title: "Authentication Success",
				description: "Congrats! Login successful",
			});
			form.reset();
			router.push("/student/auth/login");
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
				Student Registration
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='name' className='mb-2 opacity-60'>
					Full Name
				</label>
				<input
					required
					type='text'
					id='name'
					name='name'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>
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

				<label htmlFor='interest' className='mb-2 opacity-60'>
					Interest
				</label>
				<select
					required
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3'
					id='interest'
					name='interest'
				>
					{interests.map((interest) => (
						<option key={interest.value} value={interest.value}>
							{interest.name}
						</option>
					))}
				</select>

				<label htmlFor='password' className='mb-2 opacity-60'>
					Password
				</label>
				<input
					required
					type='password'
					minLength={8}
					id='password'
					name='password'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2'
				/>

				<button
					type='submit'
					disabled={buttonClicked}
					className='mt-6 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600'
				>
					{buttonClicked ? "Registering..." : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account?{" "}
					<Link href='/student/auth/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}