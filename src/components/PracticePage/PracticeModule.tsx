import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Check, X, ChevronDown, ChevronUp, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import confetti from 'canvas-confetti';

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

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  chapter: string;
}

// Mock data for questions and flashcards
const mockQuestions: Question[] = [
  {
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
  },
  {
    id: "2",
    question: "Which of the following is a quadratic equation?",
    options: [
      "y = 2x + 3",
      "y = x² + 2x + 1",
      "y = 3/x",
      "y = 2^x",
    ],
    correctAnswer: "y = x² + 2x + 1",
    explanation: "A quadratic equation contains at least one term with x², making it a second-degree polynomial equation.",
    difficulty: "easy",
    subject: "mathematics",
    chapter: "algebra",
  },
  {
    id: "3",
    question: "What is the main function of mitochondria in a cell?",
    options: [
      "Protein synthesis",
      "Energy production (ATP)",
      "Storage of genetic material",
      "Cell division",
    ],
    correctAnswer: "Energy production (ATP)",
    explanation: "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of ATP, which is used as a source of chemical energy.",
    difficulty: "medium",
    subject: "biology",
    chapter: "human_physiology",
  }
];

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    front: "What is Newton's First Law of Motion?",
    back: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
    subject: "physics",
    chapter: "mechanics",
  },
  {
    id: "2",
    front: "What is a quadratic equation?",
    back: "A quadratic equation is a second-degree polynomial equation in a single variable x, typically written in the form ax² + bx + c = 0, where a ≠ 0.",
    subject: "mathematics",
    chapter: "algebra",
  },
  {
    id: "3",
    front: "What is the function of mitochondria?",
    back: "Mitochondria are the powerhouse of the cell, responsible for producing energy (ATP) through cellular respiration.",
    subject: "biology",
    chapter: "human_physiology",
  }
];

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // State for Flashcard mode
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardDirection, setCardDirection] = useState<
    "none" | "right" | "left" | "down"
  >("none");
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [knownFlashcards, setKnownFlashcards] = useState<Set<string>>(new Set());
  const [unknownFlashcards, setUnknownFlashcards] = useState<Set<string>>(new Set());

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

  // Filter questions based on subject and chapter
  useEffect(() => {
    const filtered = mockQuestions.filter(
      q => q.subject === selectedSubject && q.chapter === selectedChapter
    );
    setFilteredQuestions(filtered.length > 0 ? filtered : [mockQuestions[0]]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
  }, [selectedSubject, selectedChapter]);

  // Filter flashcards based on subject and chapter
  useEffect(() => {
    const filtered = mockFlashcards.filter(
      f => f.subject === selectedSubject && f.chapter === selectedChapter
    );
    setFilteredFlashcards(filtered.length > 0 ? filtered : [mockFlashcards[0]]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedSubject, selectedChapter]);

  // Reset when changing practice mode
  useEffect(() => {
    if (practiceMode === "mcq") {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCardDirection("none");
    }
  }, [practiceMode]);

  // Trigger confetti effect when user gets correct answer
  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  // Get current question or flashcard
  const currentQuestion = filteredQuestions[currentQuestionIndex] || mockQuestions[0];
  const currentFlashcard = filteredFlashcards[currentCardIndex] || mockFlashcards[0];

  // Handler for MCQ option selection
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowAnswer(true);
    setQuestionsAttempted((prev) => prev + 1);

    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
    }
  };

  // Handler for next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // If we've gone through all questions, restart from the beginning
      setCurrentQuestionIndex(0);
    }
    
    setSelectedOption(null);
    setShowAnswer(false);
  };

  // Handler for flashcard flip
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Handler for flashcard swipe
  const handleSwipe = (direction: "right" | "left" | "down") => {
    setCardDirection(direction);
    
    // Mark card as known/unknown
    if (direction === "right") {
      setKnownFlashcards(prev => new Set(prev).add(currentFlashcard.id));
    } else if (direction === "left") {
      setUnknownFlashcards(prev => new Set(prev).add(currentFlashcard.id));
    }

    // After animation completes, move to next card
    setTimeout(() => {
      if (currentCardIndex < filteredFlashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // If we've gone through all cards, restart from the beginning
        setCurrentCardIndex(0);
      }
      
      setCardDirection("none");
      setIsFlipped(false);
    }, 300);
  };

  // Calculate progress percentages
  const mcqProgressPercentage = questionsAttempted > 0 
    ? Math.round((score / questionsAttempted) * 100) 
    : 0;
    
  const flashcardProgressPercentage = filteredFlashcards.length > 0
    ? Math.round((knownFlashcards.size / filteredFlashcards.length) * 100)
    : 0;

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
            value={practiceMode}
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
              {practiceMode === "mcq" 
                ? `${mcqProgressPercentage}% (${score}/${questionsAttempted})` 
                : `${flashcardProgressPercentage}% (${knownFlashcards.size}/${filteredFlashcards.length})`}
            </span>
          </div>
          <Progress
            value={practiceMode === "mcq" ? mcqProgressPercentage : flashcardProgressPercentage}
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
                    {subjects.find(s => s.value === currentQuestion.subject)?.label} - 
                    {chapters[currentQuestion.subject as keyof typeof chapters]?.find(
                      c => c.value === currentQuestion.chapter
                    )?.label}
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
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                          : option === currentQuestion.correctAnswer && showAnswer
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                      }`}
                      onClick={() => !showAnswer && handleOptionSelect(option)}
                      disabled={showAnswer}
                    >
                      <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                      {selectedOption === option && option === currentQuestion.correctAnswer && (
                        <Check className="ml-auto h-5 w-5" />
                      )}
                      {selectedOption === option && option !== currentQuestion.correctAnswer && (
                        <X className="ml-auto h-5 w-5" />
                      )}
                      {selectedOption !== option && option === currentQuestion.correctAnswer && showAnswer && (
                        <Check className="ml-auto h-5 w-5" />
                      )}
                    </Button>
                  ))}
                </div>

                {showAnswer && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Explanation:</h4>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                {showAnswer && (
                  <Button
                    className="w-full mt-6"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="relative h-[400px] w-full flex items-center justify-center">
              <AnimatePresence>
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    x: cardDirection === "left" ? -300 : cardDirection === "right" ? 300 : 0,
                    y: cardDirection === "down" ? 300 : 0,
                    rotateY: isFlipped ? 180 : 0
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md h-[300px] bg-white rounded-xl shadow-lg cursor-pointer perspective"
                  onClick={handleFlipCard}
                >
                  <div className={`w-full h-full relative ${isFlipped ? "rotate-y-180" : ""}`}>
                    {/* Front of card */}
                    <div className={`absolute w-full h-full flex flex-col items-center justify-center p-6 backface-hidden ${isFlipped ? "hidden" : ""}`}>
                      <Badge className="mb-4">Tap to flip</Badge>
                      <h3 className="text-xl font-semibold text-center">{currentFlashcard.front}</h3>
                    </div>
                    
                    {/* Back of card */}
                    <div className={`absolute w-full h-full flex flex-col items-center justify-center p-6 backface-hidden ${isFlipped ? "" : "hidden"}`}>
                      <p className="text-center">{currentFlashcard.back}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Swipe controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600"
                  onClick={() => handleSwipe("left")}
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                  onClick={() => handleSwipe("down")}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-600"
                  onClick={() => handleSwipe("right")}
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Card counter */}
              <div className="absolute top-0 right-4 bg-gray-100 rounded-b-lg px-3 py-1">
                {currentCardIndex + 1} / {filteredFlashcards.length}
              </div>
            </div>
          )}
        </div>
        
        {/* Flashcard legend */}
        {practiceMode === "flashcard" && (
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span>Don't Know</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
              <span>Skip</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>Know</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeModule;
