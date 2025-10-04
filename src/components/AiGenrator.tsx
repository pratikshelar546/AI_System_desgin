import { Bot, Loader2, Send } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { DiagramData } from "@/types/diagram";
import { server } from "@/utils/server";
import { Button } from "./ui/button";
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
  const [chats, setChats] = useState([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Focus input on mount for cursor effect
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("handleSend");
    e.preventDefault();
    // handle send here
    try {
      setLoading(true);
      const prompt = inputRef.current?.value;
      const result = await server.post("/communicate/ask", {
        question: prompt,
      });
      inputRef.current.value = "";
      fetchChats();
      const userDesign = JSON.parse(result.data.message.response);

      // console.log(userDesign,"design");
      setUserDesign(userDesign as unknown as DiagramData);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      }
  };
  const fetchChats = async () => {
    const response = await server.get(
      `/communicate/chats/${"68dd809bb902f94db3ace1fc"}`
    );
    console.log(response, "response");

    if (response.data.success) {
      setChats(response.data.chats.messages);
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);

  // Scroll to bottom on chats change
  useEffect(() => {
    const scrollDiv = (window as any).__chatScrollDiv;
    if (scrollDiv) {
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }
  }, [chats]);

  const handleImplement = (content:string)=>{
console.log(JSON.parse(content),"content");
setUserDesign(JSON.parse(content) as unknown as DiagramData);
  }
  return (
    <div
      className={`flex flex-col h-full lg:h-[90vh] bg-card border-l border-border shadow-panel ${className}`}
    >
      {/* Header can be placed here if needed */}
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className="flex-1 flex flex-col gap-3 overflow-y-auto p-2 bg-muted rounded-lg shadow-inner scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100"
          style={{ scrollBehavior: "smooth" }}
          id="all-chats-scroll-container"
          ref={el => {
            // This ref is only for scrolling, not for React state
            // We'll use a useEffect below to scroll to bottom
            (window as any).__chatScrollDiv = el;
          }}
        >
          {/* If children are passed, render them (for extensibility) */}
          {children}
          {chats && chats.length > 0 ? (
            chats.map((chat: any, idx: number) =>{ 
              console.log( chat.role === "bot" && chat.content,"chat");
              return (
              <div
                key={chat._id || idx}
                className={`flex flex-col ${
                  chat.role === "user"
                    ? "self-end items-end"
                    : "self-start items-start"
                }`}
              >
                {chat.role === "user" && (
                  <span className="text-xs text-blue-500 font-semibold mb-1">
                    You
                  </span>
                )}
                 {chat.role === "bot" ? (
                   <div
                     className="px-3 py-2 rounded-lg max-w-[85vw] sm:max-w-xs break-words text-sm shadow bg-gray-100 text-gray-900"
                   >
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-2">
                       <div className="flex items-center gap-2">
                         <Bot className="w-4 h-4" />
                         <span className="text-xs text-gray-500 font-semibold">AI Assistant</span>
                       </div>
                       <Button
                         variant="link"
                         className="text-xs sm:text-md text-gray-500 border-blue-400 border rounded-md py-1 px-2 sm:px-4 self-start sm:self-auto"
                         onClick={() => handleImplement(chat.content)}
                       >
                         Implement
                       </Button>
                     </div>
                     <div className="text-sm">
                       {JSON.parse(chat.content)?.explanation || ""}
                     </div>
                   </div>
                 ) : (
                   <div
                     className="px-3 py-2 rounded-lg max-w-[85vw] sm:max-w-xs break-words text-sm shadow bg-blue-500 text-white"
                   >
                     {chat.content}
                   </div>
                 )}
              </div>
            )})
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet.
            </div>
          )}
        </div>
        {/* Always keep the prompt input at the end */}
        <div className="w-full px-2 pb-2 pt-2 bg-card border-t border-border">
          <span className="text-xs sm:text-sm text-muted-foreground block mb-2">
            Describe how your system should behave.
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm text-black"
              ref={inputRef}
              onKeyDown={e => {
                if (e.key === "Enter" && inputRef.current?.value) {
                  (e.target as HTMLInputElement).blur();
                  handleSend(e as any);
                }
              }}
            />
            <button
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition text-sm sm:text-base"
              // disabled={!inputRef.current?.value}
              onClick={handleSend}
              type="button"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="hidden sm:inline">Send</span>}
              {loading ? null : <Send className="w-4 h-4 sm:hidden" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}