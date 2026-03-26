# 🪶 Inkwell

A beautiful, minimal daily journal application built with Next.js App Router, Supabase, and Tiptap.

## Features

- **🔥 Writing Streaks**: Build a daily habit with automatic streak tracking.
- **🌤 Mood Tracking**: Log your daily emotions and view them at a glance.
- **💡 Daily Prompts**: Never stare at a blank page — a fresh writing prompt greets you every day.
- **🔍 Full-text Search**: Find past entries instantly across your entire journal.
- **🏷 Tags & Organization**: Keep your thoughts organized with custom tags.
- **🌙 Premium UI**: A carefully crafted dark-mode interface that lets you focus on your writing.
- **🔒 Private & Secure**: Powered by Supabase Auth with Row Level Security. Your entries are visible only to you.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (Magic Links)
- **Editor**: Tiptap Rich Text Editor
- **Styling**: Pure CSS Variables

## Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/shift-hue/Inkwell.git
cd Inkwell
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Create a new project on [Supabase](https://supabase.com).
2. Run the SQL schema to set up the `profiles` and `entries` tables, along with Row Level Security (RLS) policies.
3. Configure your URL and Anon Key in a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Enable Email Auth (Magic Links) in your Supabase Auth settings, and ensure your Redirect URLs point to `http://localhost:3000/auth/callback`.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start writing.

## License

MIT
