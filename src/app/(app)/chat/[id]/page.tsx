
import ChatClientPage from "./client-page";

interface ChatPageProps {
  params: { id: string };
}

// This can remain a simple Server Component that passes params to the client child.
export default function ChatPage({ params }: ChatPageProps) {
  const { id } = params;
  
  return <ChatClientPage id={id} />;
}
