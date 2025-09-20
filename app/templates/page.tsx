"use client"
import Templates from "@/components/Templates";
import Link from "next/link"
import { Cloud, FileText, Menu, X, Save } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function Template() {

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

    const handleClick = (template: string) => {
        localStorage.setItem("template", template);
        window.location.href = "/create-resume"
    }

    return (
        <div>
            <header className="sticky top-0 z-50 left-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6  text-primary" />
                        <span onClick={() => window.location.href = "/"} className="text-sm md:text-xl font-bold text-foreground cursor-pointer">Smart Resume</span>
                    </div>

                    <nav className="hidden md:flex items-center justify-between  space-x-6">
                        <Button
                            href="/"
                            variant="ghost"
                            size="lg"
                        >
                            Home
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
                    <div className="flex items-center space-x-2 md:hidden">
                        <div className="py-2 ">
                            <ThemeToggle />
                        </div>
                        <button
                            className="p-2 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden">
                        <nav className="fixed right-0 top-16 bg-background border px-4 py-4 flex flex-col items-start space-y-4">
                            <Button
                                href="/"
                                variant="ghost"
                                size="lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Button>
                            <Button
                                href="/my-resumes"
                                onClick={() => setIsMenuOpen(false)}
                                variant="ghost"
                                size="lg"
                            >
                                My Resumes
                            </Button>
                        </nav>
                    </div>
                )}
            </header>
            <Templates
                templates={["SimpleResume", "T1"]}
            />
        </div>
    )
}