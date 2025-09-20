"use client";
import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeForm } from "@/components/ResumeForm";
import LivePreview from "@/components/LivePreview";
import ResumeStartOptions from "@/components/ResumeStartOptions";
import { Upload, Eraser,Download } from "lucide-react";
import Modal from "@/components/Modal";
import { URL } from "@/app/page";
import { verifyToken } from "@/app/page";
import Button from "@/components/ui/Button";

export interface ResumeData {
  id: string;
  template: string;
  order: Array<string>;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
    country: string;
  };
  summary: string;
  workExperience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
    bulletPoints: Array<string>;
    isBulletPoints: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
    description: string;
    grade: string;
    location: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
    key: string;
    value: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    link: string;
    description: string;
    bulletPoints: Array<string>;
    isBulletPoints: boolean;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    year: string;
    description: string;
    bulletPoints: Array<string>;
    isBulletPoints: boolean;
  }>;
  languages: Array<{
    id: string;
    language: string;
    level: string;
  }>
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
    id: "",
    template: "SimpleResume",
    order: [
      "PersonalDetails",
      "Summary",
      "WorkExperience",
      "Education",
      "Skills",
      "Projects",
      "Achievements",
      "Languages"
    ],
    personalDetails: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      location: "",
      country: ""
    },
    summary: "",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    languages: []
  };

  const [resumeData, setResumeData] = useState<ResumeData>(() => initialLoad(defaultResumeData));
  const [clearFormModel, setClearFormModel] = useState<boolean>(false);
  const [startOption, setStartOption] = useState<startOptionsType>({
    model: true,
    option: "m",
  });
  const [uploadError, setUploadError] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<string[]>([
    "PersonalDetails",
    "Summary",
    "WorkExperience",
    "Education",
    "Skills",
    "Projects",
    "Achievements",
    "Languages"
  ]);
  const [isSave, setIsSave] = useState(false);
  const [isDirty, setIsDirty] = useState(true);

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...newData }));
    setIsDirty(true);
  };

  function isValidResumeData(data: any): data is ResumeData {
    if (!data || typeof data !== "object") return false;
    if (typeof data.id !== "string") return false;
    if (typeof data.template !== "string") return false;
    if (!data.personalDetails || typeof data.personalDetails !== "object") return false;
    if (!Array.isArray(data.workExperience)) return false;
    if (!Array.isArray(data.education)) return false;
    if (!Array.isArray(data.skills)) return false;
    if (!Array.isArray(data.projects)) return false;
    if (!Array.isArray(data.achievements)) return false;
    if (!Array.isArray(data.languages)) return false;

    return true;
  }

  useEffect(() => {
    try {
      localStorage.setItem("data", JSON.stringify(resumeData));
    } catch (err) {
      console.error("Failed to save resume data:", err);
    }
  }, [resumeData]);

  function autoFill(data: any) {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      if (!isValidResumeData(data)) {
        console.warn("Invalid resume data received, ignoring:", data);
        return;
      }
      // setResumeData(data);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to parse resume data:", err);
    }
  }


  async function onUpload(file: File) {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(URL + "/upload-file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        autoFill(data.response)
        setStartOption({
          model: false,
          option: "u"
        });
        sessionStorage.setItem("option", "u");
        setUploadError(false);
      } else {
        setUploadError(true);
      }
    } catch (err) {
      console.error("Error uploading File:", err);
      setUploadError(true);
    } finally {
      setLoading(false);
    }

  }

  function onManual() {
    setUploadError(false);
    setStartOption({
      model: false,
      option: "m",
    });
    sessionStorage.setItem("option", "m");
  }

  function clearForm() {
    setResumeData(defaultResumeData);
    localStorage.removeItem("data");
    sessionStorage.removeItem("option");
    setClearFormModel(false);
    setStartOption((prev) => ({ ...prev, model: true }));
  }

  useEffect(() => {
    const opt = sessionStorage.getItem("option");
    if (opt) {
      if (opt === "m") onManual();
      else if (opt === "u") setStartOption({
        model: false,
        option: "u"
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const checkLogin = async () => {
        const result = await verifyToken(token);
        if (!result) setIsLogin(false)
        else {
          setIsLogin(true);
        }
      }
      checkLogin();
    }

    const template = localStorage.getItem("template");

    if (template) {
      handleDataChange({
        template: template
      });
    }

  }, []);

  const saveResume = async () => {
    try {
      const response = await fetch(URL + "/save-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("token")}`
        },
        body: JSON.stringify(resumeData),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Auto-save failed:", data.message);
      } else {
        autoFill(data.resume);
        console.log("Auto-saved:", data.message, data.resume);
        setIsSave(true);
      }
    } catch (error) {
      console.error("Error while auto-saving:", error);
      return false;
    }
  }

  useEffect(() => {
    if (!isDirty || !isLogin) return;
    setIsSave(false);
    if (isLogin) {
      const timerId = setTimeout(() => {
        saveResume().then((success) => {
          if (success) setIsSave(true);
        });
      }, 5000);
      return () => clearTimeout(timerId);
    }
  }, [resumeData]);


  return (
    <div className="min-h-screen bg-background ">
      <Header isLogin={isLogin} isSave={isSave} saveResume={saveResume} />
      <Modal
        isOpen={uploadError}
        message={"Something wrong!"}
        description={"Upload file failed try upload different file or Fill information Manually"}
        primaryButtonText={"Fill Form Manually"}
        secondaryButtonText={"Upload another file"}
        onPrimaryClick={onManual}
        onSecondaryClick={() => setUploadError(false)}
      />
      <Modal
        isOpen={clearFormModel}
        message="Clear All Data?"
        description="This action will delete all the information you’ve entered in the form. This cannot be undone. Are you sure you want to proceed?"
        primaryButtonText="Yes"
        secondaryButtonText="Cancel"
        onPrimaryClick={clearForm}
        onSecondaryClick={() => setClearFormModel(false)}
      />
      {startOption.model ? (
        <ResumeStartOptions
          onUpload={onUpload}
          onManual={onManual}
          loading={loading}
        />
      ) : (
        <main className="mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-0 overflow-y-auto pr-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 justify-start pb-4 overflow-y-visible">
                  <Button
                    onClick={() => setStartOption((prev) => ({ ...prev, model: true }))}
                    icon={<Upload className="h-4" />}
                    size="sm"
                    variant="primary"
                  >
                    Upload Resume
                  </Button>

                  <Button
                    onClick={() => setClearFormModel(true)}
                    icon={<Eraser className="h-4" />}
                    size="sm"
                    variant="secondary"
                  >
                    Clear Form
                  </Button>


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
            <div className="flex flex-col gap-4 items-start">
              <Button
                variant="primaryPlus"
                size="sm"
                icon={<Download className="h-4 w-4" />}
              >Export As</Button>
              <LivePreview data={resumeData} />
            </div>

          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
