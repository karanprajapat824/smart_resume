import ThemeToggle from "@/components/ThemeToggle";
import Link from 'next/link';
import {
  FileText,
} from "lucide-react";
export default function LandingPageHeader()
{
    return(
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground hover:cursor-pointer">
              <Link href="/">Smart Resume</Link>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Templates
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <a
              href="/my-resumes"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              My Resumes
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition hover:cursor-pointer">
              <Link href="/templates">Explore Templates</Link>
            </button>
            <button className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:opacity-90 transition hover:cursor-pointer">
              <Link href="/create-resume">Create My Resume</Link>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
    )
}