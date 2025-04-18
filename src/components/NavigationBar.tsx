import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { supabase } from "@/lib/supabase";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
}

interface NavigationBarProps {
  variant?: "side" | "top";
}

export function NavigationBar({ variant = "top" }: NavigationBarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, signOut } = useAuth();
  const [currentExam, setCurrentExam] = useState<string | null>(null);

  useEffect(() => {
    // Load the user's current exam
    const loadUserExam = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("user_exams")
          .select("exam_id, exams:exam_id(name)")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();

        if (!error && data && data.exams) {
          setCurrentExam(data.exams.name);
        }
      } catch (error) {
        console.error("Error loading user exam:", error);
      }
    };

    loadUserExam();
  }, [user, pathname]);

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      requiresAuth: false,
    },
    {
      name: "Study",
      href: "/study",
      requiresAuth: true,
    },
    {
      name: "Practice",
      href: "/practice",
      requiresAuth: true,
    },
    {
      name: "About You",
      href: "/about-you",
      requiresAuth: true,
    },
  ];

  // Filter nav items based on auth status
  const filteredNavItems = navItems.filter(item => !item.requiresAuth || user);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.display_name) return 'U';
    return (user.user_metadata.display_name as string)
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center">
            <Link to="/" className="font-bold text-lg">
              AnkiFlow
            </Link>
            {currentExam && user && (
              <div className="ml-4 px-2 py-1 rounded-md text-xs font-medium bg-muted">
                {currentExam}
              </div>
            )}
          </div>
          <nav className="flex items-center space-x-4">
            {filteredNavItems.map((item) => {
              const isActive = (pathname === "/" && item.href === "/") ||
                (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.user_metadata.display_name || user.email}
                  </DropdownMenuLabel>
                  {currentExam && (
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Preparing for: {currentExam}
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/select-exam">Change Exam</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
