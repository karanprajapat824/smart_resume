"use client"
import { useState, useRef, useEffect } from "react";
import { ResumeFormProps } from "./ResumeForm";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import {
  Sparkles,
} from "lucide-react";

export default function Summery({
  data,
  onChange,
  open = false,
}: ResumeFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const summeryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    summeryRef.current?.focus();
  }, [isOpen]);


  return (
    <div>
      <ResumeFormHeader
        heading="Professional Summery"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="border-b pb-4">
        <div
          className={`h-40 mt-4 flex items-start flex-col ${
            !isOpen && "hidden"
          }`}
        >
          <textarea
            ref={summeryRef}
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
