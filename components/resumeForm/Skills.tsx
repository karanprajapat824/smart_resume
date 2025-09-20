"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2 } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";

export default function Skills({
  data,
  onChange,
  openSections,
  setOpenSections,
}: ResumeSectionProps) {
  
  const skillRef = useRef<HTMLInputElement>(null);
  const [skill, setSkill] = useState<string>("");
  const [skillError, setSkillError] = useState<string>("");

  useEffect(() => {
    skillRef.current?.focus();
  }, [openSections.skill]);

  function handleSkillRef() {}

  function addSkill() {
    const trimmed = skill.trim();
    if (trimmed.length === 0) {
      setSkillError("length");
    } else if (
      data.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setSkillError("exist");
      setSkill("");
    } else {
      setSkillError("");
      onChange({
        skills: [
          ...data.skills,
          {
            id: Date.now().toString(),
            name: trimmed,
            level : "",
            key : "",
            value : ""
          },
        ],
      });
      setSkill("");
    }
  }

  function deleteSkill(id: string) {
    const remaringSkill = data.skills.filter((skill) => skill.id !== id);
    onChange({
      skills: remaringSkill,
    });
  }
  return (
    <div>
      <ResumeFormHeader
        isOpen={openSections.skill}
        setIsOpen={setOpenSections}
        heading="Skills"
        name="skill"
      />
      <div className="border-b pt-4 pb-0">
        <div
          className={`flex flex-col items-center justify-center gap-4 ${
            !openSections.skill && "hidden"
          }`}
        >
          <div className="w-full flex flex-col gap-y-2">
            {/* Input box to add new skills */}
            <div
              className={`flex justify-between px-2 border w-full py-2 rounded ${
                (skillError === "length" || skillError === "exist") &&
                "border-red-500"
              }`}
            >
              <input
                ref={skillRef}
                placeholder={
                  skillError === "length"
                    ? "Please enter a skill..."
                    : skillError === "exist"
                    ? "Skill is already mentioned"
                    : "JavaScript"
                }
                className={`rounded px-2 w-full focus:outline-none text-sm ${
                  (skillError === "length" || skillError === "exist") &&
                  "text-red-600"
                }`}
                onChange={(e) => {
                  setSkill(e.target.value);
                  setSkillError("");
                }}
                value={skill}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addSkill();
                  }
                }}
              />
              <button
                className="px-4 py-1 ml-2 bg-primary flex justify-center items-center gap-2 text-primary-foreground rounded hover:cursor-pointer transition duration-500"
                onClick={addSkill}
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {/* Skills list */}
            <div className="flex gap-3 flex-wrap py-4">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="border rounded-full px-4 py-1 flex items-center justify-center text-sm"
                >
                  {skill.name}
                  <button
                    onClick={() => deleteSkill(skill.id)}
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
    </div>
  );
}
