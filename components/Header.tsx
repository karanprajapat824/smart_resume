"use client"
import Link from "next/link"
import { Cloud, FileText, Menu, X, Save } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";
import Button from "./ui/Button";

interface HeaderType {
  isLogin?: boolean,
  isSave?: boolean,
  saveResume: () => void;
}

export function Header({ isLogin = false, isSave = false, saveResume }: HeaderType) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 left-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6  text-primary" />
          <span onClick={() => window.location.href = "/"} className="text-sm md:text-xl font-bold text-foreground cursor-pointer">Smart Resume</span>
          {
            isLogin ?
              <button
                onClick={saveResume}
                disabled={isSave}
                className={`ml-4 flex items-center gap-1 font-semibold cursor-pointer
                ${isSave ? "text-green-500 animate-fade-in-up" : "text-gray-500 animate-fade-out-down"}
                `}
              >
                <Cloud className="h-8" />
                {isSave ? "Saved to cloud" : "Save to cloud"}
              </button>
              :
              <Button
                href="/login"
                icon={<Save className="h-4" />}
                size={"sm"}
                variant="primaryPlus"
                className="ml-4"
              >
                Login to Save
              </Button>
          }
        </div>

        <nav className="hidden md:flex items-center justify-between  space-x-6">
          <Button 
          href="/" 
          variant="ghost"
          size="sm"
          >
          </Button>
          <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
            Templates
          </Link>
          <Link href="/my-resumes" className="text-muted-foreground hover:text-foreground transition-colors">
            My Resumes
          </Link>
          <ThemeToggle />
        </nav>

        <button
          className="md:hidden p-2 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="fixed inset-x-0 top-16 bg-background border-t border-border px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/templates"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              href="/my-resumes"
              className="text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              My Resumes
            </Link>
            <div className="py-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
