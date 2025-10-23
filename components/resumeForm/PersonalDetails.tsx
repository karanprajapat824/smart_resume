"use client";
import { useEffect, useRef } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { ResumeSectionProps } from "../ResumeForm";
import Input from "@/components/ui/Input";

export default function PersonalDetails({
  data,
  onChange,
  openSections,
  setOpenSections
}: ResumeSectionProps) {
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

  return (
    <div>
      <ResumeFormHeader
        isOpen={openSections.personalDetail}
        setIsOpen={setOpenSections}
        heading="Personal Details"
        name="personalDetail"
      />
      <div className="pt-4 border-b">
        <div className={`pt-1 space-y-4 pb-4 ${!openSections.personalDetail && "hidden"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <Input
              label="Full Name"
              id="name"
              value={data.personalDetails.name}
              placeholder="Karan Prajapat"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    name: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 0)}
              inputRef={(el) => {
                personalDetailsRefs.current[0] = el;
              }}
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={data.personalDetails.email}
              placeholder="karanprajapat824@gmail.com"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    email: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 1)}
              inputRef={(el) => {
                personalDetailsRefs.current[1] = el;
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <Input
              label="Phone"
              id="phone"
              value={data.personalDetails.phone}
              placeholder="+91 8770738268"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    phone: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 2)}
              inputRef={(el) => {
                personalDetailsRefs.current[2] = el;
              }}
            />
            <Input
              label="LinkedIn Username"
              id="linkedin"
              value={data.personalDetails.linkedin}
              placeholder="karanprajapat824"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    linkedin: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 3)}
              inputRef={(el) => {
                personalDetailsRefs.current[3] = el;
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <Input
              label="GitHub Username"
              id="github"
              value={data.personalDetails.github}
              placeholder="karanprajapat824"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    github: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 4)}
              inputRef={(el) => {
                personalDetailsRefs.current[4] = el;
              }}
            />
            <Input
              label="Location"
              id="address"
              value={data.personalDetails.location}
              placeholder="Ujjain M.P"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    location: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 5)}
              inputRef={(el) => {
                personalDetailsRefs.current[5] = el;
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <Input
              label="Country"
              id="country"
              value={data.personalDetails.country}
              placeholder="India"
              onChange={(value) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    country: value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 6)}
              inputRef={(el) => {
                personalDetailsRefs.current[6] = el;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
