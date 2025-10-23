"use client"
import { useState, useRef, useEffect } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import {
  Sparkles,
} from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import { Textarea } from "../ui/Textarea";
import Button from "../ui/Button";

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
          className={`h-40 mt-4 flex items-start flex-col w-full ${!openSections.summary && "hidden"
            }`}
        >
          <Textarea
            ref={summaryRef}
            id="summary"
            value={data.summary}
            onChange={(value) => onChange({ summary: value })}
            placeholder="Write a brief professional summary..."
          />
          <Button
            variant="primary"
            size="md"
            icon={<Sparkles className="h-4" />}
          >
            Ai Inhance
          </Button>
        </div>
      </div>
    </div>
  );
}
