"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Video, Upload, Camera, Loader2, Sparkles, Dog } from "lucide-react";
import { generateInsightsReport, GenerateInsightsReportInput } from "@/ai/flows/generate-insights-report";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const analysisSteps = [
  "Warming up the AI... sniffing out the details.",
  "Analyzing gait and posture for happy wiggles.",
  "Decoding tail wags and ear positions.",
  "Listening for barks, yips, and woofs.",
  "Checking for zoomies and play bows.",
  "Translating findings into human speak.",
  "Generating your Pawsight report...",
];

export default function AnalyzePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This would come from the user's profile, but we'll use a default for now.
  const dogProfile = { breed: "Golden Retriever", age: 5 };

  const startAnalysis = async (mediaUrl: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep(analysisSteps[0]);

    let progressInterval: NodeJS.Timeout;

    try {
      let progress = 0;
      let stepIndex = 0;
      progressInterval = setInterval(() => {
        progress += 10;
        if (progress > 100) progress = 100;
        setAnalysisProgress(progress);

        const currentStepIndex = Math.floor((progress / 100) * (analysisSteps.length - 1));
        if (currentStepIndex > stepIndex) {
          stepIndex = currentStepIndex;
          setCurrentStep(analysisSteps[stepIndex]);
        }
      }, 500);

      const input: GenerateInsightsReportInput = {
        mediaUrl: mediaUrl,
        breed: dogProfile.breed,
        age: dogProfile.age,
      };

      const report = await generateInsightsReport(input);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      const reportId = Date.now().toString();
      // This is not ideal for production, but for now we'll use localStorage
      localStorage.setItem(`report-${reportId}`, JSON.stringify(report));

      toast({
        title: "Analysis Complete!",
        description: "Your Pawsight report is ready.",
      });

      router.push(`/report/${reportId}`);

    } catch (error) {
      console.error("Analysis failed:", error);
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "We couldn't analyze your media. Please try again.",
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 100MB.",
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(percentCompleted);
      }
    };

    xhr.onload = async () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.secure_url) {
          await startAnalysis(response.secure_url);
        } else {
           toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Could not get the media URL. Please try again.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `An error occurred during upload: ${xhr.statusText}`,
        });
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
       toast({
        variant: "destructive",
        title: "Upload Error",
        description: "There was a network error. Please check your connection and try again.",
      });
    };

    xhr.send(formData);
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
    
     return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (isUploading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center p-4">
        <div className="relative h-24 w-24">
            <Loader2 className="absolute inset-0 h-full w-full animate-spin text-primary" />
            <Upload className="absolute inset-0 m-auto h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Uploading your media...</h1>
        <p className="text-muted-foreground max-w-sm">Please wait while we send your file to the cloud.</p>
        <Progress value={uploadProgress} className="w-full max-w-sm" />
        <p className="font-semibold">{Math.round(uploadProgress)}%</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center p-4">
        <div className="relative h-24 w-24">
            <Loader2 className="absolute inset-0 h-full w-full animate-spin text-primary" />
            <Dog className="absolute inset-0 m-auto h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Analyzing your pup...</h1>
        <p className="text-muted-foreground max-w-sm">{currentStep}</p>
        <Progress value={analysisProgress} className="w-full max-w-sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Analysis Lab</h1>
            <p className="text-muted-foreground">How would you like to analyze your dog today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                           <Video className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Record Live Video</h2>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                        <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
                        {!hasCameraPermission && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 text-center text-white">
                                <Camera className="h-8 w-8 mb-2" />
                                <p className="text-sm">Enable camera access to record</p>
                            </div>
                        )}
                    </div>
                    <Button size="lg" className="w-full" disabled={!hasCameraPermission}>
                        <Camera className="mr-2 h-5 w-5" /> Start Recording
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
                 <CardHeader>
                    <div className="flex items-center gap-4">
                         <div className="p-3 bg-primary/10 rounded-lg">
                           <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Upload Media</h2>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/50 hover:border-primary transition-colors"
                    >
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="font-semibold">Click to upload</p>
                        <p className="text-sm text-muted-foreground">Video or Photo</p>
                    </div>
                     <input 
                        ref={fileInputRef}
                        id="file-upload" 
                        type="file" 
                        accept="video/*,image/*" 
                        className="hidden" 
                        onChange={handleFileSelect} 
                        disabled={isUploading || isAnalyzing} 
                    />
                    <Button size="lg" className="w-full" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-5 w-5" /> Choose a file
                    </Button>
                </CardContent>
            </Card>
        </div>

        <Alert variant="default" className="max-w-4xl mx-auto bg-primary/5 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle>Analysis Tip</AlertTitle>
            <AlertDescription>
                For best results, make sure your dog is clearly visible. Good lighting and a 5-10 second clip work wonders!
            </AlertDescription>
        </Alert>
    </div>
  );
}
