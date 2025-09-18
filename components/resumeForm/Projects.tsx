"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, CirclePlus } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";

export default function Projects({
  data,
  onChange,
  openSections,
  setOpenSections,
}: ResumeSectionProps) {
  const [bullet, setBullet] = useState<string>("");

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
          bulletPoints: [],
          isBulletPoints: false,
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

  function updateIsBulletPoints(id: string, set: boolean) {
    onChange({
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, isBulletPoints: set } : p
      ),
    });
  }

  function addBulletPoints(id: string) {
    const trimmed = bullet.trim();
    if (!trimmed) return;

    onChange({
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, bulletPoints: [...p.bulletPoints, trimmed] } : p
      ),
    });
    setBullet("");
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
                    <label className="font-semibold text-sm">Project Title</label>
                    <input
                      ref={(el) => {(projectsRefs.current[index * 3 + 0] = el)}}
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
                      ref={(el) => {(projectsRefs.current[index * 3 + 1] = el)}}
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

                {/* Description / Bullet Points */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm flex flex-row gap-2 mb-2 items-center">
                    <button
                      onClick={() => updateIsBulletPoints(project.id, false)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        !project.isBulletPoints
                          ? "border-b-2 border-blue-500 text-blue-600 bg-gray-100"
                          : "border-b-2 border-transparent"
                      } ${project.bulletPoints.length > 0 ? "opacity-50 cursor-not-allowed" : "bg-gray-100 cursor-pointer"}`}
                      disabled={project.bulletPoints.length > 0}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => updateIsBulletPoints(project.id, true)}
                      className={`px-4 py-2 rounded-lg transition-all flex flex-row items-center gap-1 ${
                        project.isBulletPoints
                          ? "border-b-2 bg-gray-100 border-blue-500 text-blue-600"
                          : "border-b-2 border-transparent"
                      } ${project.description.length > 0 ? "opacity-50 cursor-not-allowed" : "bg-gray-100 cursor-pointer"}`}
                      disabled={project.description.length > 0}
                    >
                      <CirclePlus className="h-4" />
                      Add Bullet Points
                    </button>
                  </label>

                  {project.isBulletPoints ? (
                    <div className="border rounded py-2 flex flex-row justify-between px-2 gap-5">
                      <input
                        value={bullet}
                        onChange={(e) => setBullet(e.target.value)}
                        className="text-sm px-2 w-full focus:outline-none"
                        placeholder="Add bullet points"
                        onKeyDown={(e)=>e.key === "Enter" && addBulletPoints(project.id)}
                      />
                      <button
                        onClick={() => addBulletPoints(project.id)}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded hover:cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <textarea
                      ref={(el) => {(projectsRefs.current[index * 3 + 2] = el)}}
                      className="border rounded resize-none py-2 px-4 h-20 text-sm"
                      value={project.description}
                      placeholder="Describe your project..."
                      name="description"
                      onChange={(e) => updateProject(e, project.id)}
                    />
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {project.isBulletPoints &&
                      project.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="border rounded px-4 py-1 flex items-center justify-center text-sm"
                        >
                          {point}
                          <button
                            onClick={() => deleteBulletPoint(project.id, idx)}
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
