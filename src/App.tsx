import { NavigationBar } from "./components/NavigationBar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import StudyContent from "./components/StudyPage/StudyContent";
import PracticeModule from "./components/PracticePage/PracticeModule";
import PerformanceAnalytics from "./components/AboutYou/PerformanceAnalytics";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="anki-theme">
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 container mx-auto pt-20 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study" element={<StudyContent />} />
            <Route path="/practice" element={<PracticeModule />} />
            <Route path="/about-you" element={<PerformanceAnalytics />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
