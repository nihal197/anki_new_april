import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Activity,
  Award,
  Brain,
  Clock,
  Target,
  BookOpen,
  Zap,
  Star,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  Lock,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { progressService } from "@/services/ProgressService";
import { achievementsService } from "@/services/AchievementsService";
import { subjectsService } from "@/services/SubjectsService";

interface PerformanceAnalyticsProps {}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface SkillLevel {
  skill: string;
  level: number;
  maxLevel: number;
}

interface MissedConcept {
  concept: string;
  percentage: number;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(null);
  
  // States for analytics data
  const [loading, setLoading] = useState(true);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [averageTimePerQuestion, setAverageTimePerQuestion] = useState<number>(0);
  const [frequentlyMissedConcepts, setFrequentlyMissedConcepts] = useState<MissedConcept[]>([]);
  const [syllabusCoverage, setSyllabusCoverage] = useState<number>(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Load subjects first for reference
        const subjectsData = await subjectsService.getAll();
        const subjectsMap: Record<string, string> = {};
        subjectsData.forEach(subject => {
          subjectsMap[subject.id] = subject.name;
        });
        setSubjects(subjectsMap);
        
        // Load user analytics from progress service
        const analytics = await progressService.getUserAnalytics(user.id);
        
        // Load user progress data
        const progressData = await progressService.getProgressByUserId(user.id);
        
        // Calculate syllabus coverage
        let completedTopics = 0;
        let totalTopics = 0;
        
        for (const subject of subjectsData) {
          const subjectWithTopics = await subjectsService.getById(subject.id);
          totalTopics += subjectWithTopics.topics.length;
          
          // Count completed topics for this subject
          const completedTopicsForSubject = progressData.filter(
            p => p.subject_id === subject.id && p.completion_percentage === 100
          ).length;
          
          completedTopics += completedTopicsForSubject;
        }
        
        setSyllabusCoverage(
          totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
        );
        
        // Set average time
        setAverageTimePerQuestion(Math.round(analytics.averageTime));
        
        // Check existing achievements
        await achievementsService.checkAchievements(user.id);
        const userAchievements = await achievementsService.getUserAchievements(user.id);
        const allAchievements = await achievementsService.getAll();
        
        // Format achievements
        const formattedAchievements: Achievement[] = allAchievements.map(achievement => {
          const isUnlocked = userAchievements.some(
            ua => ua.achievement_id === achievement.id
          );
          
          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            unlocked: isUnlocked,
          };
        });
        
        setAchievements(formattedAchievements);
        
        // Initialize subject performance tracking
        let subjectPerformance: Record<string, { correct: number, total: number }> = {};
        
        // For strengths and weaknesses, we'll analyze response data
        if (progressData.length > 0) {
          // Group by subject_id to calculate performance per subject
          progressData.forEach(progress => {
            if (!progress.subject_id) return;
            
            if (!subjectPerformance[progress.subject_id]) {
              subjectPerformance[progress.subject_id] = { correct: 0, total: 0 };
            }
            
            // Approximate correct responses based on completion percentage
            subjectPerformance[progress.subject_id].correct += progress.completion_percentage;
            subjectPerformance[progress.subject_id].total += 100; // Assuming 100% is max
          });
          
          // Convert to array and sort
          const performanceArray = Object.entries(subjectPerformance)
            .map(([subjectId, performance]) => ({
              subjectId,
              accuracy: performance.total > 0 ? (performance.correct / performance.total) : 0
            }))
            .sort((a, b) => b.accuracy - a.accuracy);
          
          // Set strengths (top 3)
          setStrengths(
            performanceArray
              .slice(0, 3)
              .map(item => subjectsMap[item.subjectId] || 'Unknown')
              .filter(Boolean)
          );
          
          // Set weaknesses (bottom 3)
          setWeaknesses(
            performanceArray
              .slice(-3)
              .reverse()
              .map(item => subjectsMap[item.subjectId] || 'Unknown')
              .filter(Boolean)
          );
        }
        
