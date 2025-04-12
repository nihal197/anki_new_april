import React, { useState } from "react";
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

  // Mock data for study content
  const topics = [
    { id: 1, title: "Algebra Fundamentals", completed: true },
    { id: 2, title: "Linear Equations", completed: true },
    { id: 3, title: "Quadratic Equations", completed: false },
    { id: 4, title: "Polynomials", completed: false },
    { id: 5, title: "Factorization", completed: false },
  ];

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

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full min-h-[600px] bg-background">
      {/* Main content area */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">{subject}</CardTitle>
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
                  <h3 className="text-xl font-semibold mb-4">
                    Quadratic Equations
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    A quadratic equation is a second-degree polynomial equation
                    in a single variable x:
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

                  <Button className="w-full">
                    Continue to Next Section
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
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
                    understanding of quadratic equations.
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
      <div className="w-full md:w-80 flex-shrink-0">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-lg flex items-center">
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                    <p className="font-medium">{streakCount} days</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg flex items-center">
                  <Award className="h-5 w-5 text-purple-500 mr-2" />
                  <div>
                    <p className="text-xs text-muted-foreground">Points</p>
                    <p className="font-medium">{pointsEarned}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Topics list */}
              <div>
                <h3 className="text-sm font-medium mb-3">Topics</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                      >
                        <span className="text-sm">{topic.title}</span>
                        {topic.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator />

              {/* Achievements */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Recent Achievements
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center p-2 rounded-md bg-primary/10">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">Algebra Explorer</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md bg-primary/10">
                    <Zap className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">5-Day Streak</span>
                  </div>
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
