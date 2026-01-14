"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight, Upload, Dog } from "lucide-react";

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
import { DOG_BREEDS } from "@/lib/breeds";
import { Combobox } from "@/components/ui/combobox";
import { Slider } from "@/components/ui/slider";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  breed: z.string({ required_error: "Please select your dog's breed." }),
  age: z.array(z.number().min(0).max(30)).default([5]),
  photo: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const breedOptions = DOG_BREEDS.map(breed => ({ label: breed, value: breed }));

export default function WelcomePage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: [5],
    },
  });

  function onSubmit(data: ProfileFormValues) {
    // Here you would typically save the profile data
    console.log("Profile submitted:", data);
    router.push("/dashboard");
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
                <h1 className="text-3xl font-bold tracking-tight">Tell Us About Your Pup</h1>
                <p className="text-muted-foreground">This helps us personalize the AI analysis.</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <label htmlFor="photo-upload" className="cursor-pointer group">
                                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-background overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Dog preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-muted-foreground p-2">
                                        <Dog className="w-12 h-12 mx-auto text-primary/80" />
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
                        <FormLabel>Dog's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Buddy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Breed</FormLabel>
                        <Combobox
                          options={breedOptions}
                          value={field.value}
                          onChange={(value) => form.setValue("breed", value)}
                          placeholder="Select a breed"
                          searchPlaceholder="Search breeds..."
                          emptyMessage="No breeds found."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Age</FormLabel>
                            <span className="text-sm font-medium">{field.value?.[0] ?? 0} {field.value?.[0] === 1 ? 'year' : 'years'} old</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={25}
                            step={1}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Create Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
