import { getUserSession } from "../../../../actions/auth";
import AnnouncementContainer from "./(components)/AnnouncementForm";
import { getDashboardData } from "../../../../actions/auth";

export default async function Dashboard() {
	const { user } = await getUserSession();
	const { followers_count, announcements_count } = await getDashboardData();

	return (
		<section className='p-8 w-full'>
			<div className='flex flex-col md:flex-row items-center justify-between w-full md:space-x-4 mb-6'>
				<div className='md:w-1/2 w-full h-full border-[1px] rounded-md px-6 py-8 text-center hover:shadow-md mb-4 md:mb-0'>
					<h3 className=' mb-3'>Followers</h3>
					<p className='text-2xl font-bold text-blue-500'>{followers_count}</p>
				</div>
				<div className='md:w-1/2 w-full h-full border-[1px] rounded-md px-6 py-8 text-center hover:shadow-md mb-4 md:mb-0'>
					<h3 className=' mb-3'>Announcements</h3>
					<p className='text-2xl font-bold text-blue-500'>{announcements_count}</p>
				</div>
			</div>

			<AnnouncementContainer user={user} />
		</section>
	);
}