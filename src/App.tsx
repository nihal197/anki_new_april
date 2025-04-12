import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import NavigationBar from "./components/NavigationBar";

// Import the actual components instead of using placeholders
import StudyContent from "./components/StudyPage/StudyContent";
import PracticeModule from "./components/PracticePage/PracticeModule";
import PerformanceAnalytics from "./components/AboutYou/PerformanceAnalytics";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <NavigationBar variant="top" className="sticky top-0 z-50" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<StudyContent />} />
          <Route path="/practice" element={<PracticeModule />} />
          <Route path="/about-you" element={<PerformanceAnalytics />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
