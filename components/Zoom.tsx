"use client"
import { ResumeData } from "@/app/create-resume/page"
import { useState } from "react"
import {
    X,Check, Users,
    Palette, Sparkles, HelpCircle, Download
} from "lucide-react"
import LivePreview from "./LivePreview"


interface ZoomType {
    isOpen : boolean,
    data: ResumeData,
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>
}

export default function Zoom({ isOpen = false, data ,setIsOpen}: ZoomType) {

    if (!isOpen) {
        return (null)
    }

    return (
        <div onClick={()=>{
            setIsOpen(false)
        }} className="fixed inset-0 z-999 min-h-screen bg-black/50 min-w-screen top-0 left-0 flex items-center justify-center">
            <div onClick={(e) => e.stopPropagation()}
            className="relative bg-white max-w-3xl w-full max-h-[90vh] border relative flex justify-center items-start overflow-y-scroll py-4 rounded-lg">
                <LivePreview data={data}/>
                <button 
                onClick={()=>setIsOpen(false)}
                className="absolute top-5 cursor-pointer right-5"><X /></button>
            </div>
            
        </div>
    )
}


