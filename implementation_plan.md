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