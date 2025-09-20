"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, CirclePlus } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import Button from "../ui/Button";

export default function WorkExperience({
  data,
  onChange,
  openSections,
  setOpenSections
}: ResumeSectionProps) {

  const [bullet, setBullet] = useState<string>("");

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
          isBulletPoints: false,
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

  function updateIsBulletPoints(id: string, set: boolean) {
    onChange({
      workExperience: data.workExperience.map((exp) => exp.id === id ? { ...exp, isBulletPoints: set } : exp)
    })
  }

  function addBulletPoints(id: string) {
    const trimmed = bullet.trim();
    if (trimmed.length == 0) return;

    onChange({
      workExperience: data.workExperience?.map((work) =>
        work.id === id
          ? { ...work, bulletPoints: [...work.bulletPoints, trimmed] }
          : work
      ),
    });
    setBullet("");
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
                <div className="grid sm:grid-cols-2 grid-cols-1 space-y-3">
                  {/* Company */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Company</label>
                    <input
                      ref={(el) => {
                        workExperienceRefs.current[index * 4 + 0] = el;
                      }}
                      className="border rounded py-1 px-4 text-sm"
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
                      className="border rounded py-1 px-4 text-sm"
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
                    className="border rounded py-1 px-4 text-sm"
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
                  <label className="font-semibold text-sm flex flex-row gap-2 mb-2 items-center">
                    <button
                      onClick={() => updateIsBulletPoints(exp.id, false)}
                      className={`px-3 py-2 rounded-lg transition-all 
                      ${!exp.isBulletPoints ? "border-b-2 border-blue-500 text-blue-600 bg-gray-100" : "border-b-2 border-transparent"} 
                      ${(exp.bulletPoints.length > 0) ? "opacity-50 cursor-not-allowed" : "bg-gray-100 cursor-pointer"}`}
                      disabled={exp.bulletPoints.length > 0}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => updateIsBulletPoints(exp.id, true)}
                      className={`px-3 py-2 rounded-lg transition-all flex flex-row items-center gap-1
                      ${exp.isBulletPoints ? "border-b-2 bg-gray-100 border-blue-500 text-blue-600" : "border-b-2 border-transparent"}
                      ${exp.description.length > 0 ? "opacity-50 cursor-not-allowed" : "bg-gray-100 cursor-pointer"}
                      `}
                      disabled={exp.description.length > 0}
                    >
                      <CirclePlus className="h-4" />
                      Add Bullet Points
                    </button>
                  </label>
                  {
                    exp.isBulletPoints ?
                      <div className="border rounded py-2 flex flex-row justify-between px-2 gap-5">
                        <input
                          value={bullet}
                          onChange={(e) => setBullet(e.target.value)}
                          className="text-sm px-2 w-full focus:outline-none"
                          placeholder="Add bullet points"
                          onKeyDown={(e)=>e.key === "Enter" && addBulletPoints(exp.id)}
                          ></input>
                          
                        <button
                          onClick={() => addBulletPoints(exp.id)}
                          className="bg-primary text-primary-foreground px-3 py-1 rounded hover:cursor-pointer"
                        >Add</button>
                      </div> : <textarea
                        ref={(el) => {
                          workExperienceRefs.current[index * 4 + 3] = el;
                        }}
                        className="border rounded w-full resize-none py-2 px-4 h-20 text-sm"
                        value={exp.description}
                        placeholder="Describe your work experience...."
                        name="description"
                        onChange={(e) => updateWorkExperience(e, exp.id)}
                      />
                  }

                  <div className="flex gap-3 flex-wrap">
                    {
                      exp.isBulletPoints &&
                      exp.bulletPoints?.map((point, index) => (
                        <div
                          key={index}
                          className="border rounded px-4 py-1 flex items-center justify-center text-sm"
                        >
                          {point}
                          <button
                            onClick={() => deleteBulletPoint(exp.id,index)}
                            className="ml-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
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
