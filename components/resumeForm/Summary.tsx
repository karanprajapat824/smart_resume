"use client"
import { useState, useRef, useEffect } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import {
  Sparkles,
} from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";

export default function Summary({
  data,
  onChange,
  openSections,
  setOpenSections
}: ResumeSectionProps) {
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    summaryRef.current?.focus();
  }, [openSections.summary]);


  return (
    <div>
      <ResumeFormHeader
        heading="Professional Summary"
        isOpen={openSections.summary}
        setIsOpen={setOpenSections}
        name="summary"
      />
      <div className="border-b pb-4">
        <div
          className={`h-40 mt-4 flex items-start flex-col ${
            !openSections.summary && "hidden"
          }`}
        >
          <textarea
            ref={summaryRef}
            id="summary"
            value={data.summary}
            onChange={(e) => onChange({ summary: e.target.value})}
            placeholder="Write a brief professional summary..."
            className="border rounded h-[60%] w-full resize-none p-4 text-sm"
          />
          <button className="mt-4 border bg-primary text-primary-foreground px-6 py-1 rounded w-40 hover:cursor-pointer flex items-center gap-2 border">
            <Sparkles className="h-5" />
            Ai Inhance
          </button>
        </div>
      </div>
    </div>
  );
}
