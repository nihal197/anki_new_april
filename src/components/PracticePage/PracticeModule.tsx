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
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  ThumbsUp,
  ThumbsDown,
  Loader2 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';
import { useAuth } from "@/components/AuthProvider";
import { subjectsService } from "@/services/SubjectsService";
import { questionsService } from "@/services/QuestionsService";
import { flashcardsService } from "@/services/FlashcardsService";
import { progressService } from "@/services/ProgressService";

interface Question {
  id: string;
  question: string;
  options?: Record<string, unknown> | any;
  correct_answer: string;
  explanation?: string;
  difficulty: string;
  subject_id: string;
  topic_id?: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject_id: string;
  topic_id?: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  title: string;
  subject_id: string;
}

const PracticeModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  // State for practice mode (MCQ or Flashcard)
  const [practiceMode, setPracticeMode] = useState<"mcq" | "flashcard">("mcq");

  // State for subject and chapter selection
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Record<string, Topic[]>>({});

  // State for MCQ mode
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // State for Flashcard mode
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [cardDirection, setCardDirection] = useState<
    "none" | "right" | "left" | "down"
  >("none");
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [knownFlashcards, setKnownFlashcards] = useState<Set<string>>(new Set());
  const [unknownFlashcards, setUnknownFlashcards] = useState<Set<string>>(new Set());

  // Load subjects and topics from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load subjects
        const subjectsData = await subjectsService.getAll();
        setSubjects(subjectsData);
        
        if (subjectsData.length > 0) {
          const defaultSubject = subjectsData[0].id;
          setSelectedSubject(defaultSubject);
          
          // Load topics for each subject
          const topicsMap: Record<string, Topic[]> = {};
          
          for (const subject of subjectsData) {
            const subjectWithTopics = await subjectsService.getById(subject.id);
            topicsMap[subject.id] = subjectWithTopics.topics;
          }
          
          setTopics(topicsMap);
          
          // Set default topic if available
          if (topicsMap[defaultSubject]?.length > 0) {
            setSelectedTopic(topicsMap[defaultSubject][0].id);
          }
        }
      } catch (error) {
        console.error("Error loading subjects and topics:", error);
        toast({
          title: "Error",
          description: "Failed to load subjects and topics. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Load questions based on selected subject and topic
  useEffect(() => {
    const loadQuestions = async () => {
      if (!selectedSubject || !selectedTopic) return;
      
      try {
        setLoading(true);
        const questionsData = await questionsService.getBySubjectAndTopic(
          selectedSubject,
          selectedTopic
        );
        
        setFilteredQuestions(questionsData);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowAnswer(false);
        setQuestionStartTime(Date.now());
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [selectedSubject, selectedTopic, toast]);

  // Load flashcards based on selected subject and topic
  useEffect(() => {
    const loadFlashcards = async () => {
      if (!selectedSubject || !selectedTopic) return;
      
      try {
        setLoading(true);
        const flashcardsData = await flashcardsService.getBySubjectAndTopic(
          selectedSubject,
          selectedTopic
        );
        
        setFilteredFlashcards(flashcardsData);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      } catch (error) {
        console.error("Error loading flashcards:", error);
        toast({
          title: "Error", 
          description: "Failed to load flashcards. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (practiceMode === "flashcard") {
      loadFlashcards();
    }
  }, [selectedSubject, selectedTopic, practiceMode, toast]);

  // Reset when changing practice mode
  useEffect(() => {
    if (practiceMode === "mcq") {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowAnswer(false);
      setQuestionStartTime(Date.now());
    } else {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCardDirection("none");
    }
  }, [practiceMode]);

  const handleOptionSelect = async (option: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to track your progress.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedOption !== null || !filteredQuestions.length) return;
    
    setSelectedOption(option);
    setShowAnswer(true);
    setQuestionsAttempted((prev) => prev + 1);
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    
    // Calculate time taken to answer
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    
    try {
      // Record the response in the database
      await questionsService.recordResponse(
        user.id,
        currentQuestion.id,
        option,
        isCorrect,
        timeTaken
      );
    } catch (error) {
      console.error("Error recording response:", error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
      setQuestionStartTime(Date.now());
    } else {
      // End of questions, record the practice session
      if (user && selectedSubject && selectedTopic) {
        try {
          const sessionDuration = Math.round((Date.now() - questionStartTime) / 1000) + 
            (questionsAttempted * 30); // Approximate total duration
          
          progressService.recordPracticeSession(
            user.id,
            selectedSubject,
            selectedTopic,
            questionsAttempted,
            score,
            sessionDuration
          );
          
          // Show success message
          toast({
            title: "Practice Complete!",
            description: `You scored ${score} out of ${filteredQuestions.length} questions. Points and streak updated!`,
          });
        } catch (error) {
          console.error("Error recording practice session:", error);
        }
      } else {
        // Basic message if user not logged in
        toast({
          title: "Practice Complete",
          description: `You scored ${score} out of ${filteredQuestions.length} questions.`,
        });
      }
      
      // Reset for a new round
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setShowAnswer(false);
      setScore(0);
      setQuestionsAttempted(0);
      setQuestionStartTime(Date.now());
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = async (direction: "right" | "left" | "down") => {
    if (!user || !filteredFlashcards.length) return;
    
    const currentCard = filteredFlashcards[currentCardIndex];
    setCardDirection(direction);
    
    // Record the response
    const isCorrect = direction === "right"; // "right" means known/correct
    const knownSet = new Set(knownFlashcards);
    const unknownSet = new Set(unknownFlashcards);
    
    if (direction === "right") {
      knownSet.add(currentCard.id);
      unknownSet.delete(currentCard.id);
      setKnownFlashcards(knownSet);
    } else if (direction === "left") {
      unknownSet.add(currentCard.id);
      knownSet.delete(currentCard.id);
      setUnknownFlashcards(unknownSet);
    }
    
    try {
      // Record the response in the database
      await flashcardsService.recordResponse(
        user.id,
        currentCard.id,
        direction,
        isCorrect,
        0 // We don't track time for flashcards in this implementation
      );
    } catch (error) {
      console.error("Error recording flashcard response:", error);
    }
    
    // Move to next card after a short delay
    setTimeout(() => {
      if (currentCardIndex < filteredFlashcards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        // End of cards, record the practice session
        if (user && selectedSubject && selectedTopic) {
          try {
            const totalAttempted = filteredFlashcards.length;
            const correctAnswers = knownFlashcards.size;
            const sessionDuration = Math.round(totalAttempted * 15); // Approximate time spent
            
            progressService.recordPracticeSession(
              user.id,
              selectedSubject,
              selectedTopic,
              totalAttempted,
              correctAnswers,
              sessionDuration
            );
            
            // Show success message
            toast({
              title: "Flashcard Practice Complete!",
              description: `You've completed ${totalAttempted} flashcards with ${correctAnswers} marked as known. Points and streak updated!`,
            });
          } catch (error) {
            console.error("Error recording flashcard session:", error);
          }
        } else {
          // Basic message if user not logged in
          toast({
            title: "Flashcard Practice Complete",
            description: `You've reviewed all ${filteredFlashcards.length} flashcards.`,
          });
        }
        
        // Reset
        setCurrentCardIndex(0);
        setKnownFlashcards(new Set());
        setUnknownFlashcards(new Set());
      }
      setIsFlipped(false);
      setCardDirection("none");
    }, 300);
  };

  // Get current question or flashcard
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const currentFlashcard = filteredFlashcards[currentCardIndex];

  // Parse options for the current question
  const options = currentQuestion?.options 
    ? Array.isArray(currentQuestion.options) 
      ? currentQuestion.options 
      : Object.values(currentQuestion.options as Record<string, string>) 
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading practice content...</span>
      </div>
    );
  }

  // Check if no content is available
  const noContent = (practiceMode === "mcq" && filteredQuestions.length === 0) || 
                    (practiceMode === "flashcard" && filteredFlashcards.length === 0);
  
  if (noContent && selectedSubject && selectedTopic) {
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
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics[selectedSubject]?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.title}
                    </SelectItem>
                  ))}
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
          
          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-4">
              No {practiceMode === "mcq" ? "questions" : "flashcards"} available for this topic
            </h3>
            <p className="text-muted-foreground mb-6">
              Please select a different subject or topic to continue practicing.
            </p>
            <Button onClick={() => {
              // Reset selected topic
              if (subjects.length > 0 && topics[subjects[0].id]?.length > 0) {
                setSelectedSubject(subjects[0].id);
                setSelectedTopic(topics[subjects[0].id][0].id);
              }
            }}>
              Try Another Topic
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>
              <SelectContent>
                {topics[selectedSubject]?.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </SelectItem>
                ))}
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
                ? `${Math.round((score / questionsAttempted) * 100)}% (${score}/${questionsAttempted})` 
                : `${Math.round((knownFlashcards.size / filteredFlashcards.length) * 100)}% (${knownFlashcards.size}/${filteredFlashcards.length})`}
            </span>
          </div>
          <Progress
            value={practiceMode === "mcq" ? Math.round((score / questionsAttempted) * 100) : Math.round((knownFlashcards.size / filteredFlashcards.length) * 100)}
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
                    {subjects.find(s => s.id === currentQuestion.subject_id)?.name} - 
                    {topics[currentQuestion.subject_id]?.find(
                      t => t.id === currentQuestion.topic_id
                    )?.title}
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
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedOption === option
                          ? option === currentQuestion.correct_answer
                            ? "default"
                            : "destructive"
                          : option === currentQuestion.correct_answer &&
                              showAnswer
                            ? "default"
                            : "outline"
                      }
                      className={`w-full justify-start text-left p-4 h-auto ${
                        selectedOption === option
                          ? option === currentQuestion.correct_answer
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                          : option === currentQuestion.correct_answer && showAnswer
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                      }`}
                      onClick={() => !showAnswer && handleOptionSelect(option as string)}
                      disabled={showAnswer}
                    >
                      <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                      {selectedOption === option && option === currentQuestion.correct_answer && (
                        <Check className="ml-auto h-5 w-5" />
                      )}
                      {selectedOption === option && option !== currentQuestion.correct_answer && (
                        <X className="ml-auto h-5 w-5" />
                      )}
                      {selectedOption !== option && option === currentQuestion.correct_answer && showAnswer && (
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
