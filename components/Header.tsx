"use client"
import Link from "next/link"
import { FileText } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Smart Resume</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
            Templates
          </Link>
          <Link href="/my-resumes" className="text-muted-foreground hover:text-foreground transition-colors">
            My Resumes
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
