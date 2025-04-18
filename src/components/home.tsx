import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Brain,
  User as UserIcon,
  Bell,
  ChevronRight,
  Zap,
  Calendar,
  BookMarked,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { progressService } from "@/services/ProgressService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

// Define interface for progress data
interface ProgressData {
  id: string;
  completion_percentage: number;
  subjects?: {
    id: string;
    name: string;
  };
}

// Define interface for extended user
interface ExtendedUser {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
}

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    overall: 0,
    subjects: [] as Array<{id: string, name: string, progress: number, color: string}>,
    level: 1,
    badges: [] as Array<{name: string, icon: string, description: string}>,
    streakDays: 0,
    points: 0,
  });
  const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);

  // Fetch user progress data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get user analytics
        const analytics = await progressService.getUserAnalytics(user.id);
        
        // Get user profile
        const profile = await progressService.getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile as ExtendedUser);
        }
        
        // Get user achievements
        const achievements = await progressService.getUserAchievements(user.id);
        
        // Get formatted progress data
        const formattedProgressData = await progressService.getFormattedProgressData(user.id);
        
        // Map subject progress data
        const subjectMap = new Map<string, {id: string, name: string, progress: number, color: string}>();
        
        // Process the formatted data
        formattedProgressData.forEach(item => {
          if (item.subjectInfo?.id) {
            const subjectId = item.subjectInfo.id;
            const subjectName = item.subjectInfo.name;
            
            if (!subjectMap.has(subjectId)) {
              subjectMap.set(subjectId, {
                id: subjectId,
                name: subjectName,
                progress: item.completion_percentage,
                color: getColorForSubject(subjectName),
              });
            }
          }
        });
        
        const subjectArray = Array.from(subjectMap.values());
        
        // Calculate overall progress
        const overall = subjectArray.length > 0
          ? Math.round(subjectArray.reduce((acc, subject) => acc + subject.progress, 0) / subjectArray.length)
          : 0;
        
        // Set user data
        setUserData({
          overall,
          subjects: subjectArray,
          level: calculateLevel(analytics.completedTopics),
          badges: achievements.map(achievement => ({
            name: achievement.name,
            icon: achievement.icon,
            description: achievement.description,
          })),
          streakDays: analytics.streakDays,
          points: analytics.totalPoints,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Could not load your dashboard data. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  // Calculate user level based on completed topics
  const calculateLevel = (completedTopics) => {
    if (completedTopics > 15) return 5;
    if (completedTopics > 10) return 4;
    if (completedTopics > 7) return 3;
    if (completedTopics > 3) return 2;
    return 1;
  };
  
  // Get color for subject progress bar
  const getColorForSubject = (subjectName) => {
    if (!subjectName) return 'bg-blue-500';
    
    const subjectColors = {
      'Mathematics': 'bg-blue-500',
      'Quantitative Reasoning': 'bg-blue-500',
      'Physics': 'bg-purple-500',
      'Chemistry': 'bg-green-500',
      'Biology': 'bg-yellow-500',
      'Verbal Reasoning': 'bg-red-500',
      'Data Structures': 'bg-cyan-500',
      'Algorithms': 'bg-indigo-500',
    };
    
    const name = subjectName.toLowerCase();
    
    for (const [key, value] of Object.entries(subjectColors)) {
      if (name.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return 'bg-blue-500';
  };

  // Mock data for tasks and topics (these would be replaced with real data in a full implementation)
  const upcomingTasks = [
    {
      id: 1,
      title: "Physics Mock Test",
      date: "2023-10-15",
      type: "test",
      urgent: true,
    },
    {
      id: 2,
      title: "Chemistry Revision",
      date: "2023-10-12",
      type: "revision",
      urgent: false,
    },
    {
      id: 3,
      title: "Math Problem Set",
      date: "2023-10-10",
      type: "assignment",
      urgent: true,
    },
  ];

  const recentTopics = [
    { id: 1, title: "Quantum Mechanics", subject: "Physics", progress: 65 },
    { id: 2, title: "Organic Chemistry", subject: "Chemistry", progress: 40 },
    { id: 3, title: "Calculus", subject: "Mathematics", progress: 80 },
  ];

  const motivationalQuote = {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  };

  // Loading state rendering
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-52 w-full col-span-2" />
            <Skeleton className="h-52 w-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage
                src={userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={userProfile?.display_name || "User"}
              />
              <AvatarFallback>{userProfile?.display_name?.substring(0, 2) || "?"}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">Welcome back, {userProfile?.display_name || "Student"}!</h1>
              <p className="text-muted-foreground">
                Let's continue your learning journey
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline">
              <UserIcon className="h-5 w-5 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Progress Overview Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Overall Progress Card */}
            <Card className="col-span-1 md:col-span-1 bg-gradient-to-br from-primary/10 to-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-32">
                  <motion.div
                    className="relative h-32 w-32"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {userData.overall}%
                      </span>
                    </div>
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${userData.overall * 2.83} 283`}
                        className="text-primary"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Progress Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Subject Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.subjects.length > 0 ? (
                    userData.subjects.map((subject, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {subject.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {subject.progress}%
                          </span>
                        </div>
                        <Progress
                          value={subject.progress}
                          className={subject.color}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-muted-foreground text-center mb-4">
                        No subject progress yet. Start studying to see your progress!
                      </p>
                      <Link to="/study">
                        <Button>Start Learning</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="col-span-1 md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Badges Earned</p>
                    <p className="text-xl font-bold">
                      {userData.badges.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-red-100 text-red-600 p-2 rounded-full">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Points</p>
                    <p className="text-xl font-bold">
                      {userData.points}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Streak</p>
                    <p className="text-xl font-bold">
                      {userData.streakDays} days 🔥
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Tasks */}
          <Card className="col-span-1 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow dark:bg-card">
            <CardHeader className="bg-gray-50 dark:bg-card/60 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Your scheduled activities</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-white dark:bg-card/80 hover:bg-gray-50 dark:hover:bg-card/50 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full ${task.urgent ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {task.type === "test" && <BookOpen className="h-4 w-4" />}
                      {task.type === "revision" && (
                        <BookMarked className="h-4 w-4" />
                      )}
                      {task.type === "assignment" && (
                        <Brain className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due:{" "}
                        {new Date(task.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {task.urgent && <Badge variant="destructive">Urgent</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <Button variant="outline" className="w-full">
                View All Tasks
              </Button>
            </CardFooter>
          </Card>

          {/* Middle Column - Recent Topics */}
          <Card className="col-span-1 overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow dark:bg-card">
            <CardHeader className="bg-gray-50 dark:bg-card/60 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Recent Topics
              </CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {recentTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3 rounded-lg border border-border/60 bg-white dark:bg-card/80 hover:bg-gray-50 dark:hover:bg-card/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{topic.title}</h3>
                      <Badge variant="outline" className="bg-primary/5">{topic.subject}</Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} className="h-2" />
                    </div>
                    <Link to="/study" className="block">
                      <Button size="sm" className="w-full">
                        Continue Learning
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4">
              <Button variant="outline" className="w-full">
                Browse All Topics
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - Quick Access & Motivation */}
          <div className="col-span-1 space-y-5">
            {/* Motivational Quote Card */}
            <Card className="border border-border/40 bg-gradient-to-r from-primary/5 to-background shadow-sm overflow-hidden dark:from-primary/10 dark:to-background">
              <CardContent className="p-5">
                <blockquote className="italic text-lg font-serif text-center">
                  "{motivationalQuote.text}"
                </blockquote>
                <p className="text-right text-sm text-muted-foreground mt-2">
                  — {motivationalQuote.author}
                </p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="border border-border/40 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-card/60 pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-center gap-3 pb-2">
                  {userData.badges.map((badge, index) => (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-24 flex flex-col items-center text-center p-3 rounded-lg border bg-white dark:bg-card/80 shadow-sm"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <p className="text-xs font-medium">{badge.name}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Link to="/study" className="col-span-1">
                <Card className="h-full border border-border/40 bg-white dark:bg-card/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <BookOpen className="h-5 w-5 text-blue-700" />
                    </div>
                    <h3 className="font-medium">Study</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Interactive lessons
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/practice" className="col-span-1">
                <Card className="h-full border border-border/40 bg-white dark:bg-card/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                      <Brain className="h-5 w-5 text-purple-700" />
                    </div>
                    <h3 className="font-medium">Practice</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Quizzes & flashcards
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/about-you" className="col-span-1">
                <Card className="h-full border border-border/40 bg-white dark:bg-card/80 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <UserIcon className="h-5 w-5 text-green-700" />
                    </div>
                    <h3 className="font-medium">About You</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Analytics & progress
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Button variant="default" className="w-full mt-2" asChild>
              <Link to="/practice">
                Go to Practice Area
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
