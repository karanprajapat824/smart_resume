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
              name="name"
              value={data.personalDetails.name}
              placeholder="Karan Prajapat"
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    name: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 0)}
              ref={(el) => {
                personalDetailsRefs.current[0] = el;
              }}
            />
            <Input
              label="Email"
              id="email"
              type="email"
              value={data.personalDetails.email}
              placeholder="karanprajapat824@gmail.com"
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    email: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 1)}
              ref={(el) => {
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
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    phone: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 2)}
              ref={(el) => {
                personalDetailsRefs.current[2] = el;
              }}
            />
            <Input
              label="LinkedIn Username"
              id="linkedin"
              value={data.personalDetails.linkedin}
              placeholder="karanprajapat824"
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    linkedin: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 3)}
              ref={(el) => {
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
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    github: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 4)}
              ref={(el) => {
                personalDetailsRefs.current[4] = el;
              }}
            />
            <Input
              label="Location"
              id="address"
              value={data.personalDetails.location}
              placeholder="Ujjain M.P"
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    location: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 5)}
              ref={(el) => {
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
              onChange={(e) =>
                onChange({
                  personalDetails: {
                    ...data.personalDetails,
                    country: e.target.value,
                  },
                })
              }
              onKeyDown={(e) => handlePersonalDetailRefs(e, 6)}
              ref={(el) => {
                personalDetailsRefs.current[6] = el;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
