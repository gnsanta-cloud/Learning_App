import { formatInlineMarkdown } from "../lib/formatText";
import { AiTeacherAvatar } from "./AiTeacherAvatar";
import { AI_TEACHER } from "../config/aiTeacher";

type Props = {
  children: React.ReactNode;
  speaking?: boolean;
  variant?: "teacher" | "student";
};

export function AiTeacherBubble({
  children,
  speaking = true,
  variant = "teacher",
}: Props) {
  if (variant === "student") {
    return (
      <div className="ai-teacher-bubble ai-teacher-bubble--student">
        <div className="ai-teacher-bubble__content">{children}</div>
      </div>
    );
  }

  return (
    <div className="ai-teacher-bubble ai-teacher-bubble--teacher">
      <AiTeacherAvatar size="md" speaking={speaking} />
      <div className="ai-teacher-bubble__body">
        <span className="ai-teacher-bubble__name">{AI_TEACHER.name}</span>
        <div className="ai-teacher-bubble__content">{children}</div>
      </div>
    </div>
  );
}

export function AiTeacherMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="ai-teacher-markdown">
      {lines.map((line, i) => (
        <p key={i}>{formatInlineMarkdown(line)}</p>
      ))}
    </div>
  );
}
