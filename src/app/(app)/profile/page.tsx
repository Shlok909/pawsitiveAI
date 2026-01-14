import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LogOut, Upload, Bone, BarChart, Calendar } from "lucide-react";

// This would come from user data
const dogProfile = {
  name: "Buddy",
  breed: "Golden Retriever",
  age: 5,
  avatarUrl: PlaceHolderImages.find((img) => img.id === "dog-avatar")?.imageUrl,
};

const user = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
}

const usageStats = {
    analysesThisMonth: 0,
    totalAnalyses: 0,
    memberSince: "July 2024",
}

export default function ProfilePage() {
  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your and your pup's information.</p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bone className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Dog Profile</CardTitle>
                  </div>
                  <CardDescription>This information helps us tailor the analysis for {dogProfile.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                                {dogProfile.avatarUrl && <AvatarImage src={dogProfile.avatarUrl} alt={dogProfile.name} data-ai-hint="golden retriever"/>}
                                <AvatarFallback className="text-4xl">{dogProfile.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-card shadow-md">
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid flex-1 gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="dog-name">Name</Label>
                                    <Input id="dog-name" defaultValue={dogProfile.name} />
                                </div>
                                <div>
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" defaultValue={dogProfile.age} />
                                </div>
                            </div>
                             <div>
                                <Label htmlFor="breed">Breed</Label>
                                <Input id="breed" defaultValue={dogProfile.breed} />
                            </div>
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
        
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-w-md">
                    <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" defaultValue={user.name} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} disabled />
                    </div>
                    <div className="flex gap-2">
                        <Button>Update Account</Button>
                        <Button variant="secondary">Change Password</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                           <div className="p-2 bg-background rounded-md">
                            <BarChart className="w-6 h-6 text-primary"/>
                           </div>
                           <div>
                            <p className="text-2xl font-bold">{usageStats.analysesThisMonth}</p>
                            <p className="text-sm text-muted-foreground">Analyses this month</p>
                           </div>
                        </div>
                         <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                           <div className="p-2 bg-background rounded-md">
                            <Bone className="w-6 h-6 text-primary"/>
                           </div>
                           <div>
                            <p className="text-2xl font-bold">{usageStats.totalAnalyses}</p>
                            <p className="text-sm text-muted-foreground">Total analyses</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                           <div className="p-2 bg-background rounded-md">
                            <Calendar className="w-6 h-6 text-primary"/>
                           </div>
                           <div>
                            <p className="text-lg font-bold">{usageStats.memberSince}</p>
                            <p className="text-sm text-muted-foreground">Pawsight member since</p>
                           </div>
                        </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Log Out</CardTitle>
                    <CardDescription>End your current session.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" /> Log Out
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
