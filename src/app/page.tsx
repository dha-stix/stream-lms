import Link from "next/link";

export default function Home() {
	return (
		<div className='w-full h-screen'>
			<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300'>
				<Link href="/" className='font-bold text-2xl'>LinkedUp</Link>

				<button className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer'>
					Source Code
				</button>
			</nav>
			<section className='h-[90vh] text-center w-full py-8 lg:px-[50px] px-4 flex flex-col items-center justify-center'>
				<h1 className='text-5xl lg:text-7xl font-extrabold text-blue-500 mb-5'>
					Follow experts and join free mentorship programs
				</h1>
				<p className='opacity-50 text-lg lg:text-2xl '>
					Learn from top experts in your field and grow your skills with free
					mentorship programs
				</p>
				<p className='opacity-50 text-lg lg:text-2xl '>
					Connect, collaborate, and accelerate your journey with guidance from
					industry leaders
				</p>

				<div className='flex items-center justify-center mt-8'>
					<Link
						href='/student/auth/login'
						className='bg-blue-500 text-white px-6 py-3 rounded-md cursor-pointer'
					>
						Student Login
					</Link>
					<Link
						href='/instructor/auth/login'
						className='bg-gray-200 text-gray-800 px-6 py-3 rounded-md cursor-pointer ml-5'
					>
						Instructor Login
					</Link>
				</div>
			</section>
		</div>
	);
}