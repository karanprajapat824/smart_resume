"use client";
import { ResumeData } from "@/app/create-resume/page";
import SimpleResume from "@/templates/SimpleResume";
import T1 from "@/templates/T1";
import { ArrowDownToLine, FileImage } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";

interface LivePreviewType {
  data: ResumeData;
  template?: string;
  order?: string[];
}

const makeTemplateMap = () => {
  const map: Record<string, React.ElementType> = {
    SimpleResume,
    T1,
  };
  return map;
};

export default function LivePreview({ data, template = "T1", order }: LivePreviewType) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [exportLoading,setExportLoading] = useState<boolean>(false);
  // const handlePrint = useReactToPrint({
  //   contentRef: resumeRef,
  //   documentTitle: "resume",
  // });

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

  const rawMap = makeTemplateMap();
  const SelectedTemplate = rawMap[template] || SimpleResume

  if (typeof window !== "undefined") {
    console.log("LivePreview requested template:", template);
    console.log("Resolved component:", SelectedTemplate);
    console.log("Available templates:", Object.keys(rawMap));
  }

  if (!SelectedTemplate) {
    const available = Object.keys(rawMap).join(", ");
    return (
      <div className="p-4 border rounded bg-yellow-50 text-yellow-900">
        <strong>Template not found:</strong> <span>{String(template)}</span>
        <div className="mt-2 text-sm text-neutral-700">
          Available templates: {available}
        </div>
        <div className="mt-3">
          Use one of the available template keys or check casing/spelling.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-fit sticky flex top-0 w-160 overflow-auto relative">
      <div className="absolute top-0 left-10 flex gap-2">
        <button
          onClick={handlePDFDownload}
          disabled={exportLoading}
          className="border rounded bg-primary text-primary-foreground text-sm py-2 px-4 font-semibold hover:cursor-pointer flex items-center gap-2"
        >
          <ArrowDownToLine className="h-4" /> 
          {exportLoading ? "Exporting Document, Please Wait..." : "PDF"}
        </button>
        <button
          onClick={handlePNGDownload}
          className="border rounded bg-primary text-primary-foreground text-sm py-2 px-4 font-semibold hover:cursor-pointer flex items-center gap-2"
        >
          <FileImage className="h-4" /> PNG
        </button>
      </div>

      <div className="bg-card border p-0 a4-page">
        <SelectedTemplate
          data={data}
          ref={resumeRef}
          order={
            order || [
              "PersonalDetails",
              "Summery",
              "Education",
              "WorkExperience",
              "Skills",
              "Projects",
              "Achievements",
            ]
          }
        />
      </div>
    </div>
  );
}
