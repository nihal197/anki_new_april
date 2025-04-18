# AnkiFlow

AnkiFlow is an interactive learning platform that helps you master subjects through spaced repetition and active recall techniques. Optimized for efficient learning, AnkiFlow includes MCQs, flashcards, progress tracking, and performance analytics.

## Features

- **Organized Study Content**: Browse and learn from structured study materials organized by subjects and topics.
- **Interactive Practice**: Test your knowledge with multiple-choice questions and flashcards.
- **Performance Analytics**: Track your progress, identify strengths and weaknesses, and earn achievements.
- **User Authentication**: Create an account to save your progress and access personalized analytics.
- **Streaks & Points**: Keep track of your daily study streaks and earn points for consistent learning.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Supabase account and project

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ankiflow.git
cd ankiflow
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Supabase**

- Create a Supabase project at [supabase.com](https://supabase.com)
- Get your Supabase URL and anon key from the API settings
- Create a `.env` file at the root of the project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token
```

4. **Set up the database**

- Run the database setup SQL script in the Supabase SQL editor:
  - First run the schema creation script: Copy the contents of `scripts/create_db_schema.sql` and execute it in the SQL editor
  - Then populate with seed data: Copy the contents of `scripts/seed_data.sql` and execute it in the SQL editor

> **Important**: The updated schema includes user streaks and points tables which need to be created before adding the seed data.

5. **Generate TypeScript types**

```bash
# Make sure you've set the SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN environment variables
./scripts/generate_types.sh
```

6. **Start the development server**

```bash
npm run dev
```

7. **Access the application**

Open your browser and navigate to `http://localhost:5173`

## Streak and Points Integration Guide

### 1. Database Setup

The database schema has been extended with two new tables:

- **user_streaks**: Tracks each user's current streak, longest streak, and last activity date
- **user_points**: Stores the total points earned by each user

These tables have a one-to-one relationship with users and include RLS policies for security.

### 2. Backend Integration

The `ProgressService` has been updated with new methods:

```typescript
// Update user streak when they complete an activity
await progressService.updateStreak(userId);

// Add points to a user's account
await progressService.addPoints(userId, pointsAmount);

// Get user analytics including streaks and points
const analytics = await progressService.getUserAnalytics(userId);
```

### 3. Dashboard Integration

The home dashboard component has been updated to:

1. Fetch and display streak and points data
2. Show visual indicators for streaks (flame icon)
3. Display points earned and badges unlocked

### 4. Testing

To test the feature with the seed data:

1. Run both SQL scripts to set up the database
2. Login with the test account:
   - Email: rahul@example.com
   - Password: (as configured in your auth settings)
3. Verify that the dashboard shows the streak (7 days) and points (1250)
4. Complete activities to see the streak and points increment

The seed data includes a test user with UUID `300bdd3c-12c9-4795-94f1-a619ad73bfc2` that has initial streak and points data for testing.

## Project Structure

```
/src
  /components     # React components
  /services       # API services for data access
  /lib            # Utility functions and helpers
  /types          # TypeScript type definitions
/scripts          # Setup and utility scripts
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally

## Technologies Used

- React
- TypeScript
- Supabase
- Tailwind CSS
- shadcn/ui
- Framer Motion

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Anki](https://apps.ankiweb.net/) for the inspiration on flashcard-based learning
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
