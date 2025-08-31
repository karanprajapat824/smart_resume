"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { ResumeFormProps } from "./ResumeForm";

export default function PersonalDetails({
  data,
  onChange,
  open = false,
}: ResumeFormProps) {
  const personalDetailsRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [isOpen, setIsOpen] = useState<boolean>(open);

  const handlePersonalDetailRefs = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = personalDetailsRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
      }
    }
  };

  useEffect(() => {
    personalDetailsRefs.current[0]?.focus();
  }, [isOpen]);

  return (
    <div>
      <ResumeFormHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        heading="Personal Details"
      />
      <div className="pt-4 border-b">
        <div className={`pt-1 space-y-4 pb-4 ${!isOpen && "hidden"}`}>
          <div className="grid grid-cols-2 gap-4 ">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm" htmlFor="name">
                Full Name
              </label>
              <input
                ref={(el) => {
                  personalDetailsRefs.current[0] = el;
                }}
                className="border rounded py-1 px-4 w-60 text-sm"
                id="name"
                value={data.personalDetails.name}
                onChange={(e) =>
                  onChange({
                    personalDetails: {
                      ...data.personalDetails,
                      name: e.target.value,
                    },
                  })
                }
                onKeyDown={(e) => handlePersonalDetailRefs(e, 0)}
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm" htmlFor="email">
                Email
              </label>
              <input
                ref={(el) => {
                  personalDetailsRefs.current[1] = el;
                }}
                className="border rounded py-1 px-4 w-60 text-sm"
                id="email"
                type="email"
                value={data.personalDetails.email}
                onChange={(e) =>
                  onChange({
                    personalDetails: {
                      ...data.personalDetails,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="john@example.com"
                onKeyDown={(e) => handlePersonalDetailRefs(e, 1)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm" htmlFor="phone">
                Phone
              </label>
              <input
                ref={(el) => {
                  personalDetailsRefs.current[2] = el;
                }}
                className="border rounded py-1 px-4 w-60 text-sm"
                id="phone"
                value={data.personalDetails.phone}
                onChange={(e) =>
                  onChange({
                    personalDetails: {
                      ...data.personalDetails,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="+91 7387483083"
                onKeyDown={(e) => handlePersonalDetailRefs(e, 2)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm" htmlFor="linkedin">
                LinkedIn Username
              </label>
              <input
                ref={(el) => {
                  personalDetailsRefs.current[3] = el;
                }}
                className="border rounded py-1 px-4 w-60 text-sm"
                id="linkedin"
                value={data.personalDetails.linkedin}
                onChange={(e) =>
                  onChange({
                    personalDetails: {
                      ...data.personalDetails,
                      linkedin: e.target.value,
                    },
                  })
                }
                placeholder="johndoe"
                onKeyDown={(e) => handlePersonalDetailRefs(e, 3)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm" htmlFor="github">
                GitHub Username
              </label>
              <input
                ref={(el) => {
                  personalDetailsRefs.current[4] = el;
                }}
                className="border rounded py-1 px-4 w-60 text-sm"
                id="github"
                value={data.personalDetails.github}
                onChange={(e) =>
                  onChange({
                    personalDetails: {
                      ...data.personalDetails,
                      github: e.target.value,
                    },
                  })
                }
                placeholder="johndoe"
                onKeyDown={(e) => handlePersonalDetailRefs(e, 4)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm" htmlFor="address">
                Address
              </label>
              <input
                ref={(el) => {
                  personalDetailsRefs.current[5] = el;
                }}
                className="border rounded py-1 px-4 w-60 text-sm"
                id="address"
                value={data.personalDetails.address}
                onChange={(e) =>
                  onChange({
                    personalDetails: {
                      ...data.personalDetails,
                      address: e.target.value,
                    },
                  })
                }
                placeholder="Ujjain M.P"
                onKeyDown={(e) => handlePersonalDetailRefs(e, 5)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
