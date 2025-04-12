import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Brain,
  User,
  Bell,
  ChevronRight,
  Zap,
  Calendar,
  BookMarked,
} from "lucide-react";
import NavigationBar from "./NavigationBar";

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

const Home = () => {
  // Mock data for the dashboard
  const studentProgress = {
    overall: 68,
    subjects: [
      { name: "Mathematics", progress: 75, color: "bg-blue-500" },
      { name: "Physics", progress: 62, color: "bg-purple-500" },
      { name: "Chemistry", progress: 48, color: "bg-green-500" },
      { name: "Biology", progress: 85, color: "bg-yellow-500" },
    ],
    level: 5,
    badges: [
      {
        name: "Math Master",
        icon: "🧮",
        description: "Completed 75% of Math syllabus",
      },
      {
        name: "Physics Pro",
        icon: "⚛️",
        description: "Solved 100 Physics problems",
      },
      {
        name: "Streak Keeper",
        icon: "🔥",
        description: "Maintained a 7-day study streak",
      },
    ],
    streakDays: 7,
    points: 1250,
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 overflow-auto">
        {/* Header with user info */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=student123"
                alt="Student"
              />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Rahul!</h1>
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
              <User className="h-5 w-5 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Progress Overview Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Level {studentProgress.level} Scholar
            </Badge>
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
                        {studentProgress.overall}%
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
                        strokeDasharray={`${studentProgress.overall * 2.83} 283`}
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
                  {studentProgress.subjects.map((subject, index) => (
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
                  ))}
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
                      {studentProgress.badges.length}
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
                      {studentProgress.points}
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
                      {studentProgress.streakDays} days 🔥
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
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Your scheduled activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
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
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Tasks
              </Button>
            </CardFooter>
          </Card>

          {/* Middle Column - Recent Topics */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Recent Topics
              </CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{topic.title}</h3>
                      <Badge variant="outline">{topic.subject}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{topic.progress}%</span>
                      </div>
                      <Progress value={topic.progress} />
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 w-full">
                      Continue Learning
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Browse All Topics
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - Quick Access & Motivation */}
          <div className="col-span-1 space-y-6">
            {/* Motivational Quote Card - Moved up to replace Quick Access */}
            <Card className="bg-gradient-to-r from-primary/10 to-background mb-6">
              <CardContent className="pt-6">
                <blockquote className="italic text-lg text-center">
                  "{motivationalQuote.text}"
                </blockquote>
                <p className="text-right text-sm text-muted-foreground mt-2">
                  — {motivationalQuote.author}
                </p>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {studentProgress.badges.map((badge, index) => (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-24 flex flex-col items-center text-center p-3 rounded-lg border"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <p className="text-xs font-medium">{badge.name}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
