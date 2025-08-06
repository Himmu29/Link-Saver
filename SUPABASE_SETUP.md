# Supabase Integration Setup

This guide will help you set up Supabase as the database for your link saver app.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `link-saver-app`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
5. Click "Create new project"

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (anon/public)
   - **anon public** key

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute the SQL

This will create:
- `bookmarks` table with proper structure
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

## 5. Configure Authentication (Optional)

If you want to use Supabase Auth instead of Firebase Auth:

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers
3. Update the auth context to use Supabase Auth

## 6. Test the Integration

1. Start your development server: `npm run dev`
2. Sign up/login to your app
3. Try adding a bookmark - it should now save to Supabase
4. Check your Supabase dashboard → **Table Editor** → **bookmarks** to see the data

## 7. Database Schema Details

The `bookmarks` table has the following structure:

```sql
- id: UUID (primary key)
- url: TEXT (required)
- title: TEXT (required)
- summary: TEXT (required)
- favicon: TEXT (optional)
- tags: TEXT[] (array of tags)
- user_id: TEXT (required, for user isolation)
- created_at: TIMESTAMP (auto-generated)
- updated_at: TIMESTAMP (auto-updated)
```

## 8. Security Features

- **Row Level Security (RLS)**: Users can only access their own bookmarks
- **Indexes**: Optimized queries for user_id and created_at
- **Full-text search**: Built-in search capabilities
- **Automatic timestamps**: created_at and updated_at are managed automatically

## 9. API Endpoints

The app now uses these API endpoints:

- `GET /api/bookmarks?userId=...` - Fetch user's bookmarks
- `POST /api/bookmarks` - Create new bookmark
- `DELETE /api/bookmarks?id=...&userId=...` - Delete bookmark

## 10. Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env.local` file
   - Restart your dev server after adding env vars

2. **"Failed to fetch bookmarks"**
   - Check your Supabase URL and key
   - Ensure the database schema is created

3. **"Permission denied"**
   - Check RLS policies in Supabase dashboard
   - Ensure user_id matches auth.uid()

4. **Bookmarks not saving**
   - Check browser console for errors
   - Verify API endpoints are working
   - Check Supabase logs in dashboard

## 11. Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Ensure your Supabase project is in the same region as your users
3. Consider upgrading to a paid plan for better performance

## 12. Next Steps

- Add bookmark editing functionality
- Implement bookmark sharing
- Add bookmark categories/folders
- Implement bookmark import/export
- Add bookmark analytics 