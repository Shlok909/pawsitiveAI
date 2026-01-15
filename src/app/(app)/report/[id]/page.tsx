
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { GenerateInsightsReportOutput } from "@/ai/flows/generate-insights-report";
import ReportClientPage from "./client-page";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  
  // In a real app, you would fetch the report data here from a database
  // using the `id`. For this example, we'll pass the ID to the client
  // component which will continue to use localStorage.
  
  const reportImage = PlaceHolderImages.find((img) => img.id === 'report-thumb-1');

  return <ReportClientPage id={id} reportImage={reportImage} />;
}
