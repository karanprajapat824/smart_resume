"use client";
import { ResumeData } from "@/app/create-resume/page";
import SimpleResume from "@/templates/SimpleResume";
import T1 from "@/templates/T1";
import { ArrowDownToLine, FileImage, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Button from "./ui/Button";

interface LivePreviewType {
  data: ResumeData;
  temp?: string;
}

const makeTemplateMap = () => {
  const map: Record<string, React.ElementType> = {
    SimpleResume,
    T1,
  };
  return map;
};

export default function LivePreview({ data, temp }: LivePreviewType) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("SimpleResume");
  const [loadingDone, setLoadingDone] = useState<boolean>(false);
  
  const handlePDFDownload = async () => {
    if (!resumeRef.current) return;
    setExportLoading(true);
    const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Resume</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body>
      ${resumeRef.current?.outerHTML}
    </body>
  </html>
  `;
    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });
    if (!response.ok) {
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
    setExportLoading(false);
  };


  const handlePNGDownload = async () => {
    if (resumeRef.current) {
      const dataUrl = await toPng(resumeRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = "resume.png";
      link.href = dataUrl;
      link.click();
    }
  };

  useEffect(() => {
    const savedTemplate = localStorage.getItem("template");
    if (savedTemplate) {
      setTemplate(savedTemplate);
      setLoadingDone(true);
    }
  }, []);

  const rawMap = makeTemplateMap();
  const SelectedTemplate = rawMap[temp || template] || SimpleResume

  return (
    <div className="a4-page scrollbar-hidden">
      {
        loadingDone && <SelectedTemplate
          data={data}
          ref={resumeRef}
        />
      }
    </div>
  );
}
