import { Link } from "react-router-dom";
import {
  subjects,
  countLessons,
  countQuizzes,
  getLessonKey,
} from "../data/subjects";
import { useProgress } from "../hooks/useProgress";
import { ProgressBar } from "../components/ProgressBar";
import { StreakCard } from "../components/StreakCard";
import { siteConfig } from "../config/site";

export function HomePage() {
  const { countCompleted } = useProgress();

  return (
    <main className="page">
      <header className="page-header">
        <h1>학습 홈</h1>
        <p>기술·가정(천재) · 도덕(비상) — 2022 개정</p>
      </header>

      <StreakCard />

      <div className="install-banner">
        <strong>📲 앱처럼 쓰기</strong>
        브라우저 메뉴에서 「홈 화면에 추가」 또는 「앱 설치」를 선택하면
        오프라인에서도 학습할 수 있습니다.
      </div>

      <div className="subject-grid">
        {subjects.map((subject) => {
          const keys = subject.units.flatMap((u) =>
            u.lessons.map((l) => getLessonKey(subject.id, u.id, l.id))
          );
          const done = countCompleted(keys);
          const total = countLessons(subject);
          const quizTotal = countQuizzes(subject);

          return (
            <Link
              key={subject.id}
              to={`/subject/${subject.id}`}
              className="subject-card"
              style={
                {
                  "--subject-color": subject.color,
                  "--subject-accent": subject.accent,
                } as React.CSSProperties
              }
            >
              <div className="subject-card-top">
                <span className="subject-emoji" aria-hidden>
                  {subject.emoji}
                </span>
                <div>
                  <h2>{subject.name}</h2>
                  <p className="subject-meta">
                    {subject.publisher} · {subject.author} · {total}개 소단원 ·{" "}
                    {quizTotal}문항 퀴즈
                  </p>
                </div>
              </div>
              <ProgressBar done={done} total={total} color={subject.color} />
            </Link>
          );
        })}
      </div>

      <p className="footer-note">
        교과서 본문 대신 교육과정 요약·퀴즈로 구성했습니다.
        <br />
        <a
          href={siteConfig.githubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub 저장소 ↗
        </a>
        {" · "}
        <a
          href={siteConfig.githubPages}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          웹 앱 (GitHub Pages) ↗
        </a>
      </p>
    </main>
  );
}
