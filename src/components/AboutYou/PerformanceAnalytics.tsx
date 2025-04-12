import React from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Activity,
  Award,
  Brain,
  Clock,
  Target,
  BookOpen,
  Zap,
} from "lucide-react";

interface PerformanceAnalyticsProps {
  strengths?: string[];
  weaknesses?: string[];
  averageTimePerQuestion?: number;
  frequentlyMissedConcepts?: { concept: string; percentage: number }[];
  syllabusCoverage?: number;
  achievements?: { title: string; description: string; unlocked: boolean }[];
  skillLevels?: { skill: string; level: number; maxLevel: number }[];
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  strengths = ["Geometry", "Algebra", "Modern Physics"],
  weaknesses = ["Trigonometry", "Organic Chemistry", "Thermodynamics"],
  averageTimePerQuestion = 45,
  frequentlyMissedConcepts = [
    { concept: "Integration by Parts", percentage: 75 },
    { concept: "Acid-Base Reactions", percentage: 68 },
    { concept: "Newton's Laws Applications", percentage: 62 },
  ],
  syllabusCoverage = 68,
  achievements = [
    {
      title: "Math Master",
      description: "Completed all math modules with 90%+ accuracy",
      unlocked: true,
    },
    {
      title: "Physics Pioneer",
      description: "Solved 100 physics problems",
      unlocked: true,
    },
    {
      title: "Chemistry Champion",
      description: "Mastered all periodic table elements",
      unlocked: false,
    },
    {
      title: "Biology Brilliance",
      description: "Completed all biology chapters",
      unlocked: false,
    },
  ],
  skillLevels = [
    { skill: "Mathematics", level: 7, maxLevel: 10 },
    { skill: "Physics", level: 6, maxLevel: 10 },
    { skill: "Chemistry", level: 4, maxLevel: 10 },
    { skill: "Biology", level: 5, maxLevel: 10 },
  ],
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Your Performance Analytics
        </h1>
        <p className="text-gray-600">
          Track your progress, identify areas for improvement, and celebrate
          your achievements
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths-weaknesses">
            Strengths & Weaknesses
          </TabsTrigger>
          <TabsTrigger value="skill-tree">Skill Tree</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500" />
                  Syllabus Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {syllabusCoverage}%
                      </span>
                    </div>
                    <svg className="h-32 w-32" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={`${syllabusCoverage * 2.83} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    You've covered {syllabusCoverage}% of the total syllabus.
                    Keep going!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                  Average Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-purple-600 mb-4">
                    {averageTimePerQuestion}s
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (60 - averageTimePerQuestion) * 2)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {averageTimePerQuestion < 30
                      ? "Excellent speed!"
                      : averageTimePerQuestion < 45
                        ? "Good pace!"
                        : "Try to improve your speed"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <BookOpen className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Completed Physics Module 3
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Mastered Integration Techniques
                      </p>
                      <p className="text-xs text-gray-500">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Earned "Quick Thinker" Badge
                      </p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-red-500" />
                Frequently Missed Concepts
              </CardTitle>
              <CardDescription>
                Focus on these areas to improve your overall performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {frequentlyMissedConcepts.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {item.concept}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.percentage}% incorrect
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths-weaknesses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Your Strengths
                </CardTitle>
                <CardDescription>
                  Topics where you consistently perform well
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-green-50 rounded-lg"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{strength}</p>
                        <p className="text-xs text-green-600">
                          You excel at this topic!
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-amber-500">
              <CardHeader>
                <CardTitle className="text-amber-600 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Topics that need more attention and practice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-amber-50 rounded-lg"
                    >
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <span className="text-amber-600 font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">{weakness}</p>
                        <p className="text-xs text-amber-600">
                          Focus on improving this area
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                Subject-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Mathematics</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Physics</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Chemistry</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Biology</span>
                    <span>70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skill-tree" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillLevels.map((skill, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{skill.skill}</CardTitle>
                  <CardDescription>
                    Level {skill.level} / {skill.maxLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 h-4 rounded-full">
                      <div
                        className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${(skill.level / skill.maxLevel) * 100}%`,
                        }}
                      >
                        <span className="text-xs text-white font-bold">
                          {skill.level}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-10 gap-1">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full ${i < skill.level ? "bg-blue-500" : "bg-gray-200"}`}
                        ></div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-gray-600">
                        {skill.level < 3
                          ? "Beginner"
                          : skill.level < 6
                            ? "Intermediate"
                            : skill.level < 9
                              ? "Advanced"
                              : "Expert"}{" "}
                        level
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {skill.maxLevel - skill.level} more levels to reach
                        mastery
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skill Development Path</CardTitle>
              <CardDescription>
                Your journey to mastery across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8 relative">
                  <div className="flex">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center z-10 mr-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 flex-1">
                      <h4 className="font-medium text-blue-700">
                        Fundamentals Mastered
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        You've completed the basic concepts across all subjects
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Completed
                      </Badge>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center z-10 mr-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 flex-1">
                      <h4 className="font-medium text-blue-700">
                        Intermediate Concepts
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        You're currently working through more advanced topics
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100">
                        In Progress
                      </Badge>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center z-10 mr-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex-1">
                      <h4 className="font-medium text-gray-700">
                        Advanced Applications
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Complex problem-solving and application-based learning
                      </p>
                      <Badge className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-200">
                        Locked
                      </Badge>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center z-10 mr-4">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 flex-1">
                      <h4 className="font-medium text-gray-700">
                        Mastery & Expertise
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete mastery of all subjects and competitive exam
                        readiness
                      </p>
                      <Badge className="mt-2 bg-gray-200 text-gray-700 hover:bg-gray-200">
                        Locked
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className={`${achievement.unlocked ? "border-2 border-yellow-400" : "opacity-75"}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      <Award
                        className={`h-5 w-5 mr-2 ${achievement.unlocked ? "text-yellow-500" : "text-gray-400"}`}
                      />
                      {achievement.title}
                    </CardTitle>
                    {achievement.unlocked && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Unlocked
                      </Badge>
                    )}
                    {!achievement.unlocked && (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        Locked
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`p-4 rounded-lg ${achievement.unlocked ? "bg-yellow-50" : "bg-gray-50"}`}
                  >
                    <div className="flex justify-center">
                      <div
                        className={`h-16 w-16 rounded-full flex items-center justify-center ${achievement.unlocked ? "bg-yellow-100" : "bg-gray-200"}`}
                      >
                        <Award
                          className={`h-8 w-8 ${achievement.unlocked ? "text-yellow-600" : "text-gray-400"}`}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm mt-3">
                      {achievement.unlocked
                        ? "Congratulations on earning this achievement!"
                        : "Keep studying to unlock this achievement"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Progress</CardTitle>
              <CardDescription>
                You've unlocked {achievements.filter((a) => a.unlocked).length}{" "}
                out of {achievements.length} achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={
                    (achievements.filter((a) => a.unlocked).length /
                      achievements.length) *
                    100
                  }
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Advanced</span>
                  <span>Expert</span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-medium">Next achievements to unlock:</h4>
                  <ul className="space-y-2">
                    {achievements
                      .filter((a) => !a.unlocked)
                      .map((achievement, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <Award className="h-3 w-3 text-gray-500" />
                          </div>
                          {achievement.title} - {achievement.description}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
