"use client";
import SimpleResume from "@/templates/SimpleResume";
import T1 from "@/templates/T1";
import { useEffect, useRef, useState, forwardRef } from "react";
import { useUtility, ResumeData } from "@/app/providers/UtilityProvider";

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
    const [template, setTemplate] = useState<string>(data?.template || temp || "SimpleResume");

    const rawMap = makeTemplateMap();
    const SelectedTemplate = rawMap[data?.template || template] || SimpleResume;
    return (
      <div className="a4-page scrollbar-hidden">
        {
          <SelectedTemplate
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