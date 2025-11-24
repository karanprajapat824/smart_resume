"use client";
import { useEffect, useRef } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2 } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import { Button, Input, ToggleMode } from "@/components/Ui";
import { useUtility } from "@/app/providers/UtilityProvider";

export default function Projects({
  openSections,
  setOpenSections,
}: ResumeSectionProps) {
  const { resumeData, handleDataChange } = useUtility();

  const projectsRefs = useRef<
    Array<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null>
  >([]);

  function handleProjectRefs(index: number) {
    const nextInput = projectsRefs.current[index + 1];
    if (nextInput) nextInput.focus();
  }

  function addProject() {
    handleDataChange(
      {
        projects: [
          ...resumeData.projects,
          {
            id: Date.now().toString(),
            title: "",
            link: "",
            description: "",
            bulletPoints: [],
            duration: ""
          },
        ],
      },
      false
    );
  }

  function deleteProject(id: string) {
    handleDataChange(
      {
        projects: resumeData.projects.filter((p) => p.id !== id),
      },
      true
    );
  }

  function updateProject(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string,
    commit: boolean
  ) {
    const { value, name } = e.target;

    handleDataChange(
      {
        projects: resumeData.projects.map((p) =>
          p.id === id ? { ...p, [name]: value } : p
        ),
      },
      commit
    );
  }

  function addBulletPoints(id: string, point: string) {
    const trimmed = point.trim();
    if (!trimmed) return;

    handleDataChange(
      {
        projects: resumeData.projects.map((p) =>
          p.id === id
            ? { ...p, bulletPoints: [...p.bulletPoints, trimmed] }
            : p
        ),
      },
      true
    );
  }

  function deleteBulletPoint(id: string, index: number) {
    handleDataChange(
      {
        projects: resumeData.projects.map((p) =>
          p.id === id
            ? {
              ...p,
              bulletPoints: p.bulletPoints.filter((_, i) => i !== index),
            }
            : p
        ),
      },
      true
    );
  }

  function updateBulletPoints(
    id: string,
    index: number,
    point: string,
    commit: boolean
  ) {
    handleDataChange(
      {
        projects: resumeData.projects.map((p) =>
          p.id === id
            ? {
              ...p,
              bulletPoints: p.bulletPoints.map((bp, i) =>
                i === index ? point : bp
              ),
            }
            : p
        ),
      },
      commit
    );
  }

  useEffect(() => {
    setTimeout(() => {
      projectsRefs.current[0]?.focus();
    }, 0);
  }, [openSections.project]);

  return (
    <div>
      <ResumeFormHeader
        heading="Projects"
        isOpen={openSections.project}
        setIsOpen={setOpenSections}
        name="project"
      />

      <div className="border-b pt-4 pb-0">
        <div
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${!openSections.project && "hidden"
            }`}
        >
          {resumeData.projects.map((project, index) => (
            <div className="border p-4 w-[100%] rounded" key={project.id}>
              <div className="flex flex-row items-center justify-between py-2">
                <div className="text-lg font-semibold">Project Entry</div>
                <button
                  className="hover:cursor-pointer hover:text-red-600"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 py-2">
                <div className="grid sm:grid-cols-2 grid-cols-1 space-y-4 space-x-4">
                  <Input
                    label="Project Title"
                    name="title"
                    id="title"
                    value={project.title}
                    placeholder="My Awesome Project"
                    index={index * 4 + 0}
                    ref={(el) => { projectsRefs.current[index * 4 + 0] = el }}
                    onChange={(e) => updateProject(e, project.id, false)}
                    onBlur={(e) => updateProject(e, project.id, true)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleProjectRefs(index * 4 + 0)
                    }
                  />

                  <Input
                    label="Link"
                    name="link"
                    id="link"
                    value={project.link}
                    placeholder="https://github.com/username/project"
                    index={index * 4 + 1}
                    ref={(el) => { projectsRefs.current[index * 4 + 1] = el }}
                    onChange={(e) => updateProject(e, project.id, false)}
                    onBlur={(e) => updateProject(e, project.id, true)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleProjectRefs(index * 4 + 1)
                    }
                  />
                </div>
                
                <Input
                  label="Duration"
                  name="duration"
                  id={`duration-${project.id}`}
                  value={project.duration}
                  placeholder="Jan 2020 - Present"
                  index={index * 4 + 2}
                  ref={(el) => {
                    projectsRefs.current[index * 4 + 2] = el;
                  }}
                  onChange={(e) => updateProject(e, project.id, false)}
                  onBlur={(e) =>
                    updateProject(
                      e,
                      project.id,
                      true
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleProjectRefs(index * 4 + 2)
                  }
                />

                <ToggleMode
                  add={addBulletPoints}
                  update={updateProject}
                  exp={project}
                  deletePoints={deleteBulletPoint}
                  updatePoints={updateBulletPoints}
                  placeHolder="Describe your project..."
                  ref={(el) => {
                    projectsRefs.current[index * 4 + 3] = el;
                  }}
                />
              </div>
            </div>
          ))}

          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={addProject}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Project
          </Button>
        </div>
      </div>
    </div>
  );
}
