import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PawsightLogo, DogTailAnimation } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { DisclaimerFooter } from "@/components/disclaimer-footer";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  "Decode body language like tail wags and ear positions.",
  "Understand barks, whines, and other vocal cues.",
  "Get personalized tips to improve your dog's happiness.",
  "Monitor for potential signs of stress or discomfort."
];

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-dog");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <PawsightLogo className="h-8 w-8" />
            <span className="text-2xl font-bold text-foreground">Pawsight AI</span>
          </Link>
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              Go to App <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 text-center md:py-24 lg:grid-cols-2 lg:gap-16 lg:text-left">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Finally Understand What Your Dog Is Thinking.
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
              Pawsight AI uses advanced technology to analyze your dog's body language and vocal cues, translating them into simple, human-readable insights.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
                <Link href="/welcome">Get Started For Free</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 w-full md:h-[500px]">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="rounded-3xl object-cover shadow-2xl"
                priority
              />
            )}
             <Card className="absolute -bottom-8 right-0 w-48 animate-pulse">
                <CardContent className="p-3">
                   <div className="flex items-center gap-2">
                     <DogTailAnimation className="w-8 h-8 text-primary" />
                     <div>
                        <p className="font-bold text-sm">Buddy feels...</p>
                        <p className="text-lg font-bold text-primary">Happy!</p>
                     </div>
                   </div>
                </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="bg-secondary/50 py-20 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your Personal Dog Translator</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Our AI is trained on thousands of hours of veterinary behaviorist data to give you the most accurate emotional analysis possible.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center">
                            <CardContent className="p-6">
                                <CheckCircle className="mx-auto h-10 w-10 text-accent mb-4" />
                                <p className="font-medium">{feature}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <DisclaimerFooter />
    </div>
  );
}
