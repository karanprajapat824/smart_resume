"use client"
import { Cloud, FileText, Menu, X, Save, RefreshCw } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";
import Button from "./ui/Button";

interface HeaderType {
  isLogin?: boolean,
  isSave?: boolean,
  saveResume: () => void;
}

export default function Header({ isLogin = false, isSave = false, saveResume }: HeaderType) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    if (!isSave) return;
    setTimeout(() => setSpin(false), 5000);
  }, [spin]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 left-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-2 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <FileText className="md:h-8 md:w-8 h-6 w-6 text-primary" />
          <span onClick={() => window.location.href = "/"} className="text-sm md:text-xl font-bold text-foreground cursor-pointer">Smart Resume</span>
          {
            isLogin ?
              (
                !isSave ?
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    icon={<Cloud className="h-8" />}
                    onClick={() => { saveResume(); setSpin(true) }}
                  >
                    <div>Save to cloud</div>
                    <RefreshCw className={`h-4 ${spin && "animate-spin"}`} />
                  </Button> :
                  <Button
                    variant="outline"
                    className="ml-4 border-success-foreground"
                    size="sm"
                  >
                    <div className="flex items-center gap-2 text-success-foreground"><Cloud className="h-8" /> Saved to cloud</div>
                  </Button>
              )
              :
              <Button
                href="/login"
                icon={<Save className="h-4" />}
                size={"sm"}
                variant="outline"
                className="ml-4"
              >
                Login to Save
              </Button>
          }
        </div>

        <nav className="hidden md:flex items-center justify-between space-x-2">
          <Button
            href="/templates"
            variant="ghost"
            size="lg"
          >
            Templates
          </Button>
          <Button
            href="/my-resumes"
            variant="ghost"
            size="lg"
          >
            My Resumes
          </Button>
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
          <nav className="fixed top-20 right-5 bg-background border p-4 flex flex-col space-y-2 rounded-lg items-start">
            <Button
              href="/"
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              href="/templates"
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Button>
            <Button
              variant="ghost"
              size="sm"
              href="/my-resumes"
              onClick={() => setIsMenuOpen(false)}
            >
              My Resumes
            </Button>
            <div className="pl-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
