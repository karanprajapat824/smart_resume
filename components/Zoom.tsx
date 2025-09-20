"use client"
import { ResumeData } from "@/app/create-resume/page"
import {
    X, Check, Users,
    Palette, Sparkles, HelpCircle, Download
} from "lucide-react"
import LivePreview from "./LivePreview"
import Button from "./ui/Button"


interface ZoomType {
    isOpen: boolean,
    data: ResumeData,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleSelectedTemplate: (template: string) => void
}

export default function Zoom({ isOpen = false, data, setIsOpen, handleSelectedTemplate }: ZoomType) {

    if (!isOpen) {
        return (null)
    }

    return (
        <div onClick={() => {
            setIsOpen(false)
        }} className="fixed inset-0 z-999 min-h-screen bg-black/50 min-w-screen top-0 left-0 flex items-center justify-center">
            <div onClick={(e) => e.stopPropagation()}
                className="relative md:rounded-lg h-full w-full md:h-[90vh] md:w-[90vw] bg-background overflow-y-auto my-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
                <div className="relative flex items-center justify-center py-15 lg:pt-10 ">
                    <div className="rounded bg-white a4-page-wrapper">
                        <LivePreview data={data} />
                    </div>
                </div>
                <div className="lg:pt-10 relative flex flex-col items-center ">
                    <div className="p-6 flex flex-col">
                        <div className="mb-6">
                            <div className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium mb-3">
                                Modern
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-700">ATS-optimized</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-700">1-column layout</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-700">Editable sample content</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-gray-700">Download as PDF, Word, or TXT file</span>
                            </div>
                        </div>

                        {/* Use Template Button */}
                        <Button
                            variant="primaryPlus"
                            size="lg"
                            onClick={() => handleSelectedTemplate(localStorage.getItem("template") || "SimpleResume")}
                        >Use this template
                        </Button>

                        <div className="pt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="text-center">
                                <Palette className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                <h3 className="font-semibold text-sm mb-1">Customize your design</h3>
                                <p className="text-xs text-gray-600">Match the resume to your professional style.</p>
                            </div>
                            <div className="text-center">
                                <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                <h3 className="font-semibold text-sm mb-1">Get personalized suggestions</h3>
                                <p className="text-xs text-gray-600">Use AI-generated content personalized to previous roles.</p>
                            </div>
                            <div className="text-center">
                                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                <h3 className="font-semibold text-sm mb-1">Access writing help</h3>
                                <p className="text-xs text-gray-600">Beat ATS by using suggested keywords from the job listing.</p>
                            </div>
                            <div className="text-center">
                                <Download className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                <h3 className="font-semibold text-sm mb-1">Download in multiple formats</h3>
                                <p className="text-xs text-gray-600">Easily download your resume in various file formats.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-5 cursor-pointer right-5"><X />
                </button>
            </div>

        </div>
    )
}


