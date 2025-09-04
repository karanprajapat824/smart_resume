import { ResumeData } from "@/app/create-resume/page";
import Template1 from "@/templates/Template1";
import { ArrowDownToLine } from "lucide-react"
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface LivePreviewType {
  data: ResumeData;
  template: string;
  order?: string[]
}


export default function LivePreview({ data, template = "Template1", order }: LivePreviewType) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "",
  });

  return (
    <div className="space-y-4 h-fit sticky flex top-0 w-160 overflow-auto relative">
      <button
        onClick={handlePrint}
        className="absolute top-0 left-10 border w-50 rounded bg-primary text-primary-foreground text-sm py-2 px-4 font-semibold hover:cursor-pointer flex items-center justify-center gap-2">
        <ArrowDownToLine className="h-4" />
        Download Resume
      </button>
      <div className="bg-card  border p-0 a4-page">
        <Template1 data={data}
          ref={resumeRef}
          order={order || [
            "PersonalDetails",
            "Summery",
            "Education",
            "WorkExperience",
            "Skills",
            "Projects",
            "Achievements"
          ]} />
      </div>
    </div>
  );
}
