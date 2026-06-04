import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { AiTeacherBubble, AiTeacherMarkdown } from "./AiTeacherBubble";
import { AI_TEACHER } from "../config/aiTeacher";
import { useGeminiApiKey } from "../hooks/useGeminiApiKey";
import { askAiTeacherChat, formatGeminiError, type ChatTurn } from "../lib/geminiChat";

export type ChatMessage = {
  id: string;
  role: "teacher" | "student";
  text: string;
  loading?: boolean;
  /** Gemini API가 생성한 선생님 답변만 대화 기록에 포함 */
  gemini?: boolean;
};

type Props = {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  subjectName: string;
  unitTitle: string;
  unitContext: string;
  subjectColor: string;
};

export function newChatId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function appendTeacherChatMessage(
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>,
  text: string
) {
  if (!text.trim()) return;
  setMessages((prev) => [
    ...prev,
    { id: newChatId(), role: "teacher", text },
  ]);
}

export function AiTeacherChat({
  messages,
  setMessages,
  subjectName,
  unitTitle,
  unitContext,
  subjectColor,
}: Props) {
  const { apiKey, hasApiKey } = useGeminiApiKey();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  /** 수업 안내 말풍선은 제외 — 학생 질문 ↔ Gemini 답변만 전달 */
  const toGeminiHistory = (msgs: ChatMessage[]): ChatTurn[] => {
    const turns: ChatTurn[] = [];
    for (const m of msgs) {
      if (m.loading || !m.text.trim()) continue;
      if (m.role === "student") {
        turns.push({ role: "user", text: m.text });
      } else if (m.gemini) {
        turns.push({ role: "model", text: m.text });
      }
    }
    return turns;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    if (!hasApiKey) {
      setMessages((prev) => [
        ...prev,
        { id: newChatId(), role: "student", text },
        {
          id: newChatId(),
          role: "teacher",
          text: "대화형 답변을 쓰려면 **설정**에서 Google AI Studio API 키를 입력해 주세요. 키는 이 기기에만 저장됩니다.",
        },
      ]);
      setInput("");
      return;
    }

    const loadingId = newChatId();
    setMessages((prev) => [
      ...prev,
      { id: newChatId(), role: "student", text },
      { id: loadingId, role: "teacher", text: "생각하는 중…", loading: true },
    ]);
    setInput("");
    setSending(true);

    try {
      const history = toGeminiHistory(messages);
      const reply = await askAiTeacherChat({
        apiKey,
        unitContext,
        subjectName,
        unitTitle,
        history,
        userMessage: text,
      });
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({
            id: newChatId(),
            role: "teacher",
            text: reply,
            gemini: true,
          })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({
            id: newChatId(),
            role: "teacher",
            text: formatGeminiError(err),
          })
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="ai-chat__log" ref={logRef}>
        {messages.map((msg) =>
          msg.role === "teacher" ? (
            <AiTeacherBubble key={msg.id} speaking={msg.loading}>
              {msg.loading ? (
                <p className="ai-chat__typing">{msg.text}</p>
              ) : (
                <AiTeacherMarkdown text={msg.text} />
              )}
            </AiTeacherBubble>
          ) : (
            <AiTeacherBubble key={msg.id} variant="student">
              <p>{msg.text}</p>
            </AiTeacherBubble>
          )
        )}
      </div>

      {!hasApiKey && (
        <p className="ai-chat__key-hint">
          💬 질문·답변은 API 키가 필요해요.{" "}
          <Link to="/settings">설정에서 키 입력</Link>
        </p>
      )}

      <form
        className="ai-chat__compose"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSend();
        }}
      >
        <textarea
          className="ai-chat__input"
          rows={2}
          placeholder={`${AI_TEACHER.name}에게 질문해 보세요… (Enter 전송)`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          disabled={sending}
        />
        <button
          type="submit"
          className="btn btn-primary ai-chat__send"
          disabled={sending || !input.trim()}
          style={{ background: subjectColor }}
        >
          {sending ? "…" : "전송"}
        </button>
      </form>
    </div>
  );
}
