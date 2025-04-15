import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationBarProps {
  variant?: "side" | "top";
}

export function NavigationBar({ variant = "top" }: NavigationBarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Study",
      href: "/study",
    },
    {
      name: "Practice",
      href: "/practice",
    },
    {
      name: "About You",
      href: "/about-you",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center">
            <Link to="/" className="font-bold text-lg">
              AnkiFlow
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => {
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
          </nav>
        </div>
      </div>
    </header>
  );
}
