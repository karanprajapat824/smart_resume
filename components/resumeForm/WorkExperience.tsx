"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, CirclePlus } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ToggleMode from "../ui/ToggleMode";


export default function WorkExperience({
  data,
  onChange,
  openSections,
  setOpenSections
}: ResumeSectionProps) {

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
    setTimeout(() => {
      workExperienceRefs.current[0]?.focus();
    }, 0);
  }, [openSections.work]);

  function addBulletPoints(id: string, point: string) {
    const trimmed = point.trim();
    if (trimmed.length == 0) return;

    onChange({
      workExperience: data.workExperience?.map((work) =>
        work.id === id
          ? { ...work, bulletPoints: [...work.bulletPoints, trimmed] }
          : work
      ),
    });
  }

  function deleteBulletPoint(id: string, index: number) {
    onChange({
      workExperience: data.workExperience?.map((work) =>
        work.id === id
          ? {
            ...work,
            bulletPoints: work.bulletPoints?.filter((_, i) => i !== index),
          }
          : work
      ),
    });
  }

  function updateBulletPoints(id: string, index: number, point: string) {
    onChange({
      workExperience: data.workExperience?.map((work) =>
        work.id === id ?
          {
            ...work,
            bulletPoints: work.bulletPoints?.map((p, i) => i === index ? point : p)
          } : work
      )
    })
  }


  return (
    <div>
      <ResumeFormHeader
        isOpen={openSections.work}
        setIsOpen={setOpenSections}
        name="work"
        heading="Work Experience"
      />
      <div className="border-b pt-4 pb-0">
        <div
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${!openSections.work && "hidden"
            }`}
        >
          {data.workExperience?.map((exp, index) => (
            <div className="border w-[100%] p-4 rounded" key={exp.id}>
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
                <div className="grid sm:grid-cols-2 grid-cols-1 space-y-4 space-x-4">
                  <Input
                    label="Company"
                    id={`company-${exp.id}`}
                    name="company"
                    value={exp.company}
                    placeholder="Company Name"
                    index={index * 4 + 0}
                    ref={(el) => {
                      workExperienceRefs.current[index * 4 + 0] = el;
                    }}
                    onChange={(e) =>
                      updateWorkExperience(
                        e,
                        exp.id
                      )
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleWorkExperienceRefs(index * 4 + 0)
                    }
                  />
                  <Input
                    label="Role"
                    name="role"
                    id={`role-${exp.id}`}
                    value={exp.role}
                    placeholder="Job Title"
                    index={index * 4 + 1}
                    ref={(el) => {
                      workExperienceRefs.current[index * 4 + 1] = el;
                    }}
                    onChange={(e) =>
                      updateWorkExperience(
                        e,
                        exp.id
                      )
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleWorkExperienceRefs(index * 4 + 1)
                    }
                  />
                </div>

                <Input
                  label="Duration"
                  name="duration"
                  id={`duration-${exp.id}`}
                  value={exp.duration}
                  placeholder="Jan 2020 - Present"
                  index={index * 4 + 2}
                  ref={(el) => {
                    workExperienceRefs.current[index * 4 + 2] = el;
                  }}
                  onChange={(e) =>
                      updateWorkExperience(
                        e,
                        exp.id
                      )
                    }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleWorkExperienceRefs(index * 4 + 2)
                  }
                />

                <ToggleMode
                  add={addBulletPoints}
                  update={updateWorkExperience}
                  exp={exp}
                  deletePoints={deleteBulletPoint}
                  updatePoints={updateBulletPoints}
                  placeHolder="Describe Your work experience..."
                  ref={(el) => { workExperienceRefs.current[index * 4 + 3] = el;}}
                />
              </div>
            </div>
          ))}

          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={addWorkExperience}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Work Experience
          </Button>
        </div>
      </div>
    </div>
  );
}
