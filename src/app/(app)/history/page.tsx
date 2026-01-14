"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, Plus, FileX, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GenerateInsightsReportOutput } from "@/ai/flows/generate-insights-report";
import { PawsightLogo } from "@/components/icons";

const emotionConfig: { [key: string]: { color: string, emoji: string } } = {
  happy: { color: "bg-green-500", emoji: "😊" },
  playful: { color: "bg-green-500", emoji: "🎾" },
  anxious: { color: "bg-yellow-500", emoji: "😟" },
  fear: { color: "bg-orange-500", emoji: "😨" },
  aggressive: { color: "bg-red-600", emoji: "😠" },
  pain: { color: "bg-red-500", emoji: "😣" },
  neutral: { color: "bg-gray-500", emoji: "😐" },
  relaxed: { color: "bg-blue-500", emoji: "😌" },
};

type ReportItem = {
  id: string;
  date: string;
  report: GenerateInsightsReportOutput;
};

export default function HistoryPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allItems = { ...localStorage };
    const reportItems: ReportItem[] = [];
    
    Object.keys(allItems).forEach(key => {
      if (key.startsWith('report-')) {
        try {
          const reportData = JSON.parse(allItems[key]);
          const reportId = key.substring('report-'.length);
          const reportDate = new Date(parseInt(reportId, 10));

          reportItems.push({
            id: reportId,
            date: reportDate.toLocaleString(),
            report: reportData
          });
        } catch (e) {
          console.error(`Failed to parse report from localStorage: ${key}`, e);
        }
      }
    });

    // Sort reports by date, newest first
    reportItems.sort((a, b) => parseInt(b.id) - parseInt(a.id));

    setReports(reportItems);
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
          <p className="text-muted-foreground">Review all past insights into your dog's well-being.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Emotion</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
              {Object.keys(emotionConfig).map(emotion => (
                <DropdownMenuCheckboxItem key={emotion}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link href="/analyze">New Analysis <Plus className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading history...</p>
      ) : reports.length > 0 ? (
        <div className="grid gap-6">
          {reports.map((item) => {
            const eConfig = emotionConfig[item.report.emotion.toLowerCase() as keyof typeof emotionConfig] || emotionConfig.neutral;
            return (
              <Card key={item.id} className="w-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{item.report.emotion}</CardTitle>
                      <CardDescription>{new Date(parseInt(item.id)).toLocaleString()}</CardDescription>
                    </div>
                    <Badge variant={item.report.health.urgency === 'red' ? 'destructive' : 'secondary'}>
                      <span className={`mr-2 text-lg`}>{eConfig.emoji}</span>
                      {item.report.emotion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <p>Confidence: <span className="font-semibold text-foreground">{item.report.confidence}%</span></p>
                    <p>Urgency: <span className="font-semibold text-foreground capitalize">{item.report.health.urgency}</span></p>
                  </div>
                   <p className="mt-2 text-sm italic">"{item.report.translation}"</p>
                </CardContent>
                <CardFooter className="flex justify-end bg-muted/50 p-4 rounded-b-lg">
                  <Button asChild>
                    <Link href={`/report/${item.id}`}>
                      View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
         <Card className="text-center flex flex-col items-center justify-center p-8 lg:p-16 gap-4 border-dashed">
            <PawsightLogo className="w-24 h-24 text-muted-foreground/50" />
            <h2 className="text-2xl font-bold mt-4">Your History is Empty</h2>
            <p className="text-muted-foreground max-w-sm">
                No reports have been generated yet. Perform an analysis to start building your dog's emotional timeline!
            </p>
            <Button size="lg" className="mt-4" asChild>
                <Link href="/analyze">
                    <Sparkles className="mr-2 h-5 w-5" /> Start First Analysis
                </Link>
            </Button>
        </Card>
      )}
    </div>
  );
}
