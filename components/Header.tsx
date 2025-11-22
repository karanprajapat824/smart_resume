"use client";

import { useState } from "react";
import { FileText, Menu, X, Cloud, RefreshCw, Save } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/Ui";
import { useAuth } from "@/app/providers/AuthProvider";
import { useUtility } from "@/app/providers/UtilityProvider";

interface HeaderProps {
  items: string[];
  isSave?: boolean;
  saveResume?: () => void;
  afterLoginRedirect?: string;
}

export default function Header({ items, isSave = false, saveResume, afterLoginRedirect="/" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spin, setSpin] = useState(false);
  const { loggedIn, setLoggedIn, setAccessToken } = useAuth();
  const { API_URL } = useUtility();

  const handleSave = () => {
    if (!saveResume) return;
    saveResume();
    setSpin(true);
    setTimeout(() => setSpin(false), 3000);
  };

  async function logout() {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (res.ok) {
        setAccessToken(null);
        setLoggedIn(false);
      }
    } catch (e) {
      console.log("Error in logout : " + e);
    }
  }

  function handleLogin(){
    alert(afterLoginRedirect);
    localStorage.setItem("afterLoginRedirect",afterLoginRedirect);
    window.location.href = "/login";
  }

  const renderButton = (key: string) => {
    switch (key) {
      case "home":
        return (
          <Button href="/" variant="ghost" size="lg">Home</Button>
        );

      case "templates":
        return (
          <Button href="/templates" variant="ghost" size="lg">Templates</Button>
        );

      case "create-my-resume":
        return (
          <Button href="/templates" variant="primary" size="md">Create My Resume</Button>
        );

      case "my-resumes":
        return loggedIn ? (
          <Button href="/my-resumes" variant="outline" size="md">My Resumes</Button>
        ) : null;

      case "login":
        return !loggedIn ? (
          <Button onClick={handleLogin} variant="outline" size="md">Login / Sign up</Button>
        ) : null;

      case "logout":
        return loggedIn ? (
          <Button onClick={logout} variant="outline" size="md">Logout</Button>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="px-4 md:px-8 h-16 flex justify-between items-center">

        <div className="flex items-center gap-2 cursor-pointer">
          <div onClick={() => (window.location.href = "/")} className="flex items-center gap-2 cursor-pointer">
            <FileText className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold mr-4">Smart Resume</span>
          </div>
          {
            items[0] === "save" && (
              loggedIn ? (
                !isSave ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Cloud className="h-4" />}
                    onClick={handleSave}
                  >
                    Save
                    <RefreshCw className={`h-4 ${spin && "animate-spin"}`} />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-success-foreground text-success-foreground"
                    disabled={isSave}
                  >
                    <Cloud className="h-4" /> Saved
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  icon={<Save className="h-4" />}
                >
                  Login to Save
                </Button>
              )
            )
          }

        </div>

        <nav className="hidden md:flex items-center gap-2">
          {items.map((item) => (
            <div key={item}>
              {renderButton(item)}
            </div>
          ))}
          <div className="ml-4">
            <ThemeToggle />
          </div>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden text-right absolute right-0 px-4 py-8 w-full border bg-background flex flex-col items-center gap-3">
          {items.map((item) => (
            <div className="text-right" key={item}>
              {renderButton(item)}
            </div>
          ))}
          <div className="mt-4 text-right">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