        // Set skill levels based on progress data
        const skillLevelsData = Object.entries(subjectPerformance)
          .map(([subjectId, performance]) => ({
            skill: subjectsMap[subjectId] || 'Unknown',
            level: Math.round((performance.correct / performance.total) * 10),
            maxLevel: 10
          }))
          .filter(skill => skill.skill !== 'Unknown');
        
        setSkillLevels(skillLevelsData);
        
        // For missed concepts, this would require detailed topic-level analytics
        // For now, we'll just use some default placeholders
        setFrequentlyMissedConcepts([
          { concept: "Integration by Parts", percentage: 75 },
          { concept: "Acid-Base Reactions", percentage: 68 },
          { concept: "Newton's Laws Applications", percentage: 62 },
        ]);
        
      } catch (error) {
        console.error("Error loading analytics:", error);
        toast({
          title: "Error",
          description: "Failed to load your analytics data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [user, toast]);

  const handleSelectSkill = (skill: string) => {
    setSelectedSkill(skill === selectedSkill ? null : skill);
  };

  const handleExpandAchievement = (title: string) => {
    setExpandedAchievement(title === expandedAchievement ? null : title);
  };

  // Detailed skill data for the skill tree - we could enhance this with real data
  const detailedSkillData = {
    Mathematics: [
      { subtopic: "Algebra", level: 8, maxLevel: 10 },
      { subtopic: "Calculus", level: 7, maxLevel: 10 },
      { subtopic: "Geometry", level: 9, maxLevel: 10 },
      { subtopic: "Trigonometry", level: 5, maxLevel: 10 },
      { subtopic: "Statistics", level: 6, maxLevel: 10 },
    ],
    Physics: [
      { subtopic: "Mechanics", level: 8, maxLevel: 10 },
      { subtopic: "Thermodynamics", level: 5, maxLevel: 10 },
      { subtopic: "Optics", level: 7, maxLevel: 10 },
      { subtopic: "Electromagnetism", level: 4, maxLevel: 10 },
      { subtopic: "Modern Physics", level: 6, maxLevel: 10 },
    ],
    Chemistry: [
      { subtopic: "Organic Chemistry", level: 3, maxLevel: 10 },
      { subtopic: "Inorganic Chemistry", level: 5, maxLevel: 10 },
      { subtopic: "Physical Chemistry", level: 4, maxLevel: 10 },
      { subtopic: "Analytical Chemistry", level: 4, maxLevel: 10 },
    ],
    Biology: [
      { subtopic: "Cell Biology", level: 6, maxLevel: 10 },
      { subtopic: "Genetics", level: 7, maxLevel: 10 },
      { subtopic: "Anatomy", level: 4, maxLevel: 10 },
      { subtopic: "Ecology", level: 3, maxLevel: 10 },
    ],
  };

  // Calculate total achievements and unlocked achievements
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-4">
          Please sign in to view your performance analytics and track your progress.
        </p>
        <Button variant="default" onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-xl w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                  Syllabus Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
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
                        className="dark:stroke-gray-700"
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
                        className="dark:stroke-blue-400"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    You've covered {syllabusCoverage}% of the total syllabus.
                    Keep going!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
                  Average Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    {averageTimePerQuestion}s
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-2">
                    <div
                      className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (60 - averageTimePerQuestion) * 2)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {averageTimePerQuestion < 30
                      ? "Excellent speed!"
                      : averageTimePerQuestion < 45
                        ? "Good pace!"
                        : "Try to improve your speed"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                      <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Completed Physics Module 3
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Mastered Integration Techniques
                      </p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                      <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Earned "Quick Thinker" Badge
                      </p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
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
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => setActiveTab("strengths-weaknesses")}
              >
                View Detailed Analysis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="strengths-weaknesses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500 dark:text-yellow-400" />
                  Your Strengths
                </CardTitle>
                <CardDescription>
                  Topics where you consistently perform well
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-700 rounded-md flex items-center"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Topics that need more attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                        <span>{weakness}</span>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs h-7 px-2 border-red-200 dark:border-red-700">
                        Study
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Subject Performance
              </CardTitle>
              <CardDescription>
                Your performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillLevels.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-sm text-gray-600">
                        Level {skill.level}/{skill.maxLevel}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          skill.skill === "Mathematics"
                            ? "bg-blue-500"
                            : skill.skill === "Physics"
                            ? "bg-purple-500"
                            : skill.skill === "Chemistry"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skill-tree" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillLevels.map((mainSkill) => (
              <Card 
                key={mainSkill.skill} 
                className={`${selectedSkill === mainSkill.skill ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader 
                  className="cursor-pointer" 
                  onClick={() => handleSelectSkill(mainSkill.skill)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      {mainSkill.skill === "Mathematics" ? (
                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                      ) : mainSkill.skill === "Physics" ? (
                        <Zap className="h-5 w-5 mr-2 text-purple-500" />
                      ) : mainSkill.skill === "Chemistry" ? (
                        <Activity className="h-5 w-5 mr-2 text-green-500" />
                      ) : (
                        <Brain className="h-5 w-5 mr-2 text-yellow-500" />
                      )}
                      {mainSkill.skill}
                    </CardTitle>
                    <Badge>Level {mainSkill.level}</Badge>
                  </div>
                  <Progress 
                    value={(mainSkill.level / mainSkill.maxLevel) * 100} 
                    className="h-2"
                  />
                </CardHeader>
                
                {selectedSkill === mainSkill.skill && (
                  <CardContent>
                    <div className="space-y-4 mt-2">
                      {detailedSkillData[mainSkill.skill as keyof typeof detailedSkillData].map((subskill, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium flex items-center">
                              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                              {subskill.subtopic}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Level {subskill.level}/{subskill.maxLevel}
                            </span>
                          </div>
                          <Progress 
                            value={(subskill.level / subskill.maxLevel) * 100} 
                            className={`h-1.5 ${
                              subskill.level < 4 
                                ? "bg-red-100" 
                                : subskill.level < 7 
                                  ? "bg-yellow-100" 
                                  : "bg-green-100"
                            }`}
                          />
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        See Learning Path
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  Your Achievements
                </CardTitle>
                <Badge variant="outline">
                  {unlockedAchievements}/{totalAchievements} Unlocked
                </Badge>
              </div>
              <CardDescription>
                Badges and milestones you've reached in your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                      achievement.unlocked
                        ? expandedAchievement === achievement.title
                          ? "bg-primary/5"
                          : "bg-background"
                        : "bg-gray-100 dark:bg-gray-800/60"
                    }`}
                  >
                    <div
                      className="p-4 cursor-pointer flex items-center justify-between"
                      onClick={() => achievement.unlocked && handleExpandAchievement(achievement.title)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                            achievement.unlocked
                              ? "bg-amber-100 dark:bg-amber-900/50"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {achievement.unlocked ? (
                            <Award
                              className={`h-5 w-5 ${
                                achievement.unlocked
                                  ? "text-amber-500 dark:text-amber-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                          ) : (
                            <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              achievement.unlocked
                                ? ""
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {achievement.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={achievement.unlocked ? "default" : "outline"}
                        className={
                          achievement.unlocked ? "" : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-300 dark:bg-gray-800"
                        }
                      >
                        {achievement.unlocked ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>
                    {expandedAchievement === achievement.title && achievement.unlocked && (
                      <div className="bg-muted p-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Achievement Details</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Unlocked on: June 15, 2023
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Share
                          </Button>
                        </div>
                        <Separator className="my-3" />
                        <div className="text-sm">
                          <p>
                            {index === 0 
                              ? "You completed all Math modules with amazing accuracy. Your dedication to mastering mathematical concepts is commendable!" 
                              : "You've solved a total of 100 physics problems across various difficulty levels. Keep up the great work!"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
