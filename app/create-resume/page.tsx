"use client";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeForm } from "@/components/ResumeForm";
import LivePreview from "@/components/LivePreview";
import ResumeStartOptions from "@/components/ResumeStartOptions";
import { Upload } from "lucide-react";

export interface ResumeData {
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    address: string;
  };
  summary: string;
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
    bulletPoints: Array<string>;
    isBulltePoints: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description: string;
    grade: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    link: string;
    description: string;
    bulletPoints: Array<string>;
    isBulltePoints: boolean;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    year: string;
    description: string;
    bulletPoints: Array<string>;
    isBulltePoints: boolean;
  }>;
}

interface startOptionsType {
  model: boolean;
  option: string;
}

export function initialLoad(defaultData: ResumeData): ResumeData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem("data");
    if (!raw) {
      localStorage.setItem("data", JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as ResumeData;
  } catch (err) {
    console.error("initialLoad error:", err);
    return defaultData;
  }
}


export default function CreateResumePage() {
  const defaultResumeData: ResumeData = {
    personalDetails: {
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
  };
  const [resumeData, setResumeData] = useState<ResumeData>(() => initialLoad(defaultResumeData));

  const [startOption, setStartOption] = useState<startOptionsType>({
    model: true,
    option: "m",
  });

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...newData }));
  };


  useEffect(() => {
    try {
      localStorage.setItem("data", JSON.stringify(resumeData));
    } catch (err) {
      console.error("Failed to save resume data:", err);
    }
  }, [resumeData]);

  function onUpload() { }

  function onManual() {
    setStartOption({
      model: false,
      option: "m",
    });
    sessionStorage.setItem("option", "m");
  }

  function clearForm()
  {
     setResumeData(defaultResumeData);
     localStorage.removeItem("data");
     sessionStorage.removeItem("option");
  }

  useEffect(() => {
    const opt = sessionStorage.getItem("option");
    if (opt) {
      if (opt === "m") onManual();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {startOption.model ? (
        <ResumeStartOptions onUpload={onUpload} onManual={onManual} />
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-0 overflow-y-auto pr-4">
              <div className="flex flex-col gap-1">
                <div className="pb-4 flex items-center gap-3">
                  <div>
                    <label
                    htmlFor="file"
                    className="border w-50 rounded bg-primary text-primary-foreground text-sm py-2 px-4 font-semibold hover:cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="h-4" />
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    id="file"
                    className="sr-only"
                  ></input>
                  </div>
                  <button
                  onClick={clearForm}
                  className="border w-50 rounded bg-primary text-primary-foreground text-sm py-2 px-4 font-semibold hover:cursor-pointer flex items-center justify-center gap-2"
                  >
                  Clear Form</button>
                </div>
                <h1 className="text-2xl font-bold text-foreground flex items-center justify-between">
                  Enter Your Information
                </h1>
                <div className="text-muted-foreground">
                  Fill out the sections below to build your professional resume
                </div>
              </div>
              <ResumeForm data={resumeData} onChange={handleDataChange} />
            </div>
            <LivePreview data={resumeData} template="Templete1" onChange={handleDataChange} />
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
