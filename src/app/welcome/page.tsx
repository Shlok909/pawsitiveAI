"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DisclaimerFooter } from "@/components/disclaimer-footer";
import { PawsightLogo } from "@/components/icons";
import { DOG_BREEDS } from "@/lib/breeds";
import { Combobox } from "@/components/ui/combobox";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  breed: z.string({ required_error: "Please select a breed." }),
  age: z.array(z.number()).min(1).max(1),
  photo: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const breedOptions = DOG_BREEDS.map(breed => ({ label: breed, value: breed.toLowerCase() }));

export default function WelcomePage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: [3],
    },
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile submitted:", data);
    // Here you would typically save the profile to your backend
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary">
          <PawsightLogo className="h-8 w-8" />
          <span className="font-headline">Pawsight AI</span>
      </div>
      <Card className="w-full max-w-lg card-neumorphic">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Tell us about your pup!</CardTitle>
          <CardDescription>Create a profile for your dog to get personalized insights.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-center">
                 <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Dog preview" className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                </label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
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
                      {...field}
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
                    <FormLabel>Age: {field.value} years</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={25}
                        step={1}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-8 w-full max-w-lg">
        <DisclaimerFooter />
      </div>
    </div>
  );
}
