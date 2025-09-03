"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { ResumeFormProps } from "./ResumeForm";
import { Plus, Trash2 } from "lucide-react";

export default function Projects({
  data,
  onChange,
  openSections,
  setOpenSections,
}: ResumeFormProps) {
 

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
    if (nextInput) {
      nextInput.focus();
    } else {
    }
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
          bulletPoints: [],
          isBulltePoints: false,
        },
      ],
    });
  }

  function deleteProject(id: string) {
    const remainingProjects = data.projects.filter(
      (project) => project.id !== id
    );
    onChange({
      projects: remainingProjects,
    });
  }

  function updateProject(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) {
    const { value, name } = e.target;
    onChange({
      projects: data.projects.map((project) =>
        project.id === id ? { ...project, [name]: value } : project
      ),
    });
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
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${
            !openSections.project && "hidden"
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
                <div className="grid grid-cols-2">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">
                      Project Title
                    </label>
                    <input
                      ref={(el) => {
                        projectsRefs.current[index * 3 + 0] = el;
                      }}
                      className="border rounded py-1 px-4 w-60 text-sm"
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
                      ref={(el) => {
                        projectsRefs.current[index * 3 + 1] = el;
                      }}
                      className="border rounded py-1 px-4 w-60 text-sm"
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

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">Description</label>
                  <textarea
                    ref={(el) => {
                      projectsRefs.current[index * 3 + 2] = el;
                    }}
                    className="border rounded resize-none py-2 px-4 h-20 text-sm"
                    value={project.description}
                    placeholder="Describe your project..."
                    name="description"
                    onChange={(e) => updateProject(e, project.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full bg-primary hover:cursor-pointer text-primary-foreground flex items-center border h-10 justify-center rounded transition duration-500"
            onClick={addProject}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
