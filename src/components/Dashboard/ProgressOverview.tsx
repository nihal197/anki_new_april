import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  BarChart,
  Trophy,
  Star,
  Award,
  BookOpen,
} from "lucide-react";

interface SubjectProgress {
  subject: string;
  progress: number;
  color: string;
}

interface Badge {
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ProgressOverviewProps {
  level?: number;
  levelTitle?: string;
  overallProgress?: number;
  subjects?: SubjectProgress[];
  badges?: Badge[];
  streakDays?: number;
  pointsEarned?: number;
}

const ProgressOverview = ({
  level = 5,
  levelTitle = "Scholar",
  overallProgress = 68,
  subjects = [
    { subject: "Mathematics", progress: 75, color: "bg-blue-500" },
    { subject: "Physics", progress: 60, color: "bg-purple-500" },
    { subject: "Chemistry", progress: 85, color: "bg-green-500" },
    { subject: "Biology", progress: 45, color: "bg-yellow-500" },
  ],
  badges = [
    {
      name: "Math Master",
      icon: <PieChart className="h-5 w-5" />,
      description: "Completed 75% of Math curriculum",
    },
    {
      name: "Physics Pro",
      icon: <BarChart className="h-5 w-5" />,
      description: "Solved 50 Physics problems",
    },
    {
      name: "Chemistry Whiz",
      icon: <Star className="h-5 w-5" />,
      description: "Achieved 90% in Chemistry quiz",
    },
  ],
  streakDays = 12,
  pointsEarned = 2450,
}: ProgressOverviewProps) => {
  return (
    <div className="w-full bg-background p-4 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Progress Card */}
        <Card className="col-span-1 md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                Level {level} {levelTitle}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Progress</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">{streakDays} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">{pointsEarned} points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress Card */}
        <Card className="col-span-1 md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Subject Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{subject.subject}</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${subject.color} rounded-full`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges Card */}
        <Card className="col-span-1 md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Earned Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {badges.map((badge, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                  {index < badges.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1"
              >
                <BookOpen className="h-3 w-3" />
                <span>View All Badges</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressOverview;
