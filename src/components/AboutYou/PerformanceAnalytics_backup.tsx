import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Award,
  Brain,
  Star,
  AlertTriangle,
} from "lucide-react";

// Define subjects with appropriate dark mode colors
const subjects = [
  { 
    name: "Mathematics", 
    level: 7, 
    color: "bg-blue-500", 
    darkColor: "bg-blue-400" 
  },
  { 
    name: "Physics", 
    level: 6, 
    color: "bg-purple-500",
    darkColor: "bg-purple-400" 
  },
  { 
    name: "Chemistry", 
    level: 4, 
    color: "bg-green-500",
    darkColor: "bg-green-400" 
  },
  { 
    name: "Biology", 
    level: 5, 
    color: "bg-yellow-500",
    darkColor: "bg-yellow-400" 
  },
];

export function PerformanceAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-card/40 dark:bg-transparent p-6 rounded-xl w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Performance Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your progress, identify areas for improvement, and celebrate
          your achievements
        </p>
      </div>

      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths-weaknesses">
            Strengths & Weaknesses
          </TabsTrigger>
          <TabsTrigger value="skill-tree">Skill Tree</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                  Your Strengths
                </CardTitle>
                <CardDescription>
                  Topics where you consistently perform well
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Geometry", "Algebra", "Modern Physics"].map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900"
                    >
                      <div className="font-medium">{strength}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500 dark:text-orange-400" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Topics that need more attention and practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Trigonometry", "Organic Chemistry", "Thermodynamics"].map((weakness, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900"
                    >
                      <div className="font-medium">{weakness}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strengths-weaknesses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                Subject Performance
              </CardTitle>
              <CardDescription>
                Your performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mt-4">
                <h3 className="text-lg font-medium">Subject Performance</h3>
                
                {subjects.map((subject) => (
                  <div key={subject.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-sm text-muted-foreground">Level {subject.level}/10</span>
                    </div>
                    <Progress 
                      value={subject.level * 10} 
                      className={`h-2 ${subject.color} dark:${subject.darkColor}`} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skill-tree" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Tree</CardTitle>
              <CardDescription>Your learning path and skill development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.name} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{subject.name}</h3>
                    </div>
                    <Progress 
                      value={subject.level * 10} 
                      className={`h-2 ${subject.color} dark:${subject.darkColor}`} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-500 dark:text-amber-400" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                Badges and milestones you've reached in your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg border bg-primary/5 dark:bg-primary/20">
                  <h3 className="font-semibold mb-2">Math Master</h3>
                  <p className="text-muted-foreground text-sm">Completed all math modules with 90%+ accuracy</p>
                </div>
                <div className="p-4 rounded-lg border bg-primary/5 dark:bg-primary/20">
                  <h3 className="font-semibold mb-2">Physics Pioneer</h3>
                  <p className="text-muted-foreground text-sm">Solved 100 physics problems</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/40">
                  <h3 className="font-semibold mb-2 text-muted-foreground">Chemistry Champion</h3>
                  <p className="text-muted-foreground text-sm">Mastered all periodic table elements</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/40">
                  <h3 className="font-semibold mb-2 text-muted-foreground">Biology Brilliance</h3>
                  <p className="text-muted-foreground text-sm">Completed all biology chapters</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 