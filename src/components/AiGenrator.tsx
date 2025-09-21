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
        // if (prompt) {
            const result = await axios.post('http://localhost:5001/chatbot/api/v1/communicate/ask', { question:prompt });
            // console.log(result.data.message.response,"result");
    //         const demo = '{\n' +
    // '  "nodes": [\n' +
    // '    { "id": "1", "type": "client", "label": "Web/Mobile App", "zone": { "x": 0, "y": 0 } },\n' +
    // '    { "id": "2", "type": "api-gateway", "label": "API Gateway", "zone": { "x": 2, "y": 2 } },\n' +
    // '    { "id": "3", "type": "load-balancer", "label": "Load Balancer", "zone": { "x": 1, "y": 2 } },\n' +
    // '    { "id": "4", "type": "service", "label": "User Service", "zone": { "x": 0, "y": 4 } },\n' +
    // '    { "id": "5", "type": "service", "label": "Product Catalog Service", "zone": { "x": 2, "y": 4 } },\n' +      
    // '    { "id": "6", "type": "service", "label": "Cart Service", "zone": { "x": 3, "y": 4 } },\n' +
    // '    { "id": "7", "type": "service", "label": "Payment Service", "zone": { "x": 1, "y": 4 } },\n' +
    // '    { "id": "8", "type": "service", "label": "Order Service", "zone": { "x": 4, "y": 4 } },\n' +
    // '    { "id": "9", "type": "service", "label": "Notification Service", "zone": { "x": 3, "y": 5 } },\n' +
    // '    { "id": "10", "type": "db", "label": "SQL Database", "zone": { "x": 1, "y": 7 } },\n' +
    // '    { "id": "11", "type": "db", "label": "NoSQL Database", "zone": { "x": 2, "y": 7 } },\n' +
    // '    { "id": "12", "type": "cache", "label": "Redis Cache", "zone": { "x": 3, "y": 7 } },\n' +
    // '    { "id": "13", "type": "queue", "label": "Message Queue (Kafka)", "zone": { "x": 2, "y": 6 } }\n' +
    // '  ],\n' +
    // '  "edges": [\n' +
    // '    { "source": "1", "target": "2", "label": "1. API Requests" },\n' +
    // '    { "source": "2", "target": "3", "label": "2. Load Balancing" },\n' +
    // '    { "source": "3", "target": "4", "label": "3. User Operations" },\n' +
    // '    { "source": "3", "target": "5", "label": "4. Product Access" },\n' +
    // '    { "source": "3", "target": "6", "label": "5. Cart Operations" },\n' +
    // '    { "source": "3", "target": "7", "label": "6. Payment Processing" },\n' +
    // '    { "source": "3", "target": "8", "label": "7. Order Management" },\n' +
    // '    { "source": "8", "target": "10", "label": "8. Transaction Data" },\n' +
    // '    { "source": "5", "target": "11", "label": "9. Product Catalog Data" },\n' +
    // '    { "source": "4", "target": "12", "label": "10. User Sessions" },\n' +
    // '    { "source": "7", "target": "13", "label": "11. Async Payment Processing" },\n' +
    // '    { "source": "6", "target": "13", "label": "12. Async Cart Updates" },\n' +
    // '    { "source": "9", "target": "13", "label": "13. Notification Queue" }\n' +
    // '  ]\n' +
    // '}'
            // const userDesign = JSON.parse(demo);
            const userDesign = JSON.parse(result.data.message.response);
        
            // console.log(userDesign,"design");
            setUserDesign(userDesign as unknown as DiagramData);
        // }

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

