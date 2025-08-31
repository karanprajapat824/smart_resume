"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { ResumeFormProps } from "./ResumeForm";
import { Plus, Trash2 } from "lucide-react";

export default function Education({
  data,
  onChange,
  open = false,
}: ResumeFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    if (data.education.length === 0) addEducation();
    setTimeout(() => {
      educationRefs.current[0]?.focus();
    }, 0);
  }, [isOpen]);

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
        },
      ],
    });
  }

  function deleteEducation(id: string) {
    const remainingEducation = data.education.filter((edu) => edu.id !== id);
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
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [name]: value } : edu
      ),
    });
  }

  return (
    <div>
      <ResumeFormHeader
        heading="Education"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="border-b pt-4 pb-0">
        <div
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${
            !isOpen && "hidden"
          }`}
        >
          {data.education.map((edu, index) => (
            <div className="border p-4 w-[100%] rounded" key={edu.id}>
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
                <div className="grid grid-cols-2">
                  {/* Degree */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Degree</label>
                    <input
                      ref={(el) => {
                        educationRefs.current[index * 4 + 0] = el;
                      }}
                      className="border rounded py-1 px-4 w-60 text-sm"
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
                      className="border rounded py-1 px-4 w-60 text-sm"
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
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">
                    Institute Name
                  </label>
                  <input
                    ref={(el) => {
                      educationRefs.current[index * 4 + 2] = el;
                    }}
                    className="border rounded py-1 px-4 w-[93%] text-sm"
                    value={edu.institution}
                    placeholder="Indian Institute of Technology"
                    name="institution"
                    onChange={(e) => updateEducation(e, edu.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEducationRefs(index * 4 + 2)
                    }
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">Description</label>
                  <textarea
                    ref={(el) => {
                      educationRefs.current[index * 4 + 3] = el;
                    }}
                    className="border rounded resize-none py-2 px-4 h-20 text-sm"
                    value={edu.description}
                    placeholder="Relevant coursework, achievements..."
                    name="description"
                    onChange={(e) => updateEducation(e, edu.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full bg-primary hover:cursor-pointer text-primary-foreground flex items-center border h-10 justify-center rounded transition duration-500"
            onClick={addEducation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </button>
        </div>
      </div>
    </div>
  );
}
