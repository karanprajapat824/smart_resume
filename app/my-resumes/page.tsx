"use client"
import { ResumeData } from "../create-resume/page"
import { useEffect, useState } from "react"
import { FileText, Plus } from "lucide-react"
import { URL } from "@/exports/info"
import Link from "next/link";
import MyresumeCard from "@/components/MyresumeCard";
import { verifyToken,logout } from "@/exports/auth";


export default function ResumeDashboard() {
    const [resumes, setResumes] = useState<ResumeData[]>([])
    const [isLogin, setIsLogin] = useState(false);

    async function fetchResumes() {
        try {

            const token = localStorage.getItem("token")
            if (!token) {
                return
            }

            const res = await fetch(URL + "/resumes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.message || "Failed to fetch resumes")
            }

            const data = await res.json()
            setResumes(data.resumes)
            console.log(data);
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



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div onClick={() => window.location.href = "/"} className="flex items-center space-x-3 cursor-pointer">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Smart Resume</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => window.location.href = "/"} className="text-gray-500 hover:text-gray-900 cursor-pointer">Home</button>
                            <button onClick={() => window.location.href = "/templates"} className="text-gray-500 hover:text-gray-900 cursor-pointer">Templates</button>
                            <button className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition hover:cursor-pointer">
                                {
                                    isLogin ? <Link onClick={logout} href="/">Logout</Link> : <Link href="/login">Login / Sign up</Link>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h2>
                    <p className="text-gray-500">Manage and organize your professional resumes</p>
                </div>

                {/* Resume Grid */}
                <div className="flex flex-wrap items-center justify-start gap-6">
                    {/* Create New Resume */}
                    <div onClick={handleCreateResume} className="group  max-w-[285px] cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all duration-200 rounded-lg flex flex-col items-center justify-center p-8 text-center min-h-100 ">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            <Plus className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Create New Resume</h3>
                        <p className="text-sm text-gray-500">Start building your professional resume</p>
                    </div>

                    {/* Resume Cards */}
                    {resumes?.map((resume) => (
                        <MyresumeCard key={resume.id} resume={resume} fetchResumes={fetchResumes} />
                    ))}
                </div>
            </main>
        </div>
    )
}
