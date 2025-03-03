## Stream Social LMS using Supabase, Stream Chat, and Audio & Video SDK 

- [FreeCodeCamp Article explaining the project](https://www.freecodecamp.org/news/how-to-build-a-social-learning-platform-using-nextjs-stream-and-supabase/)

## Getting Started
- Clone the GitHub repository
- Run `npm install` to install the project dependencies
- Set up Supabase and copy the following credentials into the `.env.local` file
  ```env
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    NEXT_PUBLIC_SUPABASE_URL=
    STORAGE_URL=https://<supabase_url>/storage/v1/object/public/
  ```
  - Add your Stream keys into the file also:
  ```env
    NEXT_PUBLIC_STREAM_API_KEY=
    STREAM_SECRET_KEY=
    NEXT_PUBLIC_PAGE_URL=http://localhost:3000
    NEXT_PUBLIC_STREAM_CHANNEL_IMAGE_URL=https://api.dicebear.com/9.x/pixel-art/svg?seed=
  ```
  - Ensure you set up the Supabase tables and their access policies, and the Supabase storage (`headshots`) for the instructors.
  - Run `npm run dev` to start the local development server.

## Tools
- [ShadCn UI](https://ui.shadcn.com/docs/installation)
- [Supabase Authentication & Database](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Stream Chat SDK](https://getstream.io/chat/docs/sdk/react/)
- [Stream Video & Audio SDK](https://getstream.io/video/docs/react/)

