import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Brain, User, Award, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon, label, to, active = false }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 p-2 rounded-md transition-colors duration-200",
      active
        ? "bg-primary/20 text-primary font-medium"
        : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105",
    )}
  >
    <div className="flex items-center justify-center w-5 h-5">{icon}</div>
    <span>{label}</span>
  </Link>
);

interface NavigationBarProps {
  variant?: "side" | "top";
  className?: string;
}

const NavigationBar = ({ variant = "side", className }: NavigationBarProps) => {
  // Get current path to highlight active link
  const currentPath = window.location.pathname;

  const navItems = [
    {
      icon: <HomeIcon className="h-5 w-5" />,
      label: "Home",
      to: "/",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Study",
      to: "/study",
    },
    {
      icon: <Brain className="h-5 w-5" />,
      label: "Practice",
      to: "/practice",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "About You",
      to: "/about-you",
    },
  ];

  if (variant === "top") {
    return (
      <nav className={cn("bg-primary/5 border-b shadow-sm", className)}>
        <div className="container flex items-center gap-6 h-16">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} active={currentPath === item.to} />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "bg-background border-r h-full w-56 p-4 flex flex-col gap-2",
        className,
      )}
    >
      {navItems.map((item) => (
        <NavItem key={item.to} {...item} active={currentPath === item.to} />
      ))}
    </nav>
  );
};

export default NavigationBar;
