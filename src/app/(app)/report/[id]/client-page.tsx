"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Share2,
  Lightbulb,
  ArrowRight,
  Heart,
  Activity,
  Dog,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import type { GenerateInsightsReportOutput } from "@/ai/flows/generate-insights-report";
import { useToast } from "@/hooks/use-toast";
import { PawsightLogo } from "@/components/icons";

const emotionConfig: { [key: string]: { emoji: string, color: string, description: string } } = {
  happy: { emoji: "😊", color: "text-green-500", description: "Your dog is feeling joyful and content." },
  playful: { emoji: "🎾", color: "text-green-500", description: "Your dog is full of energy and wants to play!" },
  anxious: { emoji: "😟", color: "text-yellow-500", description: "Your dog is feeling uneasy or worried." },
  fear: { emoji: "😨", color: "text-orange-500", description: "Something is making your dog feel scared." },
  aggressive: { emoji: "😠", color: "text-red-600", description: "Your dog is showing signs of aggression. Be cautious." },
  pain: { emoji: "😣", color: "text-red-500", description: "Your dog might be in pain. Look for physical signs." },
  neutral: { emoji: "😐", color: "text-gray-500", description: "Your dog is calm and observant." },
  relaxed: { emoji: "😌", color: "text-blue-500", description: "Your dog is feeling calm and at ease." },
};

const urgencyConfig = {
  green: { color: "bg-green-500", text: "All Clear", description: "No immediate health concerns detected." },
  yellow: { color: "bg-yellow-500", text: "Observation Recommended", description: "Keep an eye on the noted symptoms." },
  red: { color: "bg-red-500", text: "Veterinary Check Recommended", description: "Consider consulting a vet for the noted concerns." },
};

interface ReportClientPageProps {
  id: string;
  reportImage: ImagePlaceholder | undefined;
}

export default function ReportClientPage({ id, reportImage }: ReportClientPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [report, setReport] = useState<GenerateInsightsReportOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedReport = localStorage.getItem(`report-${id}`);
      if (storedReport) {
        setReport(JSON.parse(storedReport));
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
    setLoading(false);
  }, [id, router, toast]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Fetching your Pawsight report...</p>
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

  const eConfig = emotionConfig[report.emotion.toLowerCase() as keyof typeof emotionConfig] || emotionConfig.neutral;
  const uConfig = urgencyConfig[report.health.urgency as keyof typeof urgencyConfig] || urgencyConfig.green;
  
  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-1/3">
            {reportImage && 
              <Image 
                src={reportImage.imageUrl} 
                alt={report.emotion} 
                width={400} 
                height={400} 
                className="rounded-2xl object-cover aspect-square w-full shadow-lg"
                data-ai-hint="dog playing"
                priority
              />
            }
        </div>
        <div className="flex-1 space-y-4">
            <Badge variant="secondary">Report from {new Date(parseInt(id)).toLocaleDateString()}</Badge>
            <h1 className="text-5xl font-bold tracking-tighter flex items-center gap-2">{report.emotion} <span className="text-4xl">{eConfig.emoji}</span></h1>
            <p className="text-lg text-muted-foreground">{eConfig.description}</p>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <p className="text-xl text-primary-foreground italic">"{report.translation}"</p>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-lg">
                    <span className="font-semibold text-muted-foreground">Confidence:</span>
                    <span className="font-bold text-foreground">{report.confidence}%</span>
                </div>
                <Progress value={report.confidence} className="w-32" />
            </div>
            <div className="flex gap-2 pt-4">
                <Button asChild><Link href={`/chat/${id}`}><MessageSquare className="mr-2 h-4 w-4" /> Ask AI Assistant</Link></Button>
                <Button variant="secondary"><Share2 className="mr-2 h-4 w-4" /> Share Report</Button>
            </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Dog className="text-primary"/> Body Language Breakdown</CardTitle>
                    <CardDescription>Understanding the non-verbal cues your dog is showing.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(report.bodyLanguage).map(([key, value]) => (
                    <div key={key} className="p-4 bg-muted rounded-lg">
                        <p className="font-semibold text-sm text-muted-foreground capitalize">{key}</p>
                        <p className="text-lg font-bold">{String(value)}</p>
                    </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-accent"/> Actionable Tips</CardTitle>
                    <CardDescription>Personalized recommendations based on this analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                <ul className="space-y-3">
                    {report.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                        <ArrowRight className="h-4 w-4 mr-3 mt-1 text-primary shrink-0"/> 
                        <span>{tip}</span>
                    </li>
                    ))}
                </ul>
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart className="text-red-500" /> Health Vitals</CardTitle>
                <CardDescription>A quick check on key health indicators.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(report.health).map(([key, value]) => {
                  if (key === 'urgency') return null;
                  return (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold capitalize">{key}</p>
                      <p className="text-sm text-muted-foreground capitalize">{String(value)}</p>
                    </div>
                    {['clear', 'normal', 'healthy'].includes(String(value)) ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                  </div>
                )})}
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle  className="flex items-center gap-2"><Activity className="text-blue-500"/> Urgency Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full ${uConfig.color}`}></div>
                    <p className="text-lg font-bold">{uConfig.text}</p>
                </div>
                <p className="text-sm text-muted-foreground">{uConfig.description}</p>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
