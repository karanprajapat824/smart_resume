"use client";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeForm } from "@/components/ResumeForm";
import LivePreview from "@/components/LivePreview";
import ResumeStartOptions from "@/components/ResumeStartOptions";
import { Upload, Eraser, Download } from "lucide-react";
import Modal from "@/components/Modal";
import { API_URL, ResumeData } from "@/exports/utility";
import { verifyToken } from "@/exports/auth";
import Button from "@/components/ui/Button";
import { CiImageOn } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa";
import { IoDocument } from "react-icons/io5";
import { BsFiletypeTxt } from "react-icons/bs";
import { toPng } from "html-to-image";
import PageLoader from "@/components/ui/PageLoader";

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
  const [isSave, setIsSave] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [exportAs, setExportAs] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportAs(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDataChange = (newData: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...newData }));
    setIsDirty(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem("data", JSON.stringify(resumeData));
      console.log(resumeData);
    } catch (err) {
      console.error("Failed to save resume data:", err);
    }
  }, [resumeData]);

  async function fetchResumeById(token: string, id: string) {
    if (!token || !id) {
      console.error("Missing token or id");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/resume/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error(err.message || "Failed to fetch resume");
        return;
      }

      const data = await res.json();
      if (data?.resume) autoFill(data.resume);

    } catch (error) {
      console.error("Network error while fetching resume", error);
    }
  }

  const handlePDFDownload = async () => {
    if (!resumeRef.current) return;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Resume</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        ${resumeRef.current.outerHTML}
      </body>
    </html>
  `;

    try {
      setExportLoading(true);
      const response = await fetch(`${API_URL}/extract/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        console.error("PDF generation failed:", await response.text());
        alert("Failed to generate PDF");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF request error:", err);
      alert("Something went wrong while generating the PDF.");
    } finally {
      setExportLoading(false);
      setExportAs(false);
    }
  };


  const handleImageDownload = async () => {
    if (!resumeRef.current) return;
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Resume</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body style="background:white;">
        ${resumeRef.current.outerHTML}
      </body>
    </html>
  `;
    try {
      setExportLoading(true);
      const response = await fetch(`${API_URL}/extract/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      
      if (!response.ok) {
        console.error("PDF generation failed:", await response.text());
        alert("Failed to generate PDF");
        return;
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.png";
      link.click();
    } catch (err) {
      console.error("Image export failed:", err);
      alert("Failed to export image");
    } finally {
      setExportLoading(false);
      setExportAs(false);
    }
  };




  function autoFill(data: any): ResumeData | null {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
    } catch (err) {
      console.error("Failed to parse resume data:", err);
      return null;
    }

    if (!data || typeof data !== "object") {
      console.warn("Input not an object — creating blank resume object.");
      data = {};
    }

    data.id = typeof data.id === "string" ? data.id : null;
    data.template = typeof data.template === "string" ? data.template : "";

    const defaultOrder = [
      "PersonalDetails",
      "Summary",
      "WorkExperience",
      "Education",
      "Skills",
      "Projects",
      "Achievements",
      "Languages",
    ];
    data.order = Array.isArray(data.order) ? data.order.map(String) : defaultOrder;

    data.personalDetails = data.personalDetails && typeof data.personalDetails === "object"
      ? data.personalDetails
      : {};
    const pdFields = [
      "name",
      "email",
      "phone",
      "linkedin",
      "github",
      "location",
      "country",
    ];
    pdFields.forEach((f) => {
      data.personalDetails[f] =
        typeof data.personalDetails[f] === "string"
          ? data.personalDetails[f]
          : "";
    });

    data.summary = typeof data.summary === "string" ? data.summary : "";

    const ensureArray = (v: any) => (Array.isArray(v) ? v : []);

    const sanitizeItems = (arr: any[], template: { [k: string]: any }) => {
      if (!Array.isArray(arr)) return [];
      if (arr.length === 0) return [];
      return arr.map((it) => {
        const item = it && typeof it === "object" ? { ...it } : {};
        const out: any = {};

        for (const key of Object.keys(template)) {
          const def = template[key];
          const val = item[key];

          if (Array.isArray(def)) {
            out[key] = Array.isArray(val) ? val.map(String) : [];
          } else if (typeof def === "string") {
            out[key] = typeof val === "string" ? val : "";
          } else if (typeof def === "boolean") {
            out[key] = typeof val === "boolean" ? val : def;
          } else {
            out[key] = val && typeof val === "object" ? { ...val } : def;
          }
        }
        out.id = typeof item.id === "string" ? item.id : null;

        return out;
      });
    };

    const workTemplate = {
      id: null as string | null,
      company: "",
      role: "",
      duration: "",
      description: "",
      bulletPoints: [] as string[],
    };

    const educationTemplate = {
      id: null as string | null,
      degree: "",
      institution: "",
      year: "",
      description: "",
      grade: "",
      location: "",
      bulletPoints: [] as string[],
    };

    const skillTemplate = {
      id: null as string | null,
      name: "",
      level: "",
      key: "",
      value: "",
    };

    const projectTemplate = {
      id: null as string | null,
      title: "",
      link: "",
      description: "",
      bulletPoints: [] as string[],
      isBulletPoints: false,
    };

    const achievementTemplate = {
      id: null as string | null,
      title: "",
      year: "",
      description: "",
      bulletPoints: [] as string[],
      isBulletPoints: false,
    };

    const languageTemplate = {
      id: null as string | null,
      language: "",
      level: "",
    };

    data.workExperience = ensureArray(data.workExperience);
    data.education = ensureArray(data.education);
    data.skills = ensureArray(data.skills);
    data.projects = ensureArray(data.projects);
    data.achievements = ensureArray(data.achievements);
    data.languages = ensureArray(data.languages);

    data.workExperience =
      data.workExperience.length > 0
        ? sanitizeItems(data.workExperience, workTemplate)
        : [];
    data.education =
      data.education.length > 0
        ? sanitizeItems(data.education, educationTemplate)
        : [];
    data.skills =
      data.skills.length > 0 ? sanitizeItems(data.skills, skillTemplate) : [];
    data.projects =
      data.projects.length > 0
        ? sanitizeItems(data.projects, projectTemplate)
        : [];
    data.achievements =
      data.achievements.length > 0
        ? sanitizeItems(data.achievements, achievementTemplate)
        : [];
    data.languages =
      data.languages.length > 0
        ? sanitizeItems(data.languages, languageTemplate)
        : [];

    data.workExperience = Array.isArray(data.workExperience)
      ? data.workExperience
      : [];
    data.education = Array.isArray(data.education) ? data.education : [];
    data.skills = Array.isArray(data.skills) ? data.skills : [];
    data.projects = Array.isArray(data.projects) ? data.projects : [];
    data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
    data.languages = Array.isArray(data.languages) ? data.languages : [];

    try {
      if (typeof setResumeData === "function") setResumeData(data);
      if (typeof setIsDirty === "function") setIsDirty(false);
    } catch (err) {
    }

    return data as unknown as ResumeData;
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
      const res = await fetch(API_URL + "/upload-file", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log("File uploaded successfully:", data);
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

    const id = new URLSearchParams(window.location.search).get("id");


    if (id && token) {
      fetchResumeById(token, id);
      setStartOption({
        model: false,
        option: "m"
      });
    }

  }, []);

  const saveResume = async () => {
    try {
      const response = await fetch(API_URL + "/resume/save", {
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
        console.log("Auto-saved : ", data.message, data.resume);
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

  if (exportLoading) return <PageLoader />

  return (
    <div className="min-h-screen bg-background z-0">

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
        <main className="mx-auto px-4 py-8 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-0 pr-4">
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
              <div ref={exportRef} className="flex items-center justify-start gap-4 relative z-1">
                <Button
                  variant="primaryPlus"
                  size="sm"
                  icon={<Download className="h-4 w-4" />}
                  onClick={() => setExportAs(!exportAs)}
                >Export As</Button>
                {
                  exportAs && <div className="absolute w-[21vh] bg-primary top-[7vh] rounded-lg z-999 border px-4 py-2 flex text-sm flex-col text-primary-foreground font-semibold gap-4 justify-center">
                    <div onClick={handlePDFDownload} className="flex gap-2 items-center cursor-pointer hover:text-black"><FaRegFilePdf className="h-4 w-4" />PDF</div>
                    <div onClick={handleImageDownload} className="flex gap-2 items-center cursor-pointer hover:text-black"><CiImageOn className="h-4 w-4" />Image</div>
                  </div>
                }
                <Button
                  variant="primaryPlus"
                  size="sm"
                  href="/templates"
                >Change Template</Button>
              </div>
              <div className="flex justify-center items-center w-full">
                <div className="a4-page-wrapper">
                  <LivePreview data={resumeData} ref={resumeRef} temp={resumeData?.template || ""} />
                </div>
              </div>
            </div>

          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}
