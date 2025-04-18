import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, BookOpen, TestTube, Settings } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type ExamInfo = {
  id: string;
  name: string;
  description: string;
};

const Home = () => {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState<ExamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserExam = async () => {
      setLoading(true);
      try {
        if (!user) return;

        // Load user's selected exam
        const { data: userExamData, error: userExamError } = await supabase
          .from("user_exams")
          .select("exam_id")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();

        if (userExamError) {
          if (userExamError.code === 'PGRST116') {
            // No exam selection found - user needs to select one
            navigate("/select-exam");
            return;
          }
          throw userExamError;
        }

        if (userExamData?.exam_id) {
          const { data: examData, error: examError } = await supabase
            .from("exams")
            .select("*")
            .eq("id", userExamData.exam_id)
            .single();

          if (examError) throw examError;
          setSelectedExam(examData);
        } else {
          navigate("/select-exam");
        }
      } catch (error: any) {
        console.error("Error loading exam data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserExam();
  }, [user, navigate]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <Button asChild variant="outline">
            <Link to="/profile">
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </Link>
          </Button>
        </div>
      </div>

      {selectedExam && (
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Currently Preparing For</CardTitle>
            <CardDescription>
              Your selected exam, study materials, and practice questions are tailored for this exam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedExam.name}</h2>
                <p className="text-muted-foreground mt-1">{selectedExam.description}</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/profile">
                  Change Exam
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Study
            </CardTitle>
            <CardDescription>
              Learn new concepts and review subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Organized material to master the concepts and knowledge areas of your selected exam.
            </p>
            <Button asChild>
              <Link to="/study">
                Start Studying <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <TestTube className="h-5 w-5 mr-2" />
              Practice
            </CardTitle>
            <CardDescription>
              Test your knowledge with practice questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Interactive quizzes and flashcards to test your understanding and reinforce learning.
            </p>
            <Button asChild>
              <Link to="/practice">
                Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Performance
            </CardTitle>
            <CardDescription>
              Track your progress and identify areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Detailed analytics to help you understand your strengths and weaknesses.
            </p>
            <Button asChild>
              <Link to="/about-you">
                View Performance <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home; 