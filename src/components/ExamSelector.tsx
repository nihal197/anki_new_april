import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

type Exam = {
  id: string;
  name: string;
  description: string;
};

const ExamSelector = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data, error } = await supabase.from("exams").select("*").eq("is_active", true);
        if (error) throw error;
        setExams(data || []);
        
        // Check if user already has selected exams
        if (user) {
          const { data: userExams, error: userExamsError } = await supabase
            .from("user_exams")
            .select("exam_id")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .single();
            
          if (userExams && !userExamsError) {
            setSelectedExam(userExams.exam_id);
          }
        }
      } catch (error: any) {
        console.error("Error fetching exams:", error.message);
        toast({
          title: "Error",
          description: "Failed to load exams. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user, toast]);

  const handleSelectExam = (examId: string) => {
    setSelectedExam(examId);
  };

  const handleContinue = async () => {
    if (!selectedExam || !user) return;
    
    setSubmitting(true);
    try {
      // Check if the user already has an entry for this exam
      const { data: existingExam } = await supabase
        .from("user_exams")
        .select("id")
        .eq("user_id", user.id)
        .eq("exam_id", selectedExam)
        .single();
      
      if (existingExam) {
        // Update the existing entry if it's not active
        await supabase
          .from("user_exams")
          .update({ is_active: true, selected_at: new Date().toISOString() })
          .eq("id", existingExam.id);
      } else {
        // Insert a new entry
        await supabase.from("user_exams").insert({
          user_id: user.id,
          exam_id: selectedExam,
          is_active: true,
        });
      }
      
      toast({
        title: "Success",
        description: "Your exam preference has been saved!",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error saving exam selection:", error.message);
      toast({
        title: "Error",
        description: "Failed to save your selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Choose an Exam to Prepare For</h1>
      <p className="mb-8 text-muted-foreground">
        Select the exam you want to focus on. You can change this later in your profile settings.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card 
            key={exam.id} 
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedExam === exam.id ? "border-primary border-2" : ""
            }`}
            onClick={() => handleSelectExam(exam.id)}
          >
            <CardHeader>
              <CardTitle>{exam.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{exam.description}</CardDescription>
            </CardContent>
            <CardFooter>
              {selectedExam === exam.id && (
                <div className="text-sm text-primary">Selected</div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleContinue} 
          disabled={!selectedExam || submitting}
          className="w-full md:w-auto"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExamSelector; 