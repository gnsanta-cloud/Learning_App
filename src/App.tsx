import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import { LessonPage } from "./pages/LessonPage";
import { QuizPage } from "./pages/QuizPage";
import { UnitStudyPage } from "./pages/UnitStudyPage";
import { SampleExamPage } from "./pages/SampleExamPage";
import { SettingsPage } from "./pages/SettingsPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="subject/:subjectId" element={<SubjectPage />} />
          <Route
            path="subject/:subjectId/sample-exam"
            element={<SampleExamPage />}
          />
          <Route
            path="subject/:subjectId/unit/:unitId"
            element={<UnitStudyPage />}
          />
          <Route
            path="subject/:subjectId/unit/:unitId/lesson/:lessonId"
            element={<LessonPage />}
          />
          <Route
            path="subject/:subjectId/unit/:unitId/lesson/:lessonId/quiz"
            element={<QuizPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
