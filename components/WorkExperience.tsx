"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2 } from "lucide-react";
import { ResumeFormProps } from "./ResumeForm";

export default function WorkExperience({
  data,
  onChange,
  open = false,
}: ResumeFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const workExperienceRefs = useRef<
    Array<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null>
  >([]);

  function handleWorkExperienceRefs(index: number) {
    const nextInput = workExperienceRefs.current[index + 1];
    if (nextInput) {
      nextInput.focus();
    } else {
      
    }
  }

  function addWorkExperience() {
    onChange({
      workExperience: [
        ...data.workExperience,
        {
          id: Date.now().toString(),
          company: "",
          role: "",
          duration: "",
          description: "",
          bulletPoints: [],
          isBulltePoints: false,
        },
      ],
    });
  }

  function deleteWorkExperience(id: string) {
    const remaringWork = data.workExperience.filter((exp) => exp.id !== id);
    onChange({
      workExperience: remaringWork,
    });
  }

  function updateWorkExperience(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) {
    const { value, name } = e.target;
    onChange({
      workExperience: data.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [name]: value } : exp
      ),
    });
  }

  useEffect(() => {
    if (data.workExperience.length === 0) addWorkExperience();
    setTimeout(() => {
      workExperienceRefs.current[0]?.focus();
    }, 0);
  }, [isOpen]);

  return (
    <div>
      <ResumeFormHeader
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        heading="Work Experience"
      />
      <div className="border-b pt-4 pb-0">
        <div
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${
            !isOpen && "hidden"
          }`}
        >
          {data.workExperience.map((exp, index) => (
            <div className="border p-4 w-[100%] rounded" key={exp.id}>
              <div className="flex flex-row items-center justify-between space-y-0 py-2">
                <div className="text-lg font-semibold">Experience Entry</div>
                <button
                  className="hover:cursor-pointer hover:text-red-600"
                  onClick={() => deleteWorkExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2">
                  {/* Company */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Company</label>
                    <input
                      ref={(el) => {
                        workExperienceRefs.current[index * 4 + 0] = el;
                      }}
                      className="border rounded py-1 px-4 w-60 text-sm"
                      value={exp.company}
                      placeholder="Company Name"
                      onChange={(e) => updateWorkExperience(e, exp.id)}
                      name="company"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleWorkExperienceRefs(index * 4 + 0)
                      }
                    />
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Role</label>
                    <input
                      ref={(el) => {
                        workExperienceRefs.current[index * 4 + 1] = el;
                      }}
                      className="border rounded py-1 px-4 w-60 text-sm"
                      value={exp.role}
                      placeholder="Job Title"
                      name="role"
                      onChange={(e) => updateWorkExperience(e, exp.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleWorkExperienceRefs(index * 4 + 1)
                      }
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">Duration</label>
                  <input
                    ref={(el) => {
                      workExperienceRefs.current[index * 4 + 2] = el;
                    }}
                    className="border rounded py-1 px-4 w-[93%] text-sm"
                    value={exp.duration}
                    placeholder="Jan 2020 - Present"
                    name="duration"
                    onChange={(e) => updateWorkExperience(e, exp.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleWorkExperienceRefs(index * 4 + 2)
                    }
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">Description</label>
                  <textarea
                    ref={(el) => {
                      workExperienceRefs.current[index * 4 + 3] = el;
                    }}
                    className="border rounded resize-none py-2 px-4 h-20 text-sm"
                    value={exp.description}
                    placeholder="Describe your responsibilities and achievements..."
                    name="description"
                    onChange={(e) => updateWorkExperience(e, exp.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full bg-primary  hover:cursor-pointer text-primary-foreground flex items-center border h-10 justify-center rounded transition duration-500"
            onClick={addWorkExperience}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Work Experience
          </button>
        </div>
      </div>
    </div>
  );
}
