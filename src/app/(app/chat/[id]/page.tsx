
import { aiChatAssistant } from "@/ai/flows/ai-chat-assistant";
import { GenerateInsightsReportOutput } from "@/ai/flows/generate-insights-report";
import ChatClientPage from "./client-page";

interface ChatPageProps {
  params: { id: string };
}

// This is now a Server Component to handle local storage access on the server-side if needed,
// and to align with the new pattern for the report page.
// In a real app, you might fetch initial data here.
export default function ChatPage({ params }: ChatPageProps) {
  const { id } = params;
  
  // We pass the id to the client component, which will handle all state and effects.
  return <ChatClientPage id={id} />;
}
