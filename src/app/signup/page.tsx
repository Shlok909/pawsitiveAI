
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Upload, User as UserIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PawsightLogo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/firebase/auth";
import { signUpFormSchema, type SignUpFormValues } from "@/types/auth";
import { FirebaseError } from "firebase/app";

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true);
    try {
      await signUp(data);
      toast({
        title: "Account created!",
        description: "Welcome to PawsitiveAI. Redirecting you to the app...",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      
      let title = "An unknown error occurred.";
      let description = "Please try again.";
      let action;

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          title = "User already exists.";
          description = "An account with this email is already registered.";
          action = (
             <Button variant="secondary" size="sm" onClick={() => router.push('/signin')}>
              Sign In
            </Button>
          )
        } else {
          title = "Sign-up failed";
          description = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: title,
        description: description,
        action: action,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));
      form.setValue("photo", file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-8">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <PawsightLogo className="h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Create your Account</h1>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <label htmlFor="photo-upload" className="cursor-pointer group">
                      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-background overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-muted-foreground p-2">
                            <UserIcon className="w-12 h-12 mx-auto text-primary/80" />
                            <span className="text-xs">Upload Photo</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full shadow-md">
                        <Upload className="w-5 h-5" />
                      </div>
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Alex Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., alex@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
