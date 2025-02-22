"use client"
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { instructorSignUp } from "../../../../../actions/auth";
import { interests } from "@/lib/utils";

export default function Register() {
	const [buttonClicked, setButtonClicked] = useState<boolean>(false);
	const { toast } = useToast();
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
		e.preventDefault();
		setButtonClicked(true)
		const form = e.currentTarget
		const formData = new FormData(form);
		const result = await instructorSignUp(formData)
		if (!result.error) { 
			toast({
				title: "Authentication Success",
				description: "Congrats! Registration successful",
			});
			form.reset()
			router.push('/instructor/auth/login')
		} else {
			toast({
				variant: "destructive",
				title: "Authentication Failed",
				description: result.error,
			});
		}
		setButtonClicked(false)

	}
	
	return (
		<section className='md:w-3/4 w-full h-full flex flex-col justify-center md:px-8 px-6 py-8 '>
			<h2 className='text-3xl font-bold mb-3 md:text-left text-center'>
				Instructor Registration
			</h2>
			<form className='w-full' onSubmit={handleSubmit}>
				<label htmlFor='name' className='mb-2 opacity-60  '>
					Full Name
				</label>
				<input
					required
					type='text'
					id='name'
					name='name'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
				/>
				<label htmlFor='email' className='mb-2 opacity-60  '>
					Email Address
				</label>
				<input
					required
					type='email'
					id='email'
					name='email'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='occupation' className='mb-2 opacity-60  '>
					Occupation
				</label>
				<input
					required
					type='text'
					id='occupation'
					name='occupation'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='bio' className='mb-2 opacity-60  '>
					Short Bio
				</label>
				<textarea
					rows={3}
					id='bio'
					name='bio'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
				/>

				<label htmlFor='url' className='mb-2 opacity-60  '>
					Website/Portfolio
				</label>
				<input
					required
					type='url'
					id='url'
					name='url'
					className='  w-full px-4 py-3 border-[1px] rounded-md mb-3'
				/>

				<label htmlFor='interest' className='mb-2 opacity-60  '>
					Interest
				</label>
				<select
					id='interest'
					required
					name='interest'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-3  '
				>
					{interests.map((interest) => (
						<option key={interest.value} value={interest.value}>
							{interest.name}
						</option>
					))}
				</select>

				<label htmlFor='password' className='mb-2 opacity-60  '>
					Password
				</label>
				<input
					required
					type='password'
					id='password'
                    name='password'
                    minLength={8}
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<label htmlFor='image' className='mb-2 opacity-60  '>
					Headshot
				</label>
				<input
					required
					type='file'
					name='image'
					accept='image/png, image/jpeg'
					id='image'
					className='w-full px-4 py-3 border-[1px] rounded-md mb-2  '
				/>

				<button className='mt-2 mb-2 text-lg text-white rounded-md bg-blue-500 w-full px-8 py-4 cursor-pointer hover:bg-blue-600' disabled={buttonClicked}>
					{buttonClicked ? "Registering" : "Register"}
				</button>
				<p className=' opacity-60 text-center'>
					Already have an account?{" "}
					<Link href='/instructor/auth/login' className='text-blue-800'>
						Sign in
					</Link>
				</p>
			</form>
		</section>
	);
}