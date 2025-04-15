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
} from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Topic {
  id: number;
  title: string;
  completed: boolean;
  content?: string;
}

interface SubjectData {
  id: number;
  name: string;
  topics: Topic[];
}

interface StudyContentProps {
  subject?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  progress?: number;
  streakCount?: number;
  pointsEarned?: number;
}

const StudyContent: React.FC<StudyContentProps> = ({
  subject = "Mathematics",
  level = "Intermediate",
  progress = 65,
  streakCount = 7,
  pointsEarned = 450,
}) => {
  const [activeTab, setActiveTab] = useState("learn");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [studyTime, setStudyTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({});

  // Mock data for available subjects
  const subjects: SubjectData[] = [
    {
      id: 1,
      name: "Mathematics",
      topics: [
        { id: 1, title: "Algebra Fundamentals", completed: true },
        { id: 2, title: "Linear Equations", completed: true },
        { id: 3, title: "Quadratic Equations", completed: false, 
          content: "A quadratic equation is a second-degree polynomial equation in a single variable x: ax² + bx + c = 0 where a ≠ 0 and a, b, and c are constants." },
        { id: 4, title: "Polynomials", completed: false },
        { id: 5, title: "Factorization", completed: false },
      ]
    },
    {
      id: 2,
      name: "Physics",
      topics: [
        { id: 1, title: "Mechanics", completed: true },
        { id: 2, title: "Thermodynamics", completed: false },
        { id: 3, title: "Electromagnetism", completed: false },
        { id: 4, title: "Optics", completed: false },
      ]
    },
    {
      id: 3,
      name: "Chemistry",
      topics: [
        { id: 1, title: "Periodic Table", completed: true },
        { id: 2, title: "Chemical Bonding", completed: false },
        { id: 3, title: "Organic Chemistry", completed: false },
      ]
    }
  ];

  // Find the current subject topics
  const currentSubjectTopics = subjects.find(s => s.name === selectedSubject)?.topics || [];

  // Initialize selected topic if not set
  useEffect(() => {
    if (!selectedTopic && currentSubjectTopics.length > 0) {
      setSelectedTopic(currentSubjectTopics[0]);
    }
  }, [selectedSubject, currentSubjectTopics]);

  // Track study time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (selectedTopic) {
      timer = setInterval(() => {
        setStudyTime(prev => prev + 1);
        setTimeSpent(prev => ({
          ...prev,
          [selectedTopic.id.toString()]: (prev[selectedTopic.id.toString()] || 0) + 1
        }));
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [selectedTopic]);

  // Format time to minutes:seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedTopic(null); // Reset selected topic when changing subject
  };

  const handleCompleteSection = () => {
    if (selectedTopic) {
      // Mark current topic as completed and move to the next one
      const updatedTopics = currentSubjectTopics.map(topic => 
        topic.id === selectedTopic.id ? { ...topic, completed: true } : topic
      );
      
      // Find the next incomplete topic
      const nextTopic = updatedTopics.find(t => !t.completed);
      if (nextTopic) {
        setSelectedTopic(nextTopic);
      }
    }
  };

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

  // Calculate completion percentage for current subject
  const completionPercentage = currentSubjectTopics.length > 0
    ? Math.round((currentSubjectTopics.filter(t => t.completed).length / currentSubjectTopics.length) * 100)
    : 0;

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
                      <SelectItem key={subject.id} value={subject.name}>
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
