-- Users Table
create table users (
  id uuid references auth.users not null primary key,
  email text not null unique,
  display_name text,
  created_at timestamp with time zone default now() not null,
  last_login timestamp with time zone,
  avatar_url text
);

-- User_Streaks Table
create table user_streaks (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date not null default CURRENT_DATE,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id)
);

-- User_Points Table
create table user_points (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  total_points int not null default 0,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id)
);

-- Exams Table
create table exams (
  id uuid default uuid_generate_v4() not null primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default now() not null,
  is_active boolean not null default true
);

-- User_Exams Table (to track which exams a user is preparing for)
create table user_exams (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  exam_id uuid references exams(id) not null,
  selected_at timestamp with time zone default now() not null,
  is_active boolean not null default true,
  unique(user_id, exam_id)
);

-- Subjects Table
create table subjects (
  id uuid default uuid_generate_v4() not null primary key,
  name text not null,
  description text,
  exam_id uuid references exams(id), -- Connect subject to an exam
  created_at timestamp with time zone default now() not null,
  created_by uuid references users(id)
);

-- Topics Table
create table topics (
  id uuid default uuid_generate_v4() not null primary key,
  subject_id uuid references subjects(id) not null,
  title text not null,
  content text,
  order_index int not null,
  created_at timestamp with time zone default now() not null
);

-- Questions Table
create table questions (
  id uuid default uuid_generate_v4() not null primary key,
  question text not null,
  options jsonb,
  correct_answer text not null,
  explanation text,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) not null,
  subject_id uuid references subjects(id) not null,
  topic_id uuid references topics(id),
  created_at timestamp with time zone default now() not null
);

-- Flashcards Table
create table flashcards (
  id uuid default uuid_generate_v4() not null primary key,
  front text not null,
  back text not null,
  subject_id uuid references subjects(id) not null,
  topic_id uuid references topics(id),
  created_at timestamp with time zone default now() not null
);

-- User_Progress Table
create table user_progress (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  subject_id uuid references subjects(id),
  topic_id uuid references topics(id),
  completion_percentage int not null default 0,
  last_studied timestamp with time zone,
  time_spent int not null default 0,
  created_at timestamp with time zone default now() not null,
  unique(user_id, topic_id)
);

-- User_Responses Table
create table user_responses (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  question_id uuid references questions(id),
  flashcard_id uuid references flashcards(id),
  response text,
  is_correct boolean,
  time_taken int, -- seconds
  created_at timestamp with time zone default now() not null
);

-- Achievements Table
create table achievements (
  id uuid default uuid_generate_v4() not null primary key,
  title text not null,
  description text not null,
  criteria jsonb not null,
  icon text,
  created_at timestamp with time zone default now() not null
);

-- User_Achievements Table
create table user_achievements (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  achievement_id uuid references achievements(id) not null,
  unlocked_at timestamp with time zone default now() not null,
  unique(user_id, achievement_id)
);

-- User_Practice_Sessions Table
create table user_practice_sessions (
  id uuid default uuid_generate_v4() not null primary key,
  user_id uuid references users(id) not null,
  subject_id uuid references subjects(id),
  topic_id uuid references topics(id),
  questions_attempted int not null default 0,
  questions_correct int not null default 0,
  duration_seconds int not null default 0,
  created_at timestamp with time zone default now() not null,
  completed_at timestamp with time zone
);

-- Set up Row-Level Security Policies
alter table users enable row level security;
alter table subjects enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table flashcards enable row level security;
alter table user_progress enable row level security;
alter table user_responses enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table user_streaks enable row level security;
alter table user_points enable row level security;
alter table user_practice_sessions enable row level security;

-- Users table policies
create policy "Users can view their own data"
on users for select
using (auth.uid() = id);

create policy "Users can update their own data"
on users for update
using (auth.uid() = id);

-- Subjects table policies
create policy "Anyone can view subjects"
on subjects for select
to authenticated
using (true);

create policy "Users can create subjects"
on subjects for insert
to authenticated
with check (true);

create policy "Creators can update their subjects"
on subjects for update
to authenticated
using (auth.uid() = created_by);

-- Topics table policies
create policy "Anyone can view topics"
on topics for select
to authenticated
using (true);

-- Questions table policies
create policy "Anyone can view questions"
on questions for select
to authenticated
using (true);

-- Flashcards table policies
create policy "Anyone can view flashcards"
on flashcards for select
to authenticated
using (true);

-- User_Progress table policies
create policy "Users can view their own progress"
on user_progress for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own progress"
on user_progress for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own progress"
on user_progress for update
to authenticated
using (auth.uid() = user_id);

-- User_Responses table policies
create policy "Users can view their own responses"
on user_responses for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can record their own responses"
on user_responses for insert
to authenticated
with check (auth.uid() = user_id);

-- Achievements table policies
create policy "Anyone can view achievements"
on achievements for select
to authenticated
using (true);

-- User_Achievements table policies
create policy "Users can view their own achievements"
on user_achievements for select
to authenticated
using (auth.uid() = user_id);

create policy "System can record user achievements"
on user_achievements for insert
to authenticated
with check (auth.uid() = user_id);

-- Exams table policies
create policy "Anyone can view exams"
on exams for select
to authenticated
using (true);

-- User_Exams table policies
create policy "Users can view their own exam selections"
on user_exams for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own exam selections"
on user_exams for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own exam selections"
on user_exams for update
to authenticated
using (auth.uid() = user_id);

-- User_Streaks table policies
create policy "Users can view their own streaks"
on user_streaks for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own streaks"
on user_streaks for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own streaks"
on user_streaks for insert
to authenticated
with check (auth.uid() = user_id);

-- User_Points table policies
create policy "Users can view their own points"
on user_points for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own points"
on user_points for update
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own points"
on user_points for insert
to authenticated
with check (auth.uid() = user_id);

-- User_Practice_Sessions table policies
create policy "Users can view their own practice sessions"
on user_practice_sessions for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own practice sessions"
on user_practice_sessions for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own practice sessions"
on user_practice_sessions for update
to authenticated
using (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX idx_user_responses_question_id ON user_responses(question_id);
CREATE INDEX idx_user_progress_user_id_topic_id ON user_progress(user_id, topic_id);
CREATE INDEX idx_questions_subject_topic ON questions(subject_id, topic_id);
CREATE INDEX idx_flashcards_subject_topic ON flashcards(subject_id, topic_id);
CREATE INDEX idx_user_exams_user_id ON user_exams(user_id);
CREATE INDEX idx_user_exams_exam_id ON user_exams(exam_id);
CREATE INDEX idx_subjects_exam_id ON subjects(exam_id);
CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_practice_sessions_user_id ON user_practice_sessions(user_id);
CREATE INDEX idx_user_practice_sessions_topic_id ON user_practice_sessions(topic_id); 