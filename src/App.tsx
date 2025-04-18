import { NavigationBar } from "./components/NavigationBar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import StudyContent from "./components/StudyPage/StudyContent";
import PracticeModule from "./components/PracticePage/PracticeModule";
import PerformanceAnalytics from "./components/AboutYou/PerformanceAnalytics";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ResetPassword from "./components/Auth/ResetPassword";
import UpdatePassword from "./components/Auth/UpdatePassword";
import ExamSelector from "./components/ExamSelector";
import ProfileSettings from "./components/Profile/ProfileSettings";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="anki-theme">
        <div className="min-h-screen flex flex-col">
          <NavigationBar />
          <main className="flex-1 container mx-auto pt-20 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/select-exam" element={<ExamSelector />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/study" element={<StudyContent />} />
                <Route path="/practice" element={<PracticeModule />} />
                <Route path="/about-you" element={<PerformanceAnalytics />} />
              </Route>
            </Routes>
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
