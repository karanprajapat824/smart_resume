"use client";
import { useEffect, useRef } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { ResumeSectionProps } from "../ResumeForm";
import {Input} from "@/components/Ui";
import { useUtility, ResumeData } from "@/app/providers/UtilityProvider";

export default function PersonalDetails({
  openSections,
  setOpenSections
}: ResumeSectionProps) {
  const { resumeData, handleDataChange } = useUtility();
  const personalDetailsRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handlePersonalDetailRefs = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = personalDetailsRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  useEffect(() => {
    personalDetailsRefs.current[0]?.focus();
  }, [openSections.personalDetail]);

  type PersonalDetailKey = keyof ResumeData["personalDetails"];

  const personalFields: {
    label: string;
    id: PersonalDetailKey;
    placeholder: string;
    type?: string;
  }[] = [
      { label: "Full Name", id: "name", placeholder: "Karan Prajapat" },
      { label: "Email", id: "email", type: "email", placeholder: "karanprajapat824@gmail.com" },
      { label: "Phone", id: "phone", placeholder: "+91 8770738268" },
      { label: "LinkedIn Username", id: "linkedin", placeholder: "karanprajapat824" },
      { label: "GitHub Username", id: "github", placeholder: "karanprajapat824" },
      { label: "Location", id: "location", placeholder: "Ujjain M.P" },
      { label: "Country", id: "country", placeholder: "India" },
    ];

  return (
    <div className="border-b pb-4">
      <ResumeFormHeader
        isOpen={openSections.personalDetail}
        setIsOpen={setOpenSections}
        heading="Personal Details"
        name="personalDetail"
      />
      <div className={`space-y-4 py-4 ${!openSections.personalDetail && "hidden"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          {personalFields.map((field, index) => (
            <Input
              key={field.id}
              label={field.label}
              id={field.id}
              type={field.type || "text"}
              value={resumeData?.personalDetails[field.id]}
              placeholder={field.placeholder}
              onChange={(e) =>
                handleDataChange({
                  personalDetails: {
                    ...resumeData.personalDetails,
                    [field.id]: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, index)}
              ref={(el) => {
                personalDetailsRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
