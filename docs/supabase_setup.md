# Supabase Database Setup Guide

This guide outlines the steps to set up the Supabase database for the AnkiFlow application, including the new exam selection feature.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up for an account if you don't have one.
2. Create a new project and note down your Supabase URL and anon key.

## Step 2: Set Up Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard.
2. Copy the contents of `scripts/create_db_schema.sql` from this repository.
3. Paste it into the SQL Editor and run the query to create all tables and security policies.

## Step 3: Seed the Database

1. Navigate to the SQL Editor in your Supabase dashboard.
2. Copy the contents of `scripts/seed_data.sql` from this repository.
3. Paste it into the SQL Editor and run the query to populate the database with initial data.

## Step 4: Configure Authentication

1. Navigate to the Authentication settings in your Supabase dashboard.
2. Enable Email Authentication.
3. Configure the Site URL to match your application's URL.
4. Set up any additional authentication providers if needed.

## Step 5: Update Environment Variables

1. Create a `.env` file in the root of your project with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_PROJECT_ID=your_project_id
   SUPABASE_ACCESS_TOKEN=your_access_token
   ```

## Step 6: Generate TypeScript Types

Run the script to generate TypeScript types from your database schema:

```bash
./scripts/generate_types.sh
```

## Database Structure

The database includes the following key tables:

- **Users**: Contains user information synced from Supabase Auth.
- **Exams**: Stores the different exam categories users can choose from.
- **User_Exams**: Tracks which exams users have selected.
- **Subjects**: Contains subject areas for each exam.
- **Topics**: Contains topics within each subject.
- **Questions**: Multiple-choice questions organized by subject and topic.
- **Flashcards**: Flashcards for study, organized by subject and topic.
- **User_Progress**: Tracks user progress through subjects and topics.
- **Achievements**: Defines achievements users can earn.

## User Flow

1. User registers with the application.
2. User is prompted to select an exam category.
3. The dashboard and learning materials are customized based on the selected exam.
4. User can change their exam selection from the profile settings page.

## Security Policies

The database includes row-level security policies that ensure:

- Users can only access their own data.
- All users can view shared educational content (subjects, topics, questions, flashcards).
- Only authenticated users can interact with the application.

## Data Relationships

- Each exam has multiple subjects.
- Each subject has multiple topics.
- Questions and flashcards are associated with specific subjects and optionally with specific topics.
- User progress is tracked at both subject and topic levels.
- Achievements are awarded based on user activity and progress. 