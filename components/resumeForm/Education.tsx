"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2 } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import Button from "../ui/Button";
import ToggleMode from "../ui/ToggleMode";

export default function Education({
  data,
  onChange,
  openSections,
  setOpenSections
}: ResumeSectionProps) {

  const educationRefs = useRef<
    Array<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null>
  >([]);

  function handleEducationRefs(index: number) {
    const nextInput = educationRefs.current[index + 1];
    if (nextInput) {
      nextInput.focus();
    } else {
    }
  }

  useEffect(() => {
    setTimeout(() => {
      educationRefs.current[0]?.focus();
    }, 0);
  }, [openSections.education]);

  function addEducation() {
    onChange({
      education: [
        ...data.education,
        {
          id: Date.now().toString(),
          degree: "",
          institution: "",
          year: "",
          description: "",
          grade: "",
          location: "",
        },
      ],
    });
  }

  function deleteEducation(id: string) {
    const remainingEducation = data?.education?.filter((edu) => edu?.id !== id);
    onChange({
      education: remainingEducation,
    });
  }

  function updateEducation(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) {
    const { value, name } = e.target;
    onChange({
      education: data?.education?.map((edu) =>
        edu?.id === id ? { ...edu, [name]: value } : edu
      ),
    });
  }


  return (
    <div>
      <ResumeFormHeader
        heading="Education"
        name="education"
        isOpen={openSections.education}
        setIsOpen={setOpenSections}
      />
      <div className="border-b pt-4 pb-0">
        <div
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${!openSections.education && "hidden"
            }`}
        >
          {data.education.map((edu, index) => (
            <div className="border w-full p-4 rounded" key={edu.id}>
              <div className="flex flex-row items-center justify-between space-y-0 py-2">
                <div className="text-lg font-semibold">Education Entry</div>
                <button
                  className="hover:cursor-pointer hover:text-red-600"
                  onClick={() => deleteEducation(edu.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 py-2">
                <div className="grid sm:grid-cols-2 grid-cols-1 space-y-4 space-x-4">
                  {/* Degree */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Degree</label>
                    <input
                      ref={(el) => {
                        educationRefs.current[index * 4 + 0] = el;
                      }}
                      className="border rounded py-1 px-4 text-sm"
                      value={edu.degree}
                      placeholder="Bachelor of Science"
                      name="degree"
                      onChange={(e) => updateEducation(e, edu.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEducationRefs(index * 4 + 0)
                      }
                    />
                  </div>

                  {/* Year */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Year</label>
                    <input
                      ref={(el) => {
                        educationRefs.current[index * 4 + 1] = el;
                      }}
                      className="border rounded py-1 px-4 text-sm"
                      value={edu.year}
                      placeholder="2025"
                      name="year"
                      onChange={(e) => updateEducation(e, edu.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEducationRefs(index * 4 + 1)
                      }
                    />
                  </div>
                </div>

                {/* Institute */}
                <div className="flex flex-col gap-2 pb-4">
                  <label className="font-semibold text-sm">
                    Institute Name
                  </label>
                  <input
                    ref={(el) => {
                      educationRefs.current[index * 4 + 2] = el;
                    }}
                    className="border rounded py-1 px-4 text-sm"
                    value={edu.institution}
                    placeholder="Indian Institute of Technology"
                    name="institution"
                    onChange={(e) => updateEducation(e, edu.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEducationRefs(index * 4 + 2)
                    }
                  />
                </div>

                <div className="grid sm:grid-cols-2 grid-cols-1 space-y-0 space-x-4">
                  {/* Grade or marks */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Grade or Marks</label>
                    <input
                      ref={(el) => {
                        educationRefs.current[index * 4 + 3] = el;
                      }}
                      className="border rounded py-1 px-4 text-sm"
                      value={edu.grade}
                      placeholder="8.00 CGPA or 80%"
                      name="grade"
                      onChange={(e) => updateEducation(e, edu.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEducationRefs(index * 4 + 3)
                      }
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Location (optinal)</label>
                    <input
                      ref={(el) => {
                        educationRefs.current[index * 4 + 4] = el;
                      }}
                      className="border rounded py-1 px-4 text-sm"
                      value={edu.location}
                      placeholder="Ujjain , M.P"
                      name="location"
                      onChange={(e) => updateEducation(e, edu.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleEducationRefs(index * 4 + 4)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="primary"
            className="w-full"
            size="sm"
            onClick={addEducation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </div>
    </div>
  );
}
