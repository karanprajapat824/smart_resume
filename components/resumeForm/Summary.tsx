"use client"
import { useRef, useEffect } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import {
  Sparkles,
} from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";;
import { Button, Textarea } from "@/components/Ui"
import { useUtility } from "@/app/providers/UtilityProvider";

export default function Summary({
  openSections,
  setOpenSections
}: ResumeSectionProps) {
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const { resumeData, handleDataChange } = useUtility();
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
            value={resumeData?.summary}
            onChange={(e) => handleDataChange({ summary: e.target.value })}
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
