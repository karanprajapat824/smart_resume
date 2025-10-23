"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, CirclePlus } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import Button from "../ui/Button";
import ToggleMode from "../ui/ToggleMode";

export default function Projects({
  data,
  onChange,
  openSections,
  setOpenSections,
}: ResumeSectionProps) {

  const projectsRefs = useRef<
    Array<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null>
  >([]);

  useEffect(() => {
    setTimeout(() => {
      projectsRefs.current[0]?.focus();
    }, 0);
  }, [openSections.project]);

  function handleProjectRefs(index: number) {
    const nextInput = projectsRefs.current[index + 1];
    if (nextInput) nextInput.focus();
  }

  function addProject() {
    onChange({
      projects: [
        ...data.projects,
        {
          id: Date.now().toString(),
          title: "",
          link: "",
          description: "",
          bulletPoints: []
        },
      ],
    });
  }

  function deleteProject(id: string) {
    const remainingProjects = data.projects.filter((p) => p.id !== id);
    onChange({ projects: remainingProjects });
  }

  function updateProject(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) {
    const { value, name } = e.target;
    onChange({
      projects: data.projects.map((p) => (p.id === id ? { ...p, [name]: value } : p)),
    });
  }

  function addBulletPoints(id: string, point: string) {
    const trimmed = point.trim();
    if (!trimmed) return;

    onChange({
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, bulletPoints: [...p.bulletPoints, trimmed] } : p
      ),
    });
  }

  function deleteBulletPoint(id: string, index: number) {
    onChange({
      projects: data.projects.map((p) =>
        p.id === id
          ? { ...p, bulletPoints: p.bulletPoints.filter((_, i) => i !== index) }
          : p
      ),
    });
  }

  function updateBulletPoints(id: string, index: number, point: string) {
    onChange({
      projects: data.projects?.map((p) =>
        p.id === id ?
          {
            ...p,
            bulletPoints: p.bulletPoints?.map((p, i) => i === index ? point : p)
          } : p
      )
    })
  }

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
          {data.projects.map((project, index) => (
            <div className="border p-4 w-[100%] rounded" key={project.id}>
              <div className="flex flex-row items-center justify-between space-y-0 py-2">
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
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Project Title</label>
                    <input
                      ref={(el) => { (projectsRefs.current[index * 3 + 0] = el) }}
                      className="border rounded py-1 px-4 text-sm"
                      value={project.title}
                      placeholder="My Awesome Project"
                      name="title"
                      onChange={(e) => updateProject(e, project.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleProjectRefs(index * 3 + 0)
                      }
                    />
                  </div>

                  {/* Link */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Link</label>
                    <input
                      ref={(el) => { (projectsRefs.current[index * 3 + 1] = el) }}
                      className="border rounded py-1 px-4 text-sm"
                      value={project.link}
                      placeholder="https://github.com/username/project"
                      name="link"
                      onChange={(e) => updateProject(e, project.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleProjectRefs(index * 3 + 1)
                      }
                    />
                  </div>
                </div>

                <ToggleMode
                  add={addBulletPoints}
                  update={updateProject}
                  exp={project}
                  deletePoints={deleteBulletPoint}
                  updatePoints={updateBulletPoints}
                  placeHolder="Describe Your work experience..."
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
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>
    </div>
  );
}
