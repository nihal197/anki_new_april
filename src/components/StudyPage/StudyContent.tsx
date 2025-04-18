import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Award,
  Zap,
  ChevronRight,
  BarChart2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjectsService } from "@/services/SubjectsService";
import { progressService } from "@/services/ProgressService";
import { useAuth } from "@/components/AuthProvider";

interface Topic {
  id: string;
  title: string;
  content?: string;
  completed: boolean;
  order_index: number;
}

interface SubjectData {
  id: string;
  name: string;
  description?: string;
  topics: Topic[];
}

interface StudyContentProps {}

const StudyContent: React.FC<StudyContentProps> = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [studyTime, setStudyTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({});
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState<string>("Beginner");
  const [streakCount, setStreakCount] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  // Load subjects and topics from Supabase
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        const subjectsData = await subjectsService.getAll();
        
        const formattedSubjects: SubjectData[] = [];
        
        for (const subject of subjectsData) {
          const subjectWithTopics = await subjectsService.getById(subject.id);
          
          // Get user progress for topics if user is logged in
          let topicsWithProgress = subjectWithTopics.topics;
          
          if (user) {
            // For each topic, check if it's completed by the user
            const topicsWithCompletionStatus = await Promise.all(
              topicsWithProgress.map(async (topic) => {
                const progress = await progressService.getProgressByUserAndTopic(user.id, topic.id);
                return {
                  ...topic,
                  completed: progress ? progress.completion_percentage === 100 : false,
                };
              })
            );
            
            topicsWithProgress = topicsWithCompletionStatus;
          }
          
          formattedSubjects.push({
            id: subject.id,
            name: subject.name,
            description: subject.description || undefined,
            topics: topicsWithProgress
              .sort((a, b) => a.order_index - b.order_index)
              .map(topic => ({
                id: topic.id,
                title: topic.title,
                content: topic.content || undefined,
                completed: 'completed' in topic ? Boolean(topic.completed) : false,
                order_index: topic.order_index
              }))
          });
        }
        
        setSubjects(formattedSubjects);
        
        if (formattedSubjects.length > 0) {
          setSelectedSubject(formattedSubjects[0].id);
        }
        
        // Calculate some analytics for the UI
        if (user) {
          try {
            const analytics = await progressService.getUserAnalytics(user.id);
            
            // Set streak and points (placeholder logic)
            setStreakCount(analytics.completedTopics > 5 ? 5 : analytics.completedTopics);
            setPointsEarned(analytics.correctResponses * 10);
            
            // Set level based on progress
            if (analytics.completedTopics > 10) {
              setLevel("Advanced");
            } else if (analytics.completedTopics > 5) {
              setLevel("Intermediate");
            } else {
              setLevel("Beginner");
            }
          } catch (error) {
            console.error("Error loading analytics:", error);
          }
        }
      } catch (error) {
        console.error("Error loading subjects:", error);
        toast({
          title: "Error",
          description: "Failed to load subjects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, [user, toast]);

  // Find the current subject topics
  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const currentSubjectTopics = currentSubject?.topics || [];

  // Initialize selected topic if not set
  useEffect(() => {
    if (!selectedTopic && currentSubjectTopics.length > 0) {
      setSelectedTopic(currentSubjectTopics[0]);
    }
  }, [selectedSubject, currentSubjectTopics]);

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
      if (user && selectedTopic && studyTime > 0) {
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

  // Format time to minutes:seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    // Reset study time for the new topic
    setStudyTime(0);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedTopic(null); // Reset selected topic when changing subject
  };

  const handleCompleteSection = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedTopic) {
      try {
        // Mark current topic as completed in state
        const updatedSubjects = subjects.map(subject => {
          if (subject.id === selectedSubject) {
            return {
              ...subject,
              topics: subject.topics.map(topic => 
                topic.id === selectedTopic.id ? { ...topic, completed: true } : topic
              )
            };
          }
          return subject;
        });
        
        setSubjects(updatedSubjects);
        
        // Update the selected topic
        setSelectedTopic({ ...selectedTopic, completed: true });
        
        // Save progress to Supabase
        await progressService.updateProgress(
          user.id,
          selectedTopic.id,
          100, // 100% completion
          timeSpent[selectedTopic.id] || 0
        );
        
        toast({
          title: "Topic Completed!",
          description: "Your progress has been saved.",
        });
        
        // Find the next incomplete topic
        const currentTopics = currentSubjectTopics;
        const currentIndex = currentTopics.findIndex(t => t.id === selectedTopic.id);
        const nextTopic = currentTopics[currentIndex + 1];
        
        if (nextTopic) {
          setSelectedTopic(nextTopic);
          setStudyTime(0);
        }
      } catch (error) {
        console.error("Error completing topic:", error);
        toast({
          title: "Error",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Calculate completion percentage for current subject
  const completionPercentage = currentSubjectTopics.length > 0
    ? Math.round((currentSubjectTopics.filter(t => t.completed).length / currentSubjectTopics.length) * 100)
    : 0;

  // Add the quizQuestions array back (to be used in the quiz tab)
  const quizQuestions = [
    {
      id: 1,
      question: "If x² + 5x + 6 = 0, what are the values of x?",
      options: ["x = -2, -3", "x = 2, 3", "x = -2, 3", "x = 2, -3"],
      answer: "x = -2, -3",
    },
    {
      id: 2,
      question: "Simplify: 3(2x - 4) - 2(x + 5)",
      options: ["4x - 22", "4x - 12", "8x - 22", "6x - 22"],
      answer: "4x - 22",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading study content...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full min-h-[600px] bg-background">
      {/* Main content area */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CardTitle className="text-2xl font-bold">{selectedTopic?.title || "Select a Topic"}</CardTitle>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {level}
              </Badge>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="learn">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Learn
                </TabsTrigger>
                <TabsTrigger value="practice">
                  <Brain className="mr-2 h-4 w-4" />
                  Practice
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Quiz
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs value={activeTab}>
              <TabsContent value="learn" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {selectedTopic ? (
                    <>
                      <h3 className="text-xl font-semibold mb-4">
                        {selectedTopic.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {selectedTopic.content || "A quadratic equation is a second-degree polynomial equation in a single variable x:"}
                        <span className="block text-center my-4 font-medium text-lg">
                          ax² + bx + c = 0
                        </span>
                        where a ≠ 0 and a, b, and c are constants.
                      </p>

                      <div className="bg-muted p-4 rounded-lg mb-6">
                        <h4 className="font-medium mb-2">
                          Solving using the quadratic formula:
                        </h4>
                        <div className="text-center font-medium my-3">
                          x = (-b ± √(b² - 4ac)) / 2a
                        </div>
                        <p>
                          This formula gives us the roots of the quadratic equation.
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Example:</h4>
                        <p>Solve: x² + 5x + 6 = 0</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Here, a = 1, b = 5, c = 6</li>
                          <li>Using the formula: x = (-5 ± √(25 - 24)) / 2</li>
                          <li>x = (-5 ± √1) / 2</li>
                          <li>x = (-5 ± 1) / 2</li>
                          <li>x = -3 or x = -2</li>
                        </ul>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={handleCompleteSection}
                      >
                        {selectedTopic.completed ? "Review Completed" : "Mark as Completed & Continue"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <p>Please select a topic to begin studying</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="practice" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Practice Problems
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Solve these practice problems to strengthen your
                    understanding of {selectedTopic?.title || "this topic"}.
                  </p>

                  <div className="space-y-6">
                    <Card className="border border-muted">
                      <CardContent className="pt-6">
                        <p className="font-medium mb-4">
                          Problem 1: Solve the quadratic equation x² - 7x + 12 =
                          0
                        </p>
                        <div className="flex justify-end">
                          <Button variant="outline" className="mr-2">
                            Show Hint
                          </Button>
                          <Button>Check Answer</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-muted">
                      <CardContent className="pt-6">
                        <p className="font-medium mb-4">
                          Problem 2: Find the values of x for which 2x² + x - 6
                          = 0
                        </p>
                        <div className="flex justify-end">
                          <Button variant="outline" className="mr-2">
                            Show Hint
                          </Button>
                          <Button>Check Answer</Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-muted">
                      <CardContent className="pt-6">
                        <p className="font-medium mb-4">
                          Problem 3: If one root of x² - kx + 12 = 0 is 3, find
                          the value of k and the other root.
                        </p>
                        <div className="flex justify-end">
                          <Button variant="outline" className="mr-2">
                            Show Hint
                          </Button>
                          <Button>Check Answer</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="quiz" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Quick Quiz</h3>
                  <p className="text-muted-foreground mb-6">
                    Test your knowledge with these multiple-choice questions.
                  </p>

                  <div className="space-y-6">
                    {quizQuestions.map((quiz) => (
                      <Card key={quiz.id} className="border border-muted">
                        <CardContent className="pt-6">
                          <p className="font-medium mb-4">{quiz.question}</p>
                          <div className="space-y-2">
                            {quiz.options.map((option, index) => (
                              <div key={index} className="flex items-center">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left"
                                >
                                  {option}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button className="w-full">Submit Answers</Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-80 shrink-0">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progress Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Available Topics</h4>
              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  {currentSubjectTopics.map((topic) => (
                    <div 
                      key={topic.id} 
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        selectedTopic?.id === topic.id 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <div className="mr-2">
                        {topic.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                        )}
                      </div>
                      <span className={topic.completed ? "line-through opacity-70" : ""}>
                        {topic.title}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Study Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Session Time: {formatTime(studyTime)}</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Points: {pointsEarned}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Streak: {streakCount} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyContent;
