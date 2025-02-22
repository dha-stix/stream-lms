import { createClient } from "../../utils/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const interests: { value: string; name: string }[] = [
  {
    value: " ",
    name: "Select interest",
  },
  {
    value: "ai_ml",
    name: "AI/ML",
  },
  {
    value: "db_design",
    name: "Database Design",
  },
  {
    value: "software_eng",
    name: "Software Engineering",
  },
  {
    value: "ui_design",
    name: "Systems & UI Design",
  },
];

export const getDatePosted = (timestamp: string) => {
	if (timestamp === null) return;
	const date = new Date(timestamp);
	const result = formatDistanceToNow(date, { addSuffix: true });

	return result;
};

export const formatDateTime = (dateTimeString: string | undefined): string => {
	if (!dateTimeString) {
		return "";
	}
	// Step 1: Parse the input string to a Date object
	const [datePart, timePart] = dateTimeString.split(", ");
	const [day, month, year] = datePart.split("/").map(Number);
	const [hours, minutes] = timePart.split(":").map(Number);

	const date = new Date(year, month - 1, day, hours, minutes); // month is 0-indexed

	// Step 2: Extract the time in 12-hour format with AM/PM
	const hours12 = date.getHours() % 12 || 12; // Converts 24-hour format to 12-hour
	const ampm = date.getHours() >= 12 ? "pm" : "am";

	// Step 3: Return the formatted string with 12-hour time
	return `${datePart}, ${hours12}:${minutes
		.toString()
		.padStart(2, "0")}${ampm}`;
};

export const getStudentFeed = async (studentId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("students")
		.select("following_list")
		.eq("id", studentId);

	if (error || !data) {
		return null;
	}
	const followingList = data[0].following_list;
	if (followingList.length === 0) {
		return [];
	}

	const { data: announcementsData, error: announcementsError } = await supabase
		.from("announcements")
		.select("*")
		.in("author_id", followingList)
		.order("created_at", { ascending: false });

	if (announcementsError || !announcementsData) {
		return null;
	}
	return announcementsData;
};

export const getStudentFollowingList = async (studentId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("students")
		.select("following_list")
		.eq("id", studentId);

	if (error || !data) {
		return null;
	}
	const followingList = data[0].following_list;
	if (followingList.length === 0) {
		return [];
	}

	const { data: followingData, error: followingError } = await supabase
		.from("instructors")
		.select("id, name, occupation, image, followers")
		.in("id", followingList);

	if (followingError || !followingData) {
		return null;
	}
	return followingData;
};

export const getRelatedInstructorsProfile = async (
	studentInterest: string,
	studentFollowingList: Following[] | null
) => {
	if (!studentFollowingList) {
		return null;
	}
	const supabase = createClient();
	const { data, error } = await supabase
		.from("instructors")
		.select("*")
		.eq("interest", studentInterest);

	if (error || !data) {
		return null;
	}

	const relatedInstructors = data.filter(
		(instructor) =>
			!studentFollowingList.some((following) => following.id === instructor.id)
	);

	return relatedInstructors;
};

export const handleUnFollow = async (
	instructorFollowers: string[],
	userID: string,
	instructorID: string
) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("students")
		.select("following_list")
		.eq("id", userID);
	if (error || !data) {
		return false;
	}
	const studentFollowingList = data[0].following_list;
	const newStudentFollowing = studentFollowingList.filter(
		(following: string) => following !== instructorID
	);
	const newInstructorFollowers = instructorFollowers.filter(
		(follower) => follower !== userID
	);

	const { error: studentError } = await supabase
		.from("students")
		.update({ following_list: newStudentFollowing })
		.eq("id", userID);
	if (studentError) {
		return false;
	}
	const {  error: instructorError } = await supabase
		.from("instructors")
		.update({ followers: newInstructorFollowers })
		.eq("id", instructorID);

	if (instructorError) {
		return false;
	}
	return true
};

export const handleFollow = async ({
	id,
	followers,
	userID,
}: {
	id: string;
	userID: string;
	followers: string[];
}) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("students")
		.select("following_list")
		.eq("id", userID);
	if (error || !data) {
		return false;
	}

	const studentFollowingList = data[0].following_list;
	const newStudentFollowing = [...studentFollowingList, id];
	const newInstructorFollowers = [...followers, userID];
	
	const { error: studentError } = await supabase
		.from("students")
		.update({ following_list: newStudentFollowing })
		.eq("id", userID);
	
	if (studentError) {
		return false;
	}

	const { error: instructorError } = await supabase
		.from("instructors")
		.update({ followers: newInstructorFollowers })
		.eq("id", id);
	
	if (instructorError) {
		return false;
	}
	return true
};

export const handleDeletePost = async (id: string) => {
	const supabase = createClient();
	const { error } = await supabase.from("announcements").delete().eq("id", id);
	if (error) {
		return false;
	}
	return true
};

export const handleLike = async (
	feedID: number,
	userID: string,
	feed: Feed
) => {
	const supabase = createClient();
	const { error } = await supabase
		.from("announcements")
		.update({ likes: [...feed.likes, userID] })
		.eq("id", feedID);

	if (error) {
		return false
	}
	return true
};