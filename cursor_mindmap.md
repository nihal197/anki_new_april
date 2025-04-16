# AnkiFlow Project Mindmap

## 1. Project Structure
- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React useState/useEffect hooks
- **Animation**: Framer Motion
- **Backend**: Supabase (integration prepared but not fully implemented)
- **Build Tool**: Vite

## 2. Core Components
- **App.tsx**: Main application component with routing setup
- **NavigationBar.tsx**: Main navigation with links to primary sections
- **ThemeProvider.tsx**: Dark/light mode management
- **Home Component**: Dashboard and entry point

## 3. Primary Features
- **Study System**
  - Content organized by subjects and topics
  - Learning materials with explanations
  - Progress tracking per subject
  - Time spent tracking
  - Mobile-responsive layout

- **Practice System**
  - Multiple choice questions (MCQ mode)
  - Flashcards with spaced repetition
  - Subject/chapter filtering
  - Difficulty levels (easy, medium, hard)
  - Interactive UI with animations
  - Confetti effects for correct answers
  - Known/unknown card tracking

- **Performance Analytics**
  - Strengths and weaknesses identification
  - Response time tracking
  - Syllabus coverage visualization
  - Achievement system
  - Skill tree with levels
  - Detailed breakdowns by subject
  - Interactive charts and visualizations

## 4. Data Models
- **Question**
  - ID, question text, options, correct answer
  - Explanation for answers
  - Difficulty level
  - Subject and chapter categorization

- **Flashcard**
  - ID, front content, back content
  - Subject and chapter categorization

- **User Performance**
  - Strengths and weaknesses
  - Average response time
  - Frequently missed concepts
  - Syllabus coverage percentage
  - Achievements (unlocked/locked)
  - Skill levels by subject and subtopic

- **Study Materials**
  - Organized by subject and topics
  - Completion status tracking
  - Content with explanations

## 5. Workflow
- **User Journey**
  1. Landing on home dashboard
  2. Selecting study/practice/analytics
  3. Filtering by subject/chapter
  4. Engaging with content
  5. Receiving feedback and progress updates
  6. Reviewing performance analytics

- **Content Flow**
  1. Subjects → Chapters → Topics → Content
  2. MCQs and flashcards filtered by subject/chapter
  3. Performance data aggregated from study and practice sessions

- **Data Persistence**
  - Prepared for Supabase integration
  - Types defined for database schema
  - Currently using mock data in frontend

## 6. UI/UX Elements
- **Theme**: Dark/light mode with consistent color palette
- **Components**: Cards, tabs, progress bars, badges
- **Animations**: Page transitions, card flips, confetti effects
- **Responsive Design**: Mobile and desktop optimized layouts
- **Accessibility**: Semantic HTML, keyboard navigation

## 7. Potential Enhancements
- **Backend Implementation**
  - Complete Supabase integration
  - User authentication
  - Real-time data synchronization

- **Advanced Features**
  - AI-driven content recommendations
  - Social learning capabilities
  - Expanded achievement system
  - Custom deck creation
  - Import/export functionality 