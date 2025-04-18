# AnkiFlow Implementation Plan

## 1. Backend Setup with Supabase

### Database Schema
- **Users Table**
  ```sql
  create table users (
    id uuid references auth.users not null primary key,
    email text not null unique,
    display_name text,
    created_at timestamp with time zone default now() not null,
    last_login timestamp with time zone,
    avatar_url text
  );
  ```

- **Subjects Table**
  ```sql
  create table subjects (
    id uuid default uuid_generate_v4() not null primary key,
    name text not null,
    description text,
    created_at timestamp with time zone default now() not null,
    created_by uuid references users(id)
  );
  ```

- **Topics Table**
  ```sql
  create table topics (
    id uuid default uuid_generate_v4() not null primary key,
    subject_id uuid references subjects(id) not null,
    title text not null,
    content text,
    order_index int not null,
    created_at timestamp with time zone default now() not null
  );
  ```

- **Questions Table**
  ```sql
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
  ```

- **Flashcards Table**
  ```sql
  create table flashcards (
    id uuid default uuid_generate_v4() not null primary key,
    front text not null,
    back text not null,
    subject_id uuid references subjects(id) not null,
    topic_id uuid references topics(id),
    created_at timestamp with time zone default now() not null
  );
  ```

- **User_Progress Table**
  ```sql
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
  ```

- **User_Responses Table**
  ```sql
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
  ```

- **Achievements Table**
  ```sql
  create table achievements (
    id uuid default uuid_generate_v4() not null primary key,
    title text not null,
    description text not null,
    criteria jsonb not null,
    icon text,
    created_at timestamp with time zone default now() not null
  );
  ```

- **User_Achievements Table**
  ```sql
  create table user_achievements (
    id uuid default uuid_generate_v4() not null primary key,
    user_id uuid references users(id) not null,
    achievement_id uuid references achievements(id) not null,
    unlocked_at timestamp with time zone default now() not null,
    unique(user_id, achievement_id)
  );
  ```

### Security and Auth Setup
1. **Enable Auth Providers**
   - Email/password
   - Google OAuth (optional)

2. **Set up Row-Level Security Policies**
   ```sql
   -- Example for user_progress
   create policy "Users can only view their own progress"
   on user_progress for select
   using (auth.uid() = user_id);

   create policy "Users can only update their own progress"
   on user_progress for update
   using (auth.uid() = user_id);
   ```

3. **Create Storage Buckets**
   - User avatars
   - Content images

## 2. Client-Side Integration

### Environment Setup
1. **Create `.env` File:**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Create Supabase Client (`src/lib/supabase.ts`):**
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   import type { Database } from '@/types/supabase';

   export const supabase = createClient<Database>(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```

3. **Generate TypeScript Types:**
   ```bash
   npx supabase gen types typescript --project-id your_project_id > src/types/supabase.ts
   ```

### Authentication Components

1. **Create Auth Context (`src/components/AuthProvider.tsx`):**
   ```typescript
   import React, { createContext, useContext, useEffect, useState } from 'react';
   import { Session, User } from '@supabase/supabase-js';
   import { supabase } from '../lib/supabase';

   interface AuthContextType {
     session: Session | null;
     user: User | null;
     loading: boolean;
     signOut: () => Promise<void>;
   }

   const AuthContext = createContext<AuthContextType | undefined>(undefined);

   export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
     const [session, setSession] = useState<Session | null>(null);
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const getSession = async () => {
         const { data, error } = await supabase.auth.getSession();
         if (!error && data.session) {
           setSession(data.session);
           setUser(data.session.user);
         }
         setLoading(false);
       };

       getSession();

       const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
         setSession(newSession);
         setUser(newSession?.user ?? null);
       });

       return () => data.subscription.unsubscribe();
     }, []);

     const signOut = async () => {
       await supabase.auth.signOut();
     };

     return (
       <AuthContext.Provider value={{ session, user, loading, signOut }}>
         {children}
       </AuthContext.Provider>
     );
   };

   export const useAuth = () => {
     const context = useContext(AuthContext);
     if (context === undefined) {
       throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
   };
   ```

2. **Create Login Component (`src/components/Auth/Login.tsx`):**
   ```typescript
   import React, { useState } from 'react';
   import { supabase } from '@/lib/supabase';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   import { useToast } from '@/components/ui/use-toast';

   const Login = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [loading, setLoading] = useState(false);
     const { toast } = useToast();

     const handleLogin = async (e: React.FormEvent) => {
       e.preventDefault();
       setLoading(true);
       
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });

       if (error) {
         toast({
           title: 'Error',
           description: error.message,
           variant: 'destructive',
         });
       }
       setLoading(false);
     };

     return (
       <Card className="w-[350px]">
         <CardHeader>
           <CardTitle>Log in to AnkiFlow</CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleLogin} className="space-y-4">
             <div className="space-y-2">
               <Input
                 type="email"
                 placeholder="Email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Input
                 type="password"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
             <Button type="submit" className="w-full" disabled={loading}>
               {loading ? 'Logging in...' : 'Log in'}
             </Button>
           </form>
         </CardContent>
       </Card>
     );
   };

   export default Login;
   ```

3. **Update App.tsx to Include Auth:**
   ```typescript
   import { AuthProvider } from "./components/AuthProvider";
   import { ProtectedRoutes } from "./components/ProtectedRoutes";
   // ...existing imports

   function App() {
     return (
       <AuthProvider>
         <ThemeProvider defaultTheme="dark" storageKey="anki-theme">
           <div className="min-h-screen flex flex-col">
             <NavigationBar />
             <main className="flex-1 container mx-auto pt-20 px-4">
               <Routes>
                 <Route path="/login" element={<Login />} />
                 <Route path="/signup" element={<Signup />} />
                 <Route element={<ProtectedRoutes />}>
                   <Route path="/" element={<Home />} />
                   <Route path="/study" element={<StudyContent />} />
                   <Route path="/practice" element={<PracticeModule />} />
                   <Route path="/about-you" element={<PerformanceAnalytics />} />
                 </Route>
               </Routes>
             </main>
             <Toaster />
           </div>
         </ThemeProvider>
       </AuthProvider>
     );
   }
   ```

## 3. Service Layer

### API Services
1. **Base Service (`src/services/BaseService.ts`):**
   ```typescript
   import { supabase } from '@/lib/supabase';

   export class BaseService {
     protected supabase = supabase;
   }
   ```

2. **Subjects Service (`src/services/SubjectsService.ts`):**
   ```typescript
   import { BaseService } from './BaseService';
   import type { Database } from '@/types/supabase';

   type Subject = Database['public']['Tables']['subjects']['Row'];

   export class SubjectsService extends BaseService {
     async getAll() {
       const { data, error } = await this.supabase
         .from('subjects')
         .select('*')
         .order('name');
       
       if (error) throw error;
       return data;
     }

     async getById(id: string) {
       const { data, error } = await this.supabase
         .from('subjects')
         .select('*, topics(*)')
         .eq('id', id)
         .single();
       
       if (error) throw error;
       return data;
     }
   }

   export const subjectsService = new SubjectsService();
   ```

3. **Questions Service (`src/services/QuestionsService.ts`):**
   ```typescript
   import { BaseService } from './BaseService';
   import type { Database } from '@/types/supabase';

   type Question = Database['public']['Tables']['questions']['Row'];

   export class QuestionsService extends BaseService {
     async getBySubjectAndTopic(subjectId: string, topicId?: string) {
       let query = this.supabase
         .from('questions')
         .select('*')
         .eq('subject_id', subjectId);
       
       if (topicId) {
         query = query.eq('topic_id', topicId);
       }
       
       const { data, error } = await query;
       if (error) throw error;
       return data;
     }

     async recordResponse(userId: string, questionId: string, response: string, isCorrect: boolean, timeTaken: number) {
       const { error } = await this.supabase
         .from('user_responses')
         .insert({
           user_id: userId,
           question_id: questionId,
           response,
           is_correct: isCorrect,
           time_taken: timeTaken
         });
       
       if (error) throw error;
     }
   }

   export const questionsService = new QuestionsService();
   ```

4. **Progress Service (`src/services/ProgressService.ts`):**
   ```typescript
   import { BaseService } from './BaseService';

   export class ProgressService extends BaseService {
     async updateProgress(userId: string, topicId: string, completionPercentage: number, timeSpent: number) {
       // Check if a record exists
       const { data, error } = await this.supabase
         .from('user_progress')
         .select('*')
         .eq('user_id', userId)
         .eq('topic_id', topicId)
         .single();
       
       if (error && error.code !== 'PGRST116') {
         throw error;
       }
       
       if (data) {
         // Update existing record
         const { error: updateError } = await this.supabase
           .from('user_progress')
           .update({
             completion_percentage: completionPercentage,
             time_spent: data.time_spent + timeSpent,
             last_studied: new Date().toISOString()
           })
           .eq('id', data.id);
         
         if (updateError) throw updateError;
       } else {
         // Insert new record
         const { error: insertError } = await this.supabase
           .from('user_progress')
           .insert({
             user_id: userId,
             topic_id: topicId,
             completion_percentage: completionPercentage,
             time_spent: timeSpent,
             last_studied: new Date().toISOString()
           });
         
         if (insertError) throw insertError;
       }
     }

     async getUserAnalytics(userId: string) {
       // Get strengths and weaknesses
       const { data: responses, error: responsesError } = await this.supabase
         .from('user_responses')
         .select(`
           is_correct,
           time_taken,
           questions!inner(subject_id, topic_id, difficulty)
         `)
         .eq('user_id', userId);
       
       if (responsesError) throw responsesError;
       
       // Process data to compute analytics
       // This is a simplified example
       const subjectPerformance = {};
       const averageTime = responses.length > 0 
         ? responses.reduce((acc, item) => acc + item.time_taken, 0) / responses.length 
         : 0;
       
       return {
         averageTime,
         // Process other performance metrics
       };
     }
   }

   export const progressService = new ProgressService();
   ```

## 4. Component Updates

### Study Content Component Update

```typescript
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { subjectsService } from "@/services/SubjectsService";
import { progressService } from "@/services/ProgressService";
// ... other imports

interface Topic {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
}

interface SubjectData {
  id: string;
  name: string;
  topics: Topic[];
}

// ... other interfaces

const StudyContent: React.FC<StudyContentProps> = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [studyTime, setStudyTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({});
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load subjects from API
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await subjectsService.getAll();
        const formattedSubjects = await Promise.all(
          subjectsData.map(async (subject) => {
            const subjectWithTopics = await subjectsService.getById(subject.id);
            return {
              id: subject.id,
              name: subject.name,
              topics: subjectWithTopics.topics.map((topic) => ({
                id: topic.id,
                title: topic.title,
                content: topic.content,
                completed: false, // We'll update this from user progress
              })),
            };
          })
        );
        
        setSubjects(formattedSubjects);
        if (formattedSubjects.length > 0) {
          setSelectedSubject(formattedSubjects[0].id);
        }
      } catch (error) {
        console.error("Error loading subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  // Track study time and save progress
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (user && selectedTopic) {
      timer = setInterval(() => {
        setStudyTime(prev => prev + 1);
        setTimeSpent(prev => ({
          ...prev,
          [selectedTopic.id]: (prev[selectedTopic.id] || 0) + 1
        }));

        // Save progress every minute
        if (studyTime > 0 && studyTime % 60 === 0) {
          saveProgress();
        }
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
      if (studyTime > 0) {
        saveProgress();
      }
    };
  }, [user, selectedTopic, studyTime]);

  const saveProgress = async () => {
    if (!user || !selectedTopic) return;
    
    try {
      await progressService.updateProgress(
        user.id, 
        selectedTopic.id, 
        selectedTopic.completed ? 100 : 50, 
        timeSpent[selectedTopic.id] || 0
      );
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // ... other component functions

  // Component render remains similar but uses real data
};

export default StudyContent;
```

### Practice Module Update

```typescript
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { questionsService } from "@/services/QuestionsService";
// ... other imports

const PracticeModule = () => {
  const { user } = useAuth();
  const [practiceMode, setPracticeMode] = useState<"mcq" | "flashcard">("mcq");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  
  // ... other state variables

  // Load subjects, questions, and flashcards
  useEffect(() => {
    const loadData = async () => {
      try {
        const subjectsData = await subjectsService.getAll();
        
        if (subjectsData.length > 0) {
          setSelectedSubject(subjectsData[0].id);
          
          const subjectWithTopics = await subjectsService.getById(subjectsData[0].id);
          if (subjectWithTopics.topics.length > 0) {
            setSelectedChapter(subjectWithTopics.topics[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load questions and flashcards when subject/chapter changes
  useEffect(() => {
    if (!selectedSubject || !selectedChapter) return;
    
    const loadQuestions = async () => {
      try {
        const questionsData = await questionsService.getBySubjectAndTopic(
          selectedSubject, 
          selectedChapter
        );
        setQuestions(questionsData);
        
        // Also fetch flashcards
        // Implementation would be similar
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };

    loadQuestions();
  }, [selectedSubject, selectedChapter]);

  // Record user response
  const handleOptionSelect = async (option: string) => {
    if (!user || !currentQuestion) return;
    
    setSelectedOption(option);
    setShowAnswer(true);
    setQuestionsAttempted((prev) => prev + 1);
    
    const isCorrect = option === currentQuestion.correct_answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
    }
    
    try {
      await questionsService.recordResponse(
        user.id,
        currentQuestion.id,
        option,
        isCorrect,
        30 // Assuming time taken is tracked elsewhere
      );
    } catch (error) {
      console.error("Error recording response:", error);
    }
  };

  // ... other component functions

  // Component render remains similar but uses real data
};

export default PracticeModule;
```

## 5. Deployment Preparation

### 1. Optimize Bundle
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { splitVendorChunkPlugin } from 'vite';
import { compression } from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    compression()
  ],
  build: {
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            'react-router-dom',
            'framer-motion'
          ],
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            // ... other UI libraries
          ]
        }
      }
    }
  }
});
```

### 2. Environment Configuration
Create environment files for different environments:
- `.env.development`
- `.env.production`

### 3. CI/CD Setup
Create a GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: true
          enable-commit-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 6. Testing Strategy

### 1. Unit Tests with Vitest
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event
```

```typescript
// src/components/Auth/Login.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    }
  }
}));

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('calls signInWithPassword when form is submitted', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ data: {}, error: null });
    
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

### 2. End-to-End Tests with Playwright
```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete
  await page.waitForURL('/');
  
  // Check if user is logged in by looking for a profile element
  await expect(page.locator('.user-profile')).toBeVisible();
});
```

## 7. Next Steps and Timeline

### Week 1: Backend Setup
- Set up Supabase project
- Create database schema
- Configure authentication
- Set up row-level security policies

### Week 2: Auth and Core Infrastructure
- Implement authentication flow
- Create service layer for data access
- Build protected routes
- Set up state management

### Week 3: Study Module
- Connect subjects and topics to backend
- Implement progress tracking
- Add content management
- Create study session analytics

### Week 4: Practice Module
- Implement questions and flashcards retrieval
- Build response recording
- Add spaced repetition algorithm
- Implement difficulty progression

### Week 5: Analytics Dashboard
- Create performance analytics
- Build achievements system
- Implement skill tree
- Add visualization components

### Week 6: Polishing and Testing
- Add comprehensive test suite
- Optimize performance
- Improve error handling
- Enhance accessibility

### Week 7: Deployment and Documentation
- Set up CI/CD pipeline
- Prepare production environment
- Create user documentation
- Implement monitoring and analytics

## 8. Optimizations and Advanced Features

### Backend Optimizations

1. **Database Indexes for Performance**
   ```sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
   CREATE INDEX idx_user_responses_question_id ON user_responses(question_id);
   CREATE INDEX idx_user_progress_user_id_topic_id ON user_progress(user_id, topic_id);
   CREATE INDEX idx_questions_subject_topic ON questions(subject_id, topic_id);
   CREATE INDEX idx_flashcards_subject_topic ON flashcards(subject_id, topic_id);
   ```

2. **Edge Functions for Low-Latency Operations**
   ```typescript
   // supabase/functions/record-response/index.ts
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   const corsHeaders = {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
   }

   serve(async (req) => {
     if (req.method === 'OPTIONS') {
       return new Response('ok', { headers: corsHeaders })
     }

     try {
       const { questionId, response, isCorrect, timeTaken } = await req.json()
       const supabaseClient = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_ANON_KEY') ?? '',
         { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
       )
       
       const { data: { user } } = await supabaseClient.auth.getUser()
       
       if (!user) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
           status: 401,
         })
       }
       
       const { error } = await supabaseClient
         .from('user_responses')
         .insert({
           user_id: user.id,
           question_id: questionId,
           response,
           is_correct: isCorrect,
           time_taken: timeTaken
         })
       
       if (error) throw error
       
       return new Response(JSON.stringify({ success: true }), {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 200,
       })
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 400,
       })
     }
   })
   ```

3. **Redis Caching Layer for Frequently Accessed Data**
   ```typescript
   // src/services/CacheService.ts
   import { createClient } from 'redis';

   class CacheService {
     private client;
     private isConnected = false;
     private readonly TTL = 60 * 60; // 1 hour

     constructor() {
       this.client = createClient({
         url: import.meta.env.VITE_REDIS_URL
       });
       
       this.client.on('error', (err) => console.error('Redis Client Error', err));
       this.connect();
     }

     private async connect() {
       if (!this.isConnected) {
         await this.client.connect();
         this.isConnected = true;
       }
     }

     async get<T>(key: string): Promise<T | null> {
       try {
         const value = await this.client.get(key);
         return value ? JSON.parse(value) : null;
       } catch (error) {
         console.error('Cache get error:', error);
         return null;
       }
     }

     async set<T>(key: string, value: T, ttl = this.TTL): Promise<void> {
       try {
         await this.client.set(key, JSON.stringify(value), { EX: ttl });
       } catch (error) {
         console.error('Cache set error:', error);
       }
     }

     async invalidate(key: string): Promise<void> {
       try {
         await this.client.del(key);
       } catch (error) {
         console.error('Cache invalidate error:', error);
       }
     }
   }

   export const cacheService = new CacheService();
   ```

### Frontend Performance Enhancements

1. **Request Batching and Fetch Optimization**
   ```typescript
   // src/services/SubjectsService.ts (optimized version)
   import { BaseService } from './BaseService';
   import { cacheService } from './CacheService';
   import type { Database } from '@/types/supabase';

   type Subject = Database['public']['Tables']['subjects']['Row'];

   export class SubjectsService extends BaseService {
     async getAll() {
       // Try to get from cache first
       const cacheKey = 'subjects:all';
       const cachedData = await cacheService.get<Subject[]>(cacheKey);
       
       if (cachedData) {
         return cachedData;
       }
       
       const { data, error } = await this.supabase
         .from('subjects')
         .select('*')
         .order('name');
       
       if (error) throw error;
       
       // Cache the result
       if (data) {
         await cacheService.set(cacheKey, data);
       }
       
       return data;
     }

     async getByIdWithTopics(id: string) {
       const cacheKey = `subjects:${id}:topics`;
       const cachedData = await cacheService.get(cacheKey);
       
       if (cachedData) {
         return cachedData;
       }
       
       const { data, error } = await this.supabase
         .from('subjects')
         .select(`
           *,
           topics (*)
         `)
         .eq('id', id)
         .single();
       
       if (error) throw error;
       
       if (data) {
         await cacheService.set(cacheKey, data);
       }
       
       return data;
     }
     
     // Get multiple subjects with topics in a single request
     async getBatchWithTopics(ids: string[]) {
       if (ids.length === 0) return [];
       
       const { data, error } = await this.supabase
         .from('subjects')
         .select(`
           *,
           topics (*)
         `)
         .in('id', ids);
       
       if (error) throw error;
       return data || [];
     }
   }

   export const subjectsService = new SubjectsService();
   ```

2. **Virtualized Lists for Large Data Sets**
   ```tsx
   // src/components/QuestionsList.tsx
   import React from 'react';
   import { FixedSizeList as List } from 'react-window';
   import AutoSizer from 'react-virtualized-auto-sizer';
   
   interface QuestionsListProps {
     questions: Question[];
     onSelectQuestion: (question: Question) => void;
   }
   
   const QuestionsList: React.FC<QuestionsListProps> = ({ questions, onSelectQuestion }) => {
     const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
       const question = questions[index];
       
       return (
         <div 
           style={style} 
           className="p-3 border-b hover:bg-accent cursor-pointer"
           onClick={() => onSelectQuestion(question)}
         >
           <p className="font-medium truncate">{question.question}</p>
           <div className="flex items-center mt-1 text-xs text-muted-foreground">
             <span className="capitalize">{question.difficulty}</span>
             <span className="mx-1">•</span>
             <span>ID: {question.id.substring(0, 8)}</span>
           </div>
         </div>
       );
     };
     
     return (
       <div className="h-[500px] w-full border rounded-md">
         <AutoSizer>
           {({ height, width }) => (
             <List
               height={height}
               width={width}
               itemCount={questions.length}
               itemSize={70}
             >
               {Row}
             </List>
           )}
         </AutoSizer>
       </div>
     );
   };
   
   export default QuestionsList;
   ```

3. **Memoization for Expensive Calculations**
   ```tsx
   // src/components/PerformanceMetrics.tsx (example of optimization)
   import React, { useMemo } from 'react';
   
   interface PerformanceMetricsProps {
     responses: UserResponse[];
   }
   
   const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ responses }) => {
     // Memoize expensive calculations
     const metrics = useMemo(() => {
       if (!responses.length) {
         return {
           accuracy: 0,
           averageTime: 0,
           totalQuestions: 0,
           strengths: [],
           weaknesses: []
         };
       }
       
       const correctResponses = responses.filter(r => r.is_correct);
       const accuracy = (correctResponses.length / responses.length) * 100;
       const averageTime = responses.reduce((sum, r) => sum + r.time_taken, 0) / responses.length;
       
       // Calculate strengths and weaknesses by topic
       const topicPerformance = responses.reduce((acc, response) => {
         const topicId = response.question?.topic_id;
         if (!topicId) return acc;
         
         if (!acc[topicId]) {
           acc[topicId] = {
             total: 0,
             correct: 0,
             topic: response.question?.topic?.title || 'Unknown Topic'
           };
         }
         
         acc[topicId].total += 1;
         if (response.is_correct) {
           acc[topicId].correct += 1;
         }
         
         return acc;
       }, {});
       
       const topicPerformanceArray = Object.values(topicPerformance)
         .map(tp => ({
           ...tp,
           accuracy: (tp.correct / tp.total) * 100
         }))
         .sort((a, b) => b.accuracy - a.accuracy);
       
       const strengths = topicPerformanceArray
         .filter(tp => tp.accuracy >= 70 && tp.total >= 5)
         .slice(0, 3)
         .map(tp => tp.topic);
       
       const weaknesses = topicPerformanceArray
         .filter(tp => tp.accuracy < 50 && tp.total >= 3)
         .slice(0, 3)
         .map(tp => tp.topic);
       
       return {
         accuracy,
         averageTime,
         totalQuestions: responses.length,
         strengths,
         weaknesses
       };
     }, [responses]);
     
     return (
       <div className="space-y-4">
         <div className="grid grid-cols-3 gap-4">
           <MetricCard title="Accuracy" value={`${metrics.accuracy.toFixed(1)}%`} />
           <MetricCard title="Avg. Time" value={`${metrics.averageTime.toFixed(1)}s`} />
           <MetricCard title="Questions" value={metrics.totalQuestions.toString()} />
         </div>
         
         {/* Rest of the component */}
       </div>
     );
   };
   ```

### Offline Support and Data Persistence

1. **IndexedDB Integration for Offline Functionality**
   ```typescript
   // src/services/OfflineStorage.ts
   import { openDB, DBSchema, IDBPDatabase } from 'idb';

   interface AnkiFlowDB extends DBSchema {
     questions: {
       key: string;
       value: {
         id: string;
         question: string;
         options: string[];
         correctAnswer: string;
         explanation: string;
         difficulty: string;
         subjectId: string;
         topicId: string;
       };
       indexes: { 'by-subject-topic': [string, string] };
     };
     responses: {
       key: string;
       value: {
         id?: string;
         questionId: string;
         response: string;
         isCorrect: boolean;
         timeTaken: number;
         createdAt: number;
         synced: boolean;
       };
       indexes: { 'by-synced': boolean };
     };
     progress: {
       key: string; // topicId
       value: {
         topicId: string;
         completionPercentage: number;
         timeSpent: number;
         lastStudied: number;
         synced: boolean;
       };
     };
   }

   class OfflineStorageService {
     private db: Promise<IDBPDatabase<AnkiFlowDB>>;

     constructor() {
       this.db = this.initDB();
     }

     private initDB() {
       return openDB<AnkiFlowDB>('ankiflow-offline', 1, {
         upgrade(db) {
           // Questions store
           const questionsStore = db.createObjectStore('questions', { keyPath: 'id' });
           questionsStore.createIndex('by-subject-topic', ['subjectId', 'topicId']);

           // Responses store
           const responsesStore = db.createObjectStore('responses', { 
             keyPath: 'id', 
             autoIncrement: true 
           });
           responsesStore.createIndex('by-synced', 'synced');

           // Progress store
           db.createObjectStore('progress', { keyPath: 'topicId' });
         }
       });
     }

     // Cache questions for offline use
     async cacheQuestions(questions: any[]) {
       const db = await this.db;
       const tx = db.transaction('questions', 'readwrite');
       
       for (const question of questions) {
         await tx.store.put({
           id: question.id,
           question: question.question,
           options: question.options,
           correctAnswer: question.correct_answer,
           explanation: question.explanation,
           difficulty: question.difficulty,
           subjectId: question.subject_id,
           topicId: question.topic_id
         });
       }
       
       await tx.done;
     }

     // Get questions by subject and topic
     async getQuestions(subjectId: string, topicId?: string) {
       const db = await this.db;
       
       if (topicId) {
         return db.getAllFromIndex('questions', 'by-subject-topic', [subjectId, topicId]);
       } else {
         // Get all questions for the subject
         const index = db.transaction('questions').store.index('by-subject-topic');
         const keys = await index.getAllKeys();
         const subjectQuestions = keys.filter(key => Array.isArray(key) && key[0] === subjectId);
         
         return Promise.all(
           subjectQuestions.map(key => db.get('questions', key[1]))
         );
       }
     }

     // Store response when offline
     async saveResponse(response: Omit<AnkiFlowDB['responses']['value'], 'id' | 'synced'>) {
       const db = await this.db;
       
       await db.add('responses', {
         ...response,
         createdAt: Date.now(),
         synced: false
       });
     }

     // Get unsynced responses to sync when online
     async getUnsyncedResponses() {
       const db = await this.db;
       return db.getAllFromIndex('responses', 'by-synced', false);
     }

     // Mark responses as synced
     async markResponsesAsSynced(ids: string[]) {
       const db = await this.db;
       const tx = db.transaction('responses', 'readwrite');
       
       for (const id of ids) {
         const response = await tx.store.get(id);
         if (response) {
           response.synced = true;
           await tx.store.put(response);
         }
       }
       
       await tx.done;
     }

     // Save progress locally
     async saveProgress(progress: Omit<AnkiFlowDB['progress']['value'], 'synced'>) {
       const db = await this.db;
       
       // Check if progress exists
       const existingProgress = await db.get('progress', progress.topicId);
       
       if (existingProgress) {
         await db.put('progress', {
           ...existingProgress,
           completionPercentage: progress.completionPercentage,
           timeSpent: existingProgress.timeSpent + progress.timeSpent,
           lastStudied: Date.now(),
           synced: false
         });
       } else {
         await db.add('progress', {
           ...progress,
           lastStudied: Date.now(),
           synced: false
         });
       }
     }

     // Get unsynced progress
     async getUnsyncedProgress() {
       const db = await this.db;
       const tx = db.transaction('progress');
       const all = await tx.store.getAll();
       
       return all.filter(item => !item.synced);
     }
   }

   export const offlineStorage = new OfflineStorageService();
   ```

2. **Service Worker for PWA Capabilities**
   ```typescript
   // public/service-worker.js
   const CACHE_NAME = 'ankiflow-cache-v1';
   const urlsToCache = [
     '/',
     '/index.html',
     '/assets/index.css',
     '/assets/index.js',
   ];

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME)
         .then((cache) => {
           return cache.addAll(urlsToCache);
         })
     );
   });

   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request)
         .then((response) => {
           // Cache hit - return response
           if (response) {
             return response;
           }
           
           return fetch(event.request).then(
             (response) => {
               // Check if we received a valid response
               if(!response || response.status !== 200 || response.type !== 'basic') {
                 return response;
               }

               // Clone the response
               const responseToCache = response.clone();

               caches.open(CACHE_NAME)
                 .then((cache) => {
                   // Don't cache API requests
                   if (!event.request.url.includes('/api/') && 
                       !event.request.url.includes('.supabase.co')) {
                     cache.put(event.request, responseToCache);
                   }
                 });

               return response;
             }
           );
         })
     );
   });

   // Clear old caches when a new version is available
   self.addEventListener('activate', (event) => {
     const cacheWhitelist = [CACHE_NAME];
     
     event.waitUntil(
       caches.keys().then((cacheNames) => {
         return Promise.all(
           cacheNames.map((cacheName) => {
             if (cacheWhitelist.indexOf(cacheName) === -1) {
               return caches.delete(cacheName);
             }
           })
         );
       })
     );
   });
   ```

### Advanced Learning Features

1. **Spaced Repetition Algorithm Implementation**
   ```typescript
   // src/lib/spaced-repetition.ts
   
   interface Card {
     id: string;
     interval?: number; // in days
     repetitions?: number;
     easeFactor?: number;
     dueDate?: Date;
   }
   
   // Performance rating: 0-5 scale where:
   // 0-2: Failed recall (reset)
   // 3: Difficult recall
   // 4: Correct recall with hesitation
   // 5: Perfect recall
   
   export function calculateNextReview(card: Card, performanceRating: number): Card {
     // Default values for new cards
     const interval = card.interval || 0;
     const repetitions = card.repetitions || 0;
     const easeFactor = card.easeFactor || 2.5;
     
     let newInterval: number;
     let newRepetitions: number;
     let newEaseFactor: number;
     
     // Handle failed recall
     if (performanceRating < 3) {
       newInterval = 1;
       newRepetitions = 0;
       newEaseFactor = Math.max(1.3, easeFactor - 0.2);
     } else {
       // Handle successful recall
       newRepetitions = repetitions + 1;
       newEaseFactor = easeFactor + (0.1 - (5 - performanceRating) * (0.08 + (5 - performanceRating) * 0.02));
       
       // Ensure ease factor doesn't go below 1.3
       newEaseFactor = Math.max(1.3, newEaseFactor);
       
       if (newRepetitions === 1) {
         newInterval = 1;
       } else if (newRepetitions === 2) {
         newInterval = 6;
       } else {
         newInterval = Math.round(interval * newEaseFactor);
       }
     }
     
     // Calculate due date
     const now = new Date();
     const dueDate = new Date();
     dueDate.setDate(now.getDate() + newInterval);
     
     return {
       ...card,
       interval: newInterval,
       repetitions: newRepetitions,
       easeFactor: newEaseFactor,
       dueDate
     };
   }
   
   export function getDueCards(cards: Card[]): Card[] {
     const now = new Date();
     return cards.filter(card => {
       if (!card.dueDate) return true; // New cards are always due
       return card.dueDate <= now;
     });
   }
   ```

2. **Real-time Collaboration with Supabase Realtime**
   ```typescript
   // src/lib/realtime.ts
   import { supabase } from './supabase';
   
   export function subscribeToStudyGroup(groupId: string, callback: (payload: any) => void) {
     const channel = supabase
       .channel(`study_group:${groupId}`)
       .on(
         'postgres_changes',
         {
           event: '*',
           schema: 'public',
           table: 'study_group_messages',
           filter: `group_id=eq.${groupId}`
         },
         (payload) => {
           callback(payload);
         }
       )
       .subscribe();
       
     return () => {
       supabase.removeChannel(channel);
     };
   }
   
   export async function sendStudyGroupMessage(groupId: string, userId: string, message: string) {
     const { data, error } = await supabase
       .from('study_group_messages')
       .insert({
         group_id: groupId,
         user_id: userId,
         message,
         created_at: new Date().toISOString()
       });
       
     if (error) throw error;
     return data;
   }
   ```

### Security Enhancements

1. **Rate Limiting Implementation**
   ```typescript
   // supabase/functions/rate-limiter/index.ts
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   import { Redis } from 'https://deno.land/x/redis@v0.29.0/mod.ts'
   
   const redis = await Redis.connect({
     hostname: Deno.env.get('REDIS_HOST') || '',
     port: parseInt(Deno.env.get('REDIS_PORT') || '6379'),
     password: Deno.env.get('REDIS_PASSWORD'),
   })
   
   // Rate limiting middleware
   async function rateLimit(ip: string, limit = 60, window = 60) {
     const key = `rate:${ip}`
     
     // Get current count
     const current = await redis.get(key)
     const count = current ? parseInt(current) : 0
     
     if (count >= limit) {
       return false
     }
     
     // If first request, set expiry
     if (count === 0) {
       await redis.setex(key, window, '1')
     } else {
       await redis.incr(key)
     }
     
     return true
   }
   
   serve(async (req) => {
     const ip = req.headers.get('x-forwarded-for') || 'unknown'
     
     // Check rate limit
     const allowed = await rateLimit(ip)
     
     if (!allowed) {
       return new Response(JSON.stringify({ error: 'Too many requests' }), {
         status: 429,
         headers: { 'Content-Type': 'application/json' }
       })
     }
     
     // Continue with the actual request processing
     return new Response(JSON.stringify({ message: 'Success' }), {
       headers: { 'Content-Type': 'application/json' }
     })
   })
   ```

2. **Content Security Policy Setup**
   ```html
   <!-- Add to index.html -->
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;">
   ```

### Analytics and Monitoring

1. **Error Tracking with Sentry**
   ```typescript
   // src/main.tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { BrowserRouter } from 'react-router-dom';
   import * as Sentry from '@sentry/react';
   import App from './App';
   import './index.css';
   
   if (import.meta.env.PROD) {
     Sentry.init({
       dsn: import.meta.env.VITE_SENTRY_DSN,
       integrations: [
         new Sentry.BrowserTracing({
           routingInstrumentation: Sentry.reactRouterV6Instrumentation(
             React.useEffect,
           ),
         }),
         new Sentry.Replay(),
       ],
       tracesSampleRate: 0.1,
       replaysSessionSampleRate: 0.1,
       replaysOnErrorSampleRate: 1.0,
     });
   }
   
   ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
     <React.StrictMode>
       <BrowserRouter>
         <App />
       </BrowserRouter>
     </React.StrictMode>
   );
   ```

2. **User Behavior Analytics**
   ```typescript
   // src/lib/analytics.ts
   
   interface AnalyticsEvent {
     name: string;
     properties?: Record<string, any>;
   }
   
   class Analytics {
     private userId: string | null = null;
     
     setUser(id: string) {
       this.userId = id;
     }
     
     trackEvent(event: AnalyticsEvent) {
       if (import.meta.env.DEV) {
         console.log('Analytics event:', event);
         return;
       }
       
       // Send to backend analytics endpoint
       fetch('/api/analytics/event', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           userId: this.userId,
           eventName: event.name,
           properties: event.properties,
           timestamp: new Date().toISOString(),
         }),
       }).catch(err => {
         console.error('Failed to send analytics event:', err);
       });
     }
     
     trackPageView(path: string) {
       this.trackEvent({
         name: 'page_view',
         properties: { path }
       });
     }
     
     trackStudySession(subjectId: string, topicId: string, durationSeconds: number) {
       this.trackEvent({
         name: 'study_session',
         properties: {
           subjectId,
           topicId,
           durationSeconds
         }
       });
     }
     
     trackQuestionAnswer(questionId: string, isCorrect: boolean, timeSpentSeconds: number) {
       this.trackEvent({
         name: 'answer_question',
         properties: {
           questionId,
           isCorrect,
           timeSpentSeconds
         }
       });
     }
   }
   
   export const analytics = new Analytics();
   ```

## Updated Implementation Timeline

### Week 1-2: Backend Setup and Core Features
- Set up all database tables with optimized indexes
- Implement auth flow and security measures
- Create core service layer with caching
- Deploy edge functions

### Week 3-4: Frontend Components and Offline Support
- Build optimized React components with virtualization
- Implement offline storage with IndexedDB
- Add PWA capabilities with service worker
- Create spaced repetition algorithm

### Week 5-6: Advanced Features and Performance
- Add real-time collaborative features
- Implement analytics and monitoring
- Optimize bundle size and loading performance
- Set up CI/CD pipeline with monitoring

### Week 7-8: Testing, Optimization and Launch
- Write end-to-end tests
- Performance testing and optimization
- Security auditing
- Documentation and user guides 