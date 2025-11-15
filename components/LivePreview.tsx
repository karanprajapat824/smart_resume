"use client";
import SimpleResume from "@/templates/SimpleResume";
import T1 from "@/templates/T1";
import { ArrowDownToLine, FileImage, Download } from "lucide-react";
import { useEffect, useRef, useState, forwardRef } from "react";
import Button from "./ui/Button";
import { ResumeData } from "@/exports/utility";

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


const LivePreview = forwardRef<HTMLDivElement, LivePreviewType>(
  ({ data, temp }, ref) => {
    
    const [exportLoading, setExportLoading] = useState<boolean>(false);
    const [template, setTemplate] = useState<string>(temp || "SimpleResume");
    const [loadingDone, setLoadingDone] = useState<boolean>(false);

    
    useEffect(() => {
      const savedTemplate = localStorage.getItem("template");
      if (savedTemplate) {
        setTemplate(savedTemplate);
        setLoadingDone(true);
      }
    }, []);

    const rawMap = makeTemplateMap();
    const SelectedTemplate = rawMap[temp || data?.template || template] || SimpleResume;

    return (
      <div className="a4-page scrollbar-hidden">
        {
          loadingDone && <SelectedTemplate
            data={data}
            ref={ref}
          />
        }
      </div>
    );
  }
);

LivePreview.displayName = "LivePreview";
export default LivePreview;