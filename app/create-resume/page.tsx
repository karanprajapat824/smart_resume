"use client";
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResumeForm } from "@/components/ResumeForm";
import LivePreview from "@/components/LivePreview";
import { Upload, Eraser, Download } from "lucide-react";
import Modal from "@/components/Modal";
import { useUtility, defaultResumeData } from "@/app/providers/UtilityProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { Button } from "@/components/Ui";
import { CiImageOn } from "react-icons/ci";
import { FaRegFilePdf } from "react-icons/fa";
import PageLoader from "@/components/PageLoader";



export default function CreateResumePage() {
  const { API_URL, resumeData, handleDataChange, autoFill, clearForm, isDirty } = useUtility();
  const { loggedIn, loading, setLoading, accessToken } = useAuth();
  const [clearFormModel, setClearFormModel] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [exportAs, setExportAs] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportAs(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const template = params.get("template");
    const id = params.get("id");
    if (id && loggedIn) {
      fetchResumeById(id);
    }
    else if (template) {
      handleDataChange({
        template: template
      });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn || !isDirty) return;
    setIsSave(false);
    if (loggedIn) {
      const timerId = setTimeout(() => {
        saveResume().then((success) => {
          if (success) setIsSave(true);
        });
      }, 5000);
      return () => clearTimeout(timerId);
    }
  }, [resumeData]);

  const fetchResumeById = async (id: string) => {
    if (!id) {
      console.error("Missing id");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/resume/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`
        },
        credentials: "include"
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

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {

    let file: File;

    if (e.target.files && e.target.files[0]) {
      file = e.target.files[0];
      e.target.value = '';
    } else {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(API_URL + "/extract/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        console.log("File uploaded successfully:", data);
        autoFill(data.response)
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

  const saveResume = async () => {
    try {
      const response = await fetch(API_URL + "/resume/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken || ""
        },
        body: JSON.stringify({ resumeData }),
        credentials: "include"
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Auto-save failed:", data.message);
      } else {
        autoFill(data.resume);
        setIsSave(true);
      }
    } catch (error) {
      console.error("Error while auto-saving:", error);
      return false;
    }
  }

  if (exportLoading || loading) return <PageLoader />

  return (
    <div className="min-h-screen bg-background z-0">
      <Header items={["save", "home", "templates", "my-resumes"]} isSave={isSave} saveResume={saveResume} />
      <Modal
        isOpen={uploadError}
        message={"Something wrong!"}
        description={"Upload file failed try upload different file or Fill information Manually"}
        primaryButtonText={"Fill Form Manually"}
        secondaryButtonText={"Upload another file"}
        onSecondaryClick={() => fileRef.current?.click()}
        onPrimaryClick={() => setUploadError(false)}
      />
      <Modal
        isOpen={clearFormModel}
        message="Clear All Data?"
        description="This action will delete all the information you’ve entered in the form. This cannot be undone. Are you sure you want to proceed?"
        primaryButtonText="Yes"
        secondaryButtonText="Cancel"
        onPrimaryClick={() => { setClearFormModel(false); clearForm() }}
        onSecondaryClick={() => setClearFormModel(false)}
      />
      <main className="mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-0 pr-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 justify-start pb-4 overflow-y-visible">
                <Button
                  icon={<Upload className="h-4" />}
                  size="sm"
                  variant="primary"
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    className="hidden"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.png,.jpg,.jpeg"
                    onChange={(e) => onUpload(e)}
                    id="file"
                    ref={fileRef}
                  />
                  Upload Existing Resume
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
            <ResumeForm />
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
                <LivePreview ref={resumeRef} data={resumeData} />
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
