import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from 'next/link';
import {
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { verifyToken } from "@/app/page";
import Button from "./ui/Button";

export default function LandingPageHeader() {
  const [smallScreenMenuOpen, setSmallScreenMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const checkLogin = async () => {
        const result = await verifyToken(token);
        setIsLogin(result);
      }
      checkLogin();
    }
  }, []);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto py-4 flex px-4 items-center justify-between">
        <div className="flex items-center space-x-2 pl-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-lg md:text-2xl font-bold text-foreground hover:cursor-pointer">
            <Link href="/">Smart Resume</Link>
          </h1>
        </div>
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSmallScreenMenuOpen(!smallScreenMenuOpen)}
          >
            {
              smallScreenMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />
            }
          </Button>
        </div>
        {
          smallScreenMenuOpen && (
            <div className="absolute top-17 right-0 bg-background border-l border-b border-t border-bl-lg flex flex-col items-start space-y-4 py-4 px-10 md:hidden z-50 justify-start">
              <Button
                href="#features"
                variant="ghost"
                size="lg"
              >
                Features
              </Button>
              <Button
                href="#templates"
                variant="ghost"
                size="lg"
              >
                Templates
              </Button>
              <Button
                href="#testimonials"
                variant="ghost"
                size="lg"
              >
                Reviews
              </Button>
              <Button
                href="#contact"
                variant="ghost"
                size="lg"
              >
                Contact
              </Button>
              <Button
                variant="outline"
                size="md"
                href={isLogin ? "/my-resumes" : "/login"}
              >
                {
                  isLogin ? "My Resumes" : "Login / Sign up"
                }
              </Button>
              <Button
                variant="primary"
                size="md"
                href={"/templates"}
              >
                Create My Resume
              </Button>
            </div>
          )
        }
        <nav className="hidden lg:flex items-center space-x-0">
          <Button
            href="#features"
            variant="ghost"
            size="lg"
          >
            Features
          </Button>
          <Button
            href="#templates"
            variant="ghost"
            size="lg"
          >
            Templates
          </Button>
          <Button
            href="#testimonials"
            variant="ghost"
            size="lg"
          >
            Reviews
          </Button>
          <Button
            href="#contact"
            variant="ghost"
            size="lg"
          >
            Contact
          </Button>
        </nav>
        <div className="hidden md:flex items-center space-x-3">
          <Button
            variant="outline"
            size="md"
            href={isLogin ? "/my-resumes" : "/login"}
          >
            {
              isLogin ? "My Resumes" : "Login / Sign up"
            }
          </Button>
          <Button
            variant="primary"
            size="md"
            href={"/templates"}
          >
            Create My Resume
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}