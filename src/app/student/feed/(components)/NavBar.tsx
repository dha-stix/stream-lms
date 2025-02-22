import Link from "next/link";
import { logOut } from "../../../../../actions/auth";

export default function NavBar({showFollowingList, setShowFollowingList, followingCount}: NavBarProps) {
	return (
		<nav className='w-full px-8 py-4 flex items-center justify-between h-[10vh] border-b-[1px] border-gray-300 top-0 sticky z-10 bg-white'>
			<Link href="/student/feed" className='font-bold text-2xl'>LinkedUp</Link>

			<div className='flex items-center space-x-4 justify-between'>
                <button
                    onClick={()=> setShowFollowingList(!showFollowingList)}
                    className='hover:underline cursor-pointer'>
					{showFollowingList ? "Activity Feeds" : `Following List (${followingCount})`}
				</button>
				<button className='bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={logOut}>
					Log Out
				</button>
			</div>
		</nav>
	);
}