import { AI_TEACHER } from "../config/aiTeacher";

type Props = {
  size?: "sm" | "md" | "lg";
  speaking?: boolean;
};

export function AiTeacherAvatar({ size = "md", speaking }: Props) {
  return (
    <div
      className={`ai-teacher-avatar ai-teacher-avatar--${size}${speaking ? " ai-teacher-avatar--speaking" : ""}`}
      aria-hidden
    >
      <span className="ai-teacher-avatar__emoji">{AI_TEACHER.emoji}</span>
    </div>
  );
}
