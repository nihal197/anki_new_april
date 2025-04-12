import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, X, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  chapter: string;
}

const PracticeModule = () => {
  // State for practice mode (MCQ or Flashcard)
  const [practiceMode, setPracticeMode] = useState<"mcq" | "flashcard">("mcq");

  // State for subject and chapter selection
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");
  const [selectedChapter, setSelectedChapter] = useState<string>("mechanics");

  // State for MCQ mode
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(0);

  // State for Flashcard mode
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardDirection, setCardDirection] = useState<
    "none" | "right" | "left" | "down"
  >("none");

  // Mock data for subjects and chapters
  const subjects = [
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "mathematics", label: "Mathematics" },
    { value: "biology", label: "Biology" },
  ];

  const chapters = {
    physics: [
      { value: "mechanics", label: "Mechanics" },
      { value: "thermodynamics", label: "Thermodynamics" },
      { value: "electromagnetism", label: "Electromagnetism" },
      { value: "optics", label: "Optics" },
    ],
    chemistry: [
      { value: "organic", label: "Organic Chemistry" },
      { value: "inorganic", label: "Inorganic Chemistry" },
      { value: "physical", label: "Physical Chemistry" },
    ],
    mathematics: [
      { value: "algebra", label: "Algebra" },
      { value: "calculus", label: "Calculus" },
      { value: "trigonometry", label: "Trigonometry" },
      { value: "statistics", label: "Statistics" },
    ],
    biology: [
      { value: "botany", label: "Botany" },
      { value: "zoology", label: "Zoology" },
      { value: "human_physiology", label: "Human Physiology" },
    ],
  };

  // Mock data for questions
  const currentQuestion: Question = {
    id: "1",
    question: "What is Newton's First Law of Motion?",
    options: [
      "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
      "Force equals mass times acceleration.",
      "For every action, there is an equal and opposite reaction.",
      "Energy can neither be created nor destroyed.",
    ],
    correctAnswer:
      "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
    explanation:
      "Newton's First Law of Motion, also known as the Law of Inertia, states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.",
    difficulty: "medium",
    subject: "physics",
    chapter: "mechanics",
  };

  // Handler for MCQ option selection
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowAnswer(true);
    setQuestionsAttempted((prev) => prev + 1);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      // Here you would trigger confetti or other positive feedback
    }
  };

  // Handler for next question
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    // Here you would fetch the next question
  };

  // Handler for flashcard flip
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Handler for flashcard swipe
  const handleSwipe = (direction: "right" | "left" | "down") => {
    setCardDirection(direction);

    // After animation completes, you would fetch the next card
    setTimeout(() => {
      setCardDirection("none");
      setIsFlipped(false);
      // Here you would fetch the next flashcard
    }, 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col space-y-6">
        {/* Header with subject and chapter selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters[selectedSubject as keyof typeof chapters]?.map(
                  (chapter) => (
                    <SelectItem key={chapter.value} value={chapter.value}>
                      {chapter.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Practice mode toggle */}
          <Tabs
            defaultValue="mcq"
            className="w-full md:w-auto"
            onValueChange={(value) =>
              setPracticeMode(value as "mcq" | "flashcard")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mcq">MCQ</TabsTrigger>
              <TabsTrigger value="flashcard">Flashcards</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">
              {questionsAttempted > 0
                ? Math.round((score / questionsAttempted) * 100)
                : 0}
              %
            </span>
          </div>
          <Progress
            value={
              questionsAttempted > 0 ? (score / questionsAttempted) * 100 : 0
            }
            className="h-2"
          />
        </div>

        {/* Practice content */}
        <div className="min-h-[400px]">
          {practiceMode === "mcq" ? (
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {currentQuestion.subject} - {currentQuestion.chapter}
                  </Badge>
                  <Badge
                    variant={
                      currentQuestion.difficulty === "easy"
                        ? "outline"
                        : currentQuestion.difficulty === "medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {currentQuestion.difficulty.charAt(0).toUpperCase() +
                      currentQuestion.difficulty.slice(1)}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold mb-6">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-4">
                  {currentQuestion.options?.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedOption === option
                          ? option === currentQuestion.correctAnswer
                            ? "default"
                            : "destructive"
                          : option === currentQuestion.correctAnswer &&
                              showAnswer
                            ? "default"
                            : "outline"
                      }
                      className={`w-full justify-start text-left p-4 h-auto ${
                        selectedOption === option
                          ? option === currentQuestion.correctAnswer
                            ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                            : "bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                          : option === currentQuestion.correctAnswer &&
                              showAnswer
                            ? "bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                            : ""
                      }`}
                      onClick={() => !showAnswer && handleOptionSelect(option)}
                      disabled={showAnswer}
                    >
                      <div className="flex items-center w-full">
                        <span className="mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {selectedOption === option &&
                          option === currentQuestion.correctAnswer && (
                            <Check className="ml-2 h-5 w-5 text-green-600" />
                          )}
                        {selectedOption === option &&
                          option !== currentQuestion.correctAnswer && (
                            <X className="ml-2 h-5 w-5 text-red-600" />
                          )}
                      </div>
                    </Button>
                  ))}
                </div>

                {showAnswer && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Explanation:
                    </h4>
                    <p className="text-blue-700">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {showAnswer && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleNextQuestion}>Next Question</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="relative flex justify-center items-center h-[400px]">
              <motion.div
                className="absolute w-full max-w-md"
                animate={{
                  x:
                    cardDirection === "right"
                      ? 1000
                      : cardDirection === "left"
                        ? -1000
                        : 0,
                  y: cardDirection === "down" ? 1000 : 0,
                  opacity: cardDirection !== "none" ? 0 : 1,
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="w-full h-[350px] cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg"
                  onClick={handleFlipCard}
                >
                  <CardContent className="p-6 h-full flex items-center justify-center">
                    <div className="w-full h-full flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-4">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {currentQuestion.subject} - {currentQuestion.chapter}
                        </Badge>
                        <Badge
                          variant={
                            currentQuestion.difficulty === "easy"
                              ? "outline"
                              : currentQuestion.difficulty === "medium"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {currentQuestion.difficulty.charAt(0).toUpperCase() +
                            currentQuestion.difficulty.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        {!isFlipped ? (
                          <h3 className="text-xl font-semibold text-center">
                            {currentQuestion.question}
                          </h3>
                        ) : (
                          <div className="transform rotate-180">
                            <p className="text-lg text-center">
                              {currentQuestion.correctAnswer}
                            </p>
                            {currentQuestion.explanation && (
                              <p className="mt-4 text-sm text-gray-600">
                                {currentQuestion.explanation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-center text-sm text-gray-500 mt-4">
                        {!isFlipped ? "Tap to flip" : "Tap to flip back"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Swipe controls */}
              <div className="absolute bottom-[-60px] flex justify-center items-center space-x-8 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 border-red-400 bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={() => handleSwipe("left")}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Need Review</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                  onClick={() => handleSwipe("down")}
                >
                  <ChevronDown className="h-6 w-6" />
                  <span className="sr-only">Practice More</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 border-green-400 bg-green-100 text-green-600 hover:bg-green-200"
                  onClick={() => handleSwipe("right")}
                >
                  <Check className="h-6 w-6" />
                  <span className="sr-only">Mastered</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats and controls */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="text-sm">
              <span className="font-medium">Score: </span>
              <span>
                {score}/{questionsAttempted}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Accuracy: </span>
              <span>
                {questionsAttempted > 0
                  ? Math.round((score / questionsAttempted) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PracticeModule;
