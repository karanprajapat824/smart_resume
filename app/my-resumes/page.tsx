"use client"
import { useEffect, useState } from "react"
import { FileText, Plus, X, Menu, ZoomIn, Trash, CircleFadingArrowUp } from "lucide-react"
import { API_URL, ResumeData } from "@/exports/utility"
import Button from "@/components/ui/Button";
import { verifyToken, logout } from "@/exports/auth";
import SmallPreview from "@/components/Preview";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Zoom from "@/components/ZoomInForMyResume"
import Popup from "@/components/ui/Popup";
import Loader from "@/components/ui/Loader";


type PopupState = {
    visible: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
};

export default function ResumeDashboard() {
    const [resumes, setResumes] = useState<ResumeData[]>([])
    const [isLogin, setIsLogin] = useState(false);
    const [smallScreenMenuOpen, setSmallScreenMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [popup, setPopup] = useState<PopupState>({
        visible: false,
        message: "",
        type: "error"
    });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleLogin = () => {
        localStorage.setItem("redirectAfterLogin", "/my-resumes");
        window.location.href = "/login";
    }


    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    async function fetchResumes() {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                return
            }

            const res = await fetch(API_URL + "/resume/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })

            if (!res.ok) {
                setPopup({
                    visible: true,
                    message: "Failed to fetch resume",
                    type: "error"
                });
            }
            const data = await res.json()
            setResumes(data.resumes)

        } catch (err: any) {
            console.log("error " + err);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const checkLogin = async () => {
                const result = await verifyToken(token);
                if (!result) setIsLogin(false)
                else {
                    setIsLogin(true);
                    fetchResumes();
                }
            }
            checkLogin();
        }
    }, [])

    function handleCreateResume() {
        localStorage.removeItem("data");
        sessionStorage.removeItem("option");
        window.location.href = "/templates";
    }

    async function handleDelete(id: string) {
        const token = localStorage.getItem("token");

        if (!token || !id) {
            setPopup({
                visible: true,
                message: "Something went wrong. Please try again later.",
                type: "error",
            });
            return;
        }

        try {
            setDeleteLoading(true);

            const response = await fetch(`${API_URL}/resume/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setPopup({
                    visible: true,
                    message: "Delete successfully",
                    type: "success",
                });

                setResumes(resumes.filter((resume) => resume.id !== id));
                return;
            }

            const data = await response.json().catch(() => ({}));

            setPopup({
                visible: true,
                message: data.message || "Something went wrong. Please try again later.",
                type: "error",
            });

        } catch (err) {
            setPopup({
                visible: true,
                message: "Network error. Please try again later.",
                type: "error",
            });

        } finally {
            setDeleteLoading(false);
        }
    }

    async function handleUpdateResume(id: string) {
        window.location.href = `/create-resume?id=${id}`
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Popup
                visible={popup.visible}
                message={popup.message}
                type={popup.type || "error"}
                setVisible={(v) =>
                    setPopup(prev => ({
                        ...prev,
                        visible: typeof v === "function" ? v(prev.visible) : v
                    }))
                }
            />
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div onClick={() => window.location.href = "/"} className="flex items-center space-x-3 cursor-pointer">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-3 h-3 md:w-5 md:h-5 text-white" />
                            </div>
                            <h1 className="md:text-xl text-lg font-bold text-gray-900">Smart Resume</h1>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Button
                                href="/"
                                size="lg"
                                variant="ghost"
                            >
                                Home
                            </Button>
                            <Button
                                href="/templates"
                                size="lg"
                                variant="ghost"
                            >
                                Templates
                            </Button>
                            {
                                isLogin ? (
                                    <Button
                                        onClick={logout}
                                        variant="outline"
                                        size="md"
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleLogin}
                                        size="md"
                                        variant="outline"
                                    >
                                        Login / Sign up
                                    </Button>
                                )
                            }

                        </div>
                        <div className="md:hidden flex items-center space-x-2">
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
                            {
                                smallScreenMenuOpen && (
                                    <div
                                        className="absolute top-20 right-5 bg-background border rounded-lg border-bl-lg flex flex-col p-5  space-y-4 md:hidden z-50 justify-start">
                                        {
                                            isLogin ?
                                                <Button
                                                    variant="outline"
                                                    size="md"
                                                    onClick={logout}
                                                >
                                                    Logout
                                                </Button>
                                                :
                                                <Button
                                                    variant="outline"
                                                    size="md"
                                                    onClick={handleLogin}
                                                >
                                                    Login / Signup
                                                </Button>
                                        }
                                        <Button
                                            variant="primary"
                                            size="md"
                                            href={"/templates"}
                                        >
                                            Tamplates
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h2>
                    <p className="text-gray-500">Manage and organize your professional resumes</p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 items-center justify-center place-items-center gap-6">
                    <div onClick={handleCreateResume} className="group cursor-pointer small-page-wrapper border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all duration-200 rounded-lg flex flex-col items-center justify-center p-8 text-center ">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Create New Resume</h3>
                        <p className="text-sm text-gray-500">Start building your professional resume</p>
                    </div>

                    {resumes?.map((resume, index) => (
                        <div
                            key={index}
                            className={`overflow-hidden rounded-lg small-page-wrapper relative group
                            motion-safe:transform-gpu will-change-transform
                            transition-[transform,box-shadow] duration-1000 ease-out
                            shadow-lg cursor-pointer ${!isMobile ? "hover:-translate-y-1 hover:shadow-xl" : ""}`}
                        >
                            <div
                                className={`absolute inset-0 z-20 flex flex-col items-center justify-between p-4
                                transition-[opacity,transform] duration-500 ease-out
                                ${isMobile
                                        ? "opacity-100 pointer-events-auto"
                                        : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto -translate-y-2"
                                    }`}
                            >
                                <div></div>

                                <div className="border p-4 rounded-full bg-muted/80 hover:scale-105 z-30 transition-transform cursor-pointer">
                                    <ZoomIn
                                    // onClick={() => handleZoomTemplate(template)}
                                    />
                                </div>
                                <div className="flex justify-around w-full gap-4">
                                    <Button
                                        variant="outline"
                                        size="md"
                                        className="bg-destructive-foreground text-white w-1/2 hover:scale-[1.1] hover:bg-red-500 hover:text-white"
                                        icon={<Trash className="w-4 h-4" />}
                                        onClick={() => handleDelete(resume?.id || "")}
                                        disabled={deleteLoading}
                                    >{
                                            deleteLoading ? <Loader /> : "Delete"
                                        }
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="md"
                                        className="bg-success-foreground text-white w-1/2 hover:scale-[1.1] hover:bg-success-foreground hover:text-white"
                                        icon={<CircleFadingArrowUp className="w-4 h-4" />}
                                        onClick={() => handleUpdateResume(resume?.id || "")}
                                    >Update</Button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <SmallPreview data={resume} template={resume?.template || ""} />
                            </div>
                        </div>

                    ))}

                </div>
            </main >
        </div >
    )
}
