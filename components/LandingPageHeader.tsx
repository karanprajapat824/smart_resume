import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from 'next/link';
import {
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { verifyToken } from "@/exports/auth";
import Button from "./ui/Button";
import PageLoader from "./ui/PageLoader";

export default function LandingPageHeader() {
  const [smallScreenMenuOpen, setSmallScreenMenuOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const checkLogin = async () => {
        const result = await verifyToken(token);
        setIsLogin(result);
        setLoading(false);
      }
      checkLogin();
    }
    else setLoading(false);
  },[]);

  const handleRedirect = ()=>{
    localStorage.setItem("redirectAfterLogin", "/"); 
    window.location.href = "/login";
  }

  if(loading) return <PageLoader />

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
            <div 
            className="absolute top-20 right-5 bg-background border rounded-lg border-bl-lg flex flex-col p-5  space-y-4 md:hidden z-50 justify-start">
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
        <div className="hidden md:flex items-center space-x-3">
          <Button
            variant="outline"
            size="md"
            onClick={isLogin ? ()=>window.location.href = "/my-resumes" : ()=>handleRedirect()}
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