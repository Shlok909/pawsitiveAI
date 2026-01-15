
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SendHorizonal, Sparkles, Dog, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { aiChatAssistant, AIChatAssistantInput } from "@/ai/flows/ai-chat-assistant";
import { GenerateInsightsReportOutput } from "@/ai/flows/generate-insights-report";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { PawsightLogo } from "@/components/icons";


type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

export default function ChatPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [report, setReport] = useState<GenerateInsightsReportOutput | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const starterQuestions = report ? [
    `What does "${report.emotion}" mean?`,
    "Give me some tips based on this report.",
    "Is there anything to worry about?",
    `Tell me more about the "${report.health.urgency}" urgency.`,
  ].filter(Boolean) : [];

  useEffect(() => {
    try {
      const storedReport = localStorage.getItem(`report-${id}`);
      if (storedReport) {
        const parsedReport: GenerateInsightsReportOutput = JSON.parse(storedReport);
        setReport(parsedReport);
         setMessages([
          {
            id: 1,
            text: `Hello! I'm your Pawsight AI assistant. I've reviewed the report for your dog's "${parsedReport.emotion}" state. How can I help you understand it better?`,
            sender: "bot",
          },
        ]);
      } else {
         toast({
          variant: "destructive",
          title: "Report not found",
          description: "Could not load the analysis report.",
        });
        router.push("/history");
      }
    } catch (error) {
      console.error("Failed to load report from localStorage", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem loading the report.",
      });
    }
    setInitialLoading(false);
  }, [id, router, toast]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);
  
  const handleSendMessage = useCallback(async (text: string) => {
    if (text.trim() === "" || isTyping || !report) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const input: AIChatAssistantInput = {
        question: text,
        previousAnalysis: JSON.stringify(report, null, 2),
      };
      const response = await aiChatAssistant(input);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.answer,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
       console.error("AI chat assistant failed:", error);
       toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "I'm having trouble responding right now. Please try again in a moment.",
      });
       setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, report, toast]);

  if (initialLoading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }
  
  if (!report) {
    return (
       <div className="flex flex-col items-center justify-center text-center h-full gap-4 p-4">
          <PawsightLogo className="w-24 h-24 text-destructive" />
          <h2 className="text-2xl font-bold">Report Not Found</h2>
          <p className="text-muted-foreground max-w-sm">We couldn't find the report you're looking for. It might have been removed or the link is incorrect.</p>
          <Button asChild>
            <Link href="/history">Go to History</Link>
          </Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col md:h-[calc(100vh-8rem)] bg-background">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.sender === "user" ? "flex-row-reverse" : "items-end"
              )}
            >
              <Avatar className={cn(
                "h-10 w-10 border",
                message.sender === 'bot' && "bg-primary text-primary-foreground"
                )}>
                {message.sender === "bot" ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Dog className="h-6 w-6" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src="https://picsum.photos/seed/user-avatar/100" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={cn(
                  "max-w-xs rounded-2xl px-4 py-3 md:max-w-md shadow-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border rounded-bl-none"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex items-end gap-3">
                <Avatar className="h-10 w-10 border bg-primary text-primary-foreground">
                    <div className="flex h-full w-full items-center justify-center">
                        <Dog className="h-6 w-6" />
                    </div>
                </Avatar>
                 <Card className="rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
                 </Card>
             </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
      <div className="border-t bg-card p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
            {messages.length <= 1 && (
              <div className="mb-4 flex gap-2 flex-wrap justify-center">
                  {starterQuestions.slice(0, 2).map(q => (
                      <Button key={q} variant="outline" size="sm" onClick={() => handleSendMessage(q)} disabled={isTyping}>{q}</Button>
                  ))}
              </div>
            )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="relative"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your dog's report..."
              className="pr-12 h-12 rounded-full"
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={inputValue.trim() === "" || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full">
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </form>
           <p className="text-xs text-center text-muted-foreground mt-2">Pawsight AI can sometimes make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  );
}
