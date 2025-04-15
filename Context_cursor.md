
Mermaid Code flow - 
graph TD
    Start[User Launches ExamMaster] --> Dashboard[Dashboard Home]
    
    subgraph "Dashboard Flow"
        Dashboard --> ViewProgress[View Progress Meters]
        Dashboard --> CheckTasks[Check Upcoming Tasks]
        Dashboard --> AccessMaterials[Access Study Materials]
        Dashboard --> ViewGamification[View Badges & Level]
        Dashboard --> NavigateStudy[Navigate to Study Page]
        Dashboard --> NavigatePractice[Navigate to Practice Page]
        Dashboard --> NavigateAboutYou[Navigate to About You Page]
    end
    
    subgraph "Study Page Flow"
        NavigateStudy --> StudyHome[Study Page Home]
        StudyHome --> SelectTopic[Select Topic to Study]
        SelectTopic --> ViewContent[View Adaptive Content]
        ViewContent --> InteractContent[Interact with Learning Material]
        InteractContent --> AnswerQuestions[Answer Embedded Questions]
        AnswerQuestions --> ReceiveFeedback[Receive Immediate Feedback]
        ReceiveFeedback --> AdjustDifficulty[AI Adjusts Content Difficulty]
        AdjustDifficulty --> ContinueStudy[Continue Studying]
        AdjustDifficulty --> EndStudy[End Study Session]
        
        StudyHome --> CheckSidebar[Check Progress Sidebar]
        CheckSidebar --> ViewCompletionStatus[View Completion Status]
        CheckSidebar --> ViewTimeSpent[View Time Spent]
    end
    
    subgraph "Practice Page Flow"
        NavigatePractice --> PracticeHome[Practice Page Home]
        PracticeHome --> SelectMode[Select Practice Mode]
        
        SelectMode -->|MCQ Mode| StartMCQ[Start MCQ Session]
        StartMCQ --> AnswerMCQ[Answer Multiple Choice Questions]
        AnswerMCQ --> GetMCQFeedback[Get Instant Feedback]
        GetMCQFeedback --> EarnPoints[Earn Points/Rewards]
        EarnPoints --> NextMCQ[Next Question or End Session]
        NextMCQ -->|Continue| AnswerMCQ
        NextMCQ -->|End| ReviewMCQResults[Review MCQ Results]
        
        SelectMode -->|Flashcard Mode| StartFlashcards[Start Flashcard Session]
        StartFlashcards --> ViewFlashcard[View Flashcard]
        ViewFlashcard --> SwipeCard[Swipe Card Left/Right]
        SwipeCard -->|Know| MarkKnown[Mark as Known]
        SwipeCard -->|Don't Know| MarkUnknown[Mark as Unknown]
        MarkKnown --> NextCard[Next Card]
        MarkUnknown --> NextCard
        NextCard -->|More Cards| ViewFlashcard
        NextCard -->|End| ReviewFlashcardResults[Review Flashcard Results]
    end
    
    subgraph "About You Page Flow"
        NavigateAboutYou --> AboutYouHome[About You Page Home]
        AboutYouHome --> ViewAnalytics[View Performance Analytics]
        ViewAnalytics --> CheckStrengths[Check Strengths]
        ViewAnalytics --> CheckWeaknesses[Check Weaknesses]
        ViewAnalytics --> ViewMetrics[View Performance Metrics]
        
        AboutYouHome --> ViewSkillTree[View Skill Tree]
        ViewSkillTree --> TrackProgress[Track Skill Progress]
        
        AboutYouHome --> ViewAchievements[View Achievements]
        ViewAchievements --> UnlockBadges[See Unlocked/Locked Badges]
    end
    
    ReviewMCQResults --> Dashboard
    ReviewFlashcardResults --> Dashboard
    EndStudy --> Dashboard
    TrackProgress --> Dashboard
    UnlockBadges --> Dashboard

