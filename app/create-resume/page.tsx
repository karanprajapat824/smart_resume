"use client"
import { useState } from "react"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { ResumeForm } from "@/components/ResumeForm"
import LivePreview from "@/components/LivePreview"

export interface ResumeData {
  personalDetails: {
    name: string
    email: string
    phone: string
    linkedin: string
    github: string
    address: string
  }
  summary: string
  workExperience: Array<{
    id: string
    company: string
    role: string
    duration: string
    description: string,
    bulletPoints : Array<string>,
    isBulltePoints : boolean
  }>
  education: Array<{
    id: string
    degree: string
    institution: string
    year: string
    description: string
  }>
  skills: Array<{
    id: string
    name: string
  }>
  projects: Array<{
    id: string
    title: string
    link: string
    description: string,
    bulletPoints : Array<string>,
    isBulltePoints : boolean
  }>
  achievements: Array<{
    id: string
    title: string
    year: string,
    description : string,
    bulletPoints : Array<string>,
    isBulltePoints : boolean
  }>
}

export default function CreateResumePage() {
  const [resumeData,setResumeData] = useState<ResumeData>({
    personalDetails : {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      address: "",
    },
    summary: "",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
  })

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...newData }))
    console.log(resumeData);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 overflow-y-auto pr-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-foreground">Enter Your Information</h1>
              <div className="text-muted-foreground">Fill out the sections below to build your professional resume</div>
            </div>
            <ResumeForm data={resumeData} onChange={handleDataChange} />
          </div>
          <LivePreview />
        </div>
      </main>
      <Footer />
    </div>
  )
}
