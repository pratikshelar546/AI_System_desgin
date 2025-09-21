import { Send } from "lucide-react";
import React, { useRef, useEffect } from "react";
import axios from "axios";
import { DiagramData } from "@/types/diagram";
interface AiGeneratorChatProps {
  children?: React.ReactNode;
  className?: string;
  userDesign: DiagramData;
  setUserDesign: (userDesign: DiagramData) => void;
}

export default function AiGeneratorChat({
  children,
  className = "",
  userDesign,
  setUserDesign,
}: AiGeneratorChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount for cursor effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle send here
    try {
        const prompt = inputRef.current?.value;
        if (prompt) {
            const result = await axios.post('http://localhost:5001/chatbot/api/v1/communicate/ask', { question:prompt });
            console.log(result);
            const userDesign = JSON.parse(result.data.message.response);
            console.log(userDesign);
            setUserDesign(userDesign);
        }

    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-card border-l border-border shadow-panel ${className}`}>
      <div className="flex-1 overflow-y-auto py-3 scrollbar-glow">
        {/* Chat messages would go here */}
        {children}
      </div>
      <span className="text-sm text-muted-foreground">
        Write how your system design has to behave.<br />
      </span>
      <form
        className="flex items-center gap-2 px-4 py-4 border-t border-border bg-background/95"
        onSubmit={handleSend}
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Write prompt here..."
            className="-xl bg-background text-base text-foreground border-none outline-none"
            autoComplete="off"
          />
          {/* Blinking cursor effect */}
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-xl animate-pulse"
            aria-hidden="true"
            style={{
              fontFamily: "monospace",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            |
          </span>
        </div>
        <button
          type="submit"
          className="rounded-xl text-white shadow-md hover:text-primary/90 transition"
          aria-label="Send"
        >
            <Send className="hover:text-primary/90 transition w-5 h-5"/>
        </button>
      </form>
    </div>
  );
}

