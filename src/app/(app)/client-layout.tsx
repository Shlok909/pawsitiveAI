
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PawsightLogo } from "@/components/icons";
import {
  LayoutDashboard,
  Clock,
  User,
  PlusCircle,
  Menu,
  Dog,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { DisclaimerFooter } from "@/components/disclaimer-footer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/history", icon: Clock, label: "History" },
  { href: "/profile", icon: User, label: "Profile" },
];

// This would come from user data
const dogProfile = {
  name: "Buddy",
  avatarUrl: "https://images.unsplash.com/photo-1626736637845-53045bb9695b?w=100",
};


export function ClientAppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>
  }
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="flex h-20 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
              <PawsightLogo className="h-8 w-8" />
              <span className="text-xl text-foreground">Pawsight AI</span>
            </Link>
          </div>
          <div className="flex-1 py-4">
            <nav className="grid items-start px-4 text-md font-medium">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 space-y-4">
            <Button size="lg" className="w-full" asChild>
                <Link href="/analyze">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Analysis
                </Link>
            </Button>
            <div className="text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Pawsight AI
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-20 items-center gap-4 border-b bg-card px-6">
            <div className="flex-1" />
            <UserMenu avatarUrl={dogProfile.avatarUrl} name={dogProfile.name} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
          <DisclaimerFooter />
        </main>
      </div>
    </div>
  );
}

function MobileLayout({ children }: { children: React.ReactNode }){
    const [open, setOpen] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b bg-card px-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                 <div className="flex h-20 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
                      <PawsightLogo className="h-8 w-8" />
                      <span className="text-xl text-foreground">Pawsight AI</span>
                    </Link>
                  </div>
                  <nav className="flex-1 grid gap-2 p-4 text-lg font-medium">
                    {navItems.map((item) => (
                      <NavItem key={item.href} item={item} isMobile />
                    ))}
                  </nav>
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
              <PawsightLogo className="h-8 w-8" />
            </Link>
            
            <UserMenu avatarUrl={dogProfile.avatarUrl} name={dogProfile.name} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 bg-background">
            {children}
            <DisclaimerFooter />
          </main>
        </div>
    )
}

function NavItem({ item, isMobile = false }: { item: typeof navItems[0], isMobile?: boolean }) {
    const pathname = usePathname();
    const isActive = pathname === item.href;

    return (
         <Link
            href={item.href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary",
                isActive && "bg-primary/10 text-primary font-semibold",
                isMobile && "text-lg py-4"
            )}
            >
            <item.icon className="h-5 w-5" />
            {item.label}
        </Link>
    );
}


function UserMenu({avatarUrl, name}: {avatarUrl?: string, name: string}) {
    return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                <Avatar className="h-12 w-12 border-2 border-primary/50">
                    <AvatarImage src={avatarUrl} alt={name} data-ai-hint="golden retriever" />
                    <AvatarFallback className="bg-secondary text-lg">{name.charAt(0)}</AvatarFallback>
                </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Signed in as</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {name}'s Friend
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/"><Dog className="mr-2 h-4 w-4" />Log Out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    )
}
