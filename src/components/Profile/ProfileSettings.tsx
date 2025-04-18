import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

type Exam = {
  id: string;
  name: string;
  description: string;
};

const ProfileSettings = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        if (!user) return;

        // Load user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;
        
        setDisplayName(userData.display_name || "");
        setEmail(user.email || "");

        // Load exams
        const { data: examsData, error: examsError } = await supabase
          .from("exams")
          .select("*")
          .eq("is_active", true);

        if (examsError) throw examsError;
        setExams(examsData || []);

        // Load user's selected exam
        const { data: userExamData, error: userExamError } = await supabase
          .from("user_exams")
          .select("exam_id")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();

        if (!userExamError && userExamData) {
          setSelectedExam(userExamData.exam_id);
        }
      } catch (error: any) {
        console.error("Error loading user data:", error.message);
        toast({
          title: "Error",
          description: "Could not load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, toast]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Update profile data
      await supabase
        .from("users")
        .update({ display_name: displayName })
        .eq("id", user.id);

      toast({
        title: "Success",
        description: "Your profile has been updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Error",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateExam = async (examId: string) => {
    if (!user) return;
    setSaving(true);

    try {
      // Check if user already has an exam selection
      const { data: existingExam } = await supabase
        .from("user_exams")
        .select("id")
        .eq("user_id", user.id)
        .eq("exam_id", examId)
        .single();

      if (existingExam) {
        // Update existing entry to be active
        await supabase
          .from("user_exams")
          .update({ is_active: true })
          .eq("id", existingExam.id);
        
        // Update any other entries to be inactive
        await supabase
          .from("user_exams")
          .update({ is_active: false })
          .eq("user_id", user.id)
          .neq("exam_id", examId);
      } else {
        // Deactivate current entry if any
        if (selectedExam) {
          await supabase
            .from("user_exams")
            .update({ is_active: false })
            .eq("user_id", user.id)
            .eq("is_active", true);
        }
        
        // Insert new entry
        await supabase.from("user_exams").insert({
          user_id: user.id,
          exam_id: examId,
          is_active: true,
        });
      }

      setSelectedExam(examId);
      toast({
        title: "Success",
        description: "Your exam preference has been updated!",
      });
    } catch (error: any) {
      console.error("Error updating exam selection:", error.message);
      toast({
        title: "Error",
        description: "Could not update your exam preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="exam">Exam Preference</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  disabled 
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed directly. Please contact support.
                </p>
              </div>
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exam">
          <Card>
            <CardHeader>
              <CardTitle>Exam Preference</CardTitle>
              <CardDescription>Choose which exam you're preparing for.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {exams.map((exam) => (
                  <div 
                    key={exam.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedExam === exam.id ? "border-primary border-2" : ""
                    }`}
                    onClick={() => handleUpdateExam(exam.id)}
                  >
                    <h3 className="font-medium">{exam.name}</h3>
                    <p className="text-sm text-muted-foreground">{exam.description}</p>
                    {selectedExam === exam.id && (
                      <div className="mt-2 text-sm text-primary">Currently Selected</div>
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

export default ProfileSettings; 