"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function studentSignUp(formData: FormData) {
	const supabase = await createClient();
	const credentials = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		interest: formData.get("interest") as string,
		name: formData.get("name") as string,
	};

	const { data, error } = await supabase.auth.signUp({
		email: credentials.email,
		password: credentials.password,
		options: {
			data: {
				interest: credentials.interest,
				name: credentials.name,
			},
		},
	});

	if (error) {
		return { error: error.message, status: error.status, user: null };
	} else if (data.user?.identities?.length === 0) {
		return { error: "User already exists", status: 409, user: null };
	}

	revalidatePath("/", "layout");
	return { error: null, status: 200, user: data.user };
}

export async function instructorSignUp(formData: FormData) {
	const supabase = await createClient();
	const credentials = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		interest: formData.get("interest") as string,
		name: formData.get("name") as string,
		occupation: formData.get("occupation") as string,
		bio: formData.get("bio") as string,
		url: formData.get("url") as string,
		image: formData.get("image") as File,
	};

	const { data: imageData, error: imageError } = await supabase.storage
		.from("headshots")
		.upload(`${crypto.randomUUID()}/image`, credentials.image);

	if (imageError) {
		return { error: imageError.message, status: 500, user: null };
	}
	const imageURL = `${process.env.STORAGE_URL!}${imageData.fullPath}`;

	const { data, error } = await supabase.auth.signUp({
		email: credentials.email,
		password: credentials.password,
		options: {
			data: {
				interest: credentials.interest,
				name: credentials.name,
				occupation: credentials.occupation,
				bio: credentials.bio,
				url: credentials.url,
				image: imageURL,
			},
		},
	});
	if (error) {
		return { error: error.message, status: error.status, user: null };
	} else if (data.user?.identities?.length === 0) {
		return { error: "User already exists", status: 409, user: null };
	}

	revalidatePath("/", "layout");
	return { error: null, status: 200, user: data.user };
}

export async function studentLogIn(formData: FormData) {
	const supabase = await createClient();

	const credentials = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};
	const { data, error } = await supabase.auth.signInWithPassword(credentials);

	if (error) {
		return { error: error.message, status: error.status, user: null };
	}
	if (data?.user?.identities?.length === 0) {
		return { error: "User not found", status: 404, user: null };
	}
	if (data && data.user.user_metadata.image) {
		return { error: "You are not a student", status: 400, user: null };
	}

	const { data: existingUser } = await supabase
		.from("students")
		.select()
		.eq("email", credentials.email)
		.single();
	if (!existingUser) {
		const { error: insertError } = await supabase.from("students").insert({
			email: credentials.email,
			name: data.user.user_metadata.name,
			interest: data.user.user_metadata.interest,
			id: data.user.id,
			following_list: [] as string[],
		});

		if (insertError) {
			return { error: insertError.message, status: 500, user: null };
		}
	}

	revalidatePath("/", "layout");
	return { error: null, status: 200, user: data.user };
}

export async function instructorLogIn(formData: FormData) {
	const supabase = await createClient();

	const credentials = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { data, error } = await supabase.auth.signInWithPassword(credentials);

	if (error) {
		return { error: error.message, status: error.status, user: null };
	}
	if (data?.user?.identities?.length === 0) {
		return { error: "User not found", status: 404, user: null };
	}
	if (data && !data.user.user_metadata.image) {
		return { error: "You are not an instructor", status: 400, user: null };
	}

	const { data: existingUser } = await supabase
		.from("instructors")
		.select()
		.eq("email", credentials.email)
		.single();
	if (!existingUser) {
		const { error: insertError } = await supabase.from("instructors").insert({
			email: credentials.email,
			name: data.user.user_metadata.name,
			occupation: data.user.user_metadata.occupation,
			bio: data.user.user_metadata.bio,
			url: data.user.user_metadata.url,
			image: data.user.user_metadata.image,
			id: data.user.id,
			interest: data.user.user_metadata.interest,
			followers: [],
		});

		if (insertError) {
			return { error: insertError.message, status: 500, user: null };
		}
	}

	revalidatePath("/", "layout");
	return { error: null, status: 200, user: data.user };
}

export async function getUserSession() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();
	if (error) {
		return { error: error.message, status: error.status, user: null };
	}
	if (!data) {
		return { error: "No session found", status: 404, user: null };
	}
	return { error: null, status: 200, user: data.user };
}

export async function logOut() {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/student/auth/login");
}

export async function getDashboardData() {
	const { user } = await getUserSession()
	const supabase = await createClient();

	if (!user) { 
		return { error: "No session found", status: 404 };
	}
	const { data: announcementData, error } = await supabase
		.from("announcements")
		.select('id')
		.eq("author_id", user?.id);
	
	const { data: followersData, error: followersError } = await supabase.from("instructors").select("followers").eq("id", user?.id).single()
	
	if (error || followersError) {
		return { error: error?.message || followersError?.message, status: 500 };
	}
	if (!followersData) {
		return { error: "No followers found", status: 404 };
	}
	if (!announcementData) {
		return { error: "No announcements found", status: 404 };
	}

	return { followers_count: followersData.followers.length , announcements_count: announcementData.length, status: 200 };
}