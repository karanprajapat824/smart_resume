"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2 } from "lucide-react";
import { ResumeFormProps } from "./ResumeForm";
export default function Achievements({
  data,
  onChange,
  openSections,
  setOpenSections
}: ResumeFormProps) {

  const achievementsRefs = useRef<
    Array<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null>
  >([]);

  useEffect(() => {
    setTimeout(() => {
      achievementsRefs.current[0]?.focus();
    }, 0);
  }, [openSections.achievement]);

  function handleAchievementsRefs(index: number) {
    const nextInput = achievementsRefs.current[index + 1];
    if (nextInput) {
      nextInput.focus();
    }
  }

  function addAchievement() {
    onChange({
      achievements: [
        ...data.achievements,
        {
          id: Date.now().toString(),
          title: "",
          year: "",
          description: "",
          bulletPoints: [],
          isBulltePoints: false,
        },
      ],
    });
  }

  function deleteAchievement(id: string) {
    const remainingAchievements = data.achievements.filter(
      (achievement) => achievement.id !== id
    );
    onChange({
      achievements: remainingAchievements,
    });
  }

  function updateAchievement(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) {
    const { value, name } = e.target;
    onChange({
      achievements: data.achievements.map((achievement) =>
        achievement.id === id
          ? { ...achievement, [name]: value }
          : achievement
      ),
    });
  }

  return (
    <div>
      <ResumeFormHeader
        heading="Achievements / Certificates"
        name="achievement"
        isOpen={openSections.achievement}
        setIsOpen={setOpenSections}
      />
      <div className="border-b pt-4 pb-0">
        <div
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${
            !openSections.achievement && "hidden"
          }`}
        >
          {data.achievements.map((achievement, index) => (
            <div className="border p-4 w-[100%] rounded" key={achievement.id}>
              <div className="flex flex-row items-center justify-between space-y-0 py-2">
                <div className="text-lg font-semibold">Achievement Entry</div>
                <button
                  className="hover:cursor-pointer hover:text-red-600"
                  onClick={() => deleteAchievement(achievement.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Title</label>
                    <input
                      ref={(el) => {
                        achievementsRefs.current[index * 3 + 0] = el;
                      }}
                      className="border rounded py-1 px-4 w-60 text-sm"
                      value={achievement.title}
                      placeholder="AWS Certified Developer"
                      name="title"
                      onChange={(e) => updateAchievement(e, achievement.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleAchievementsRefs(index * 3 + 0)
                      }
                    />
                  </div>

                  {/* Year */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Year</label>
                    <input
                      ref={(el) => {
                        achievementsRefs.current[index * 3 + 1] = el;
                      }}
                      className="border rounded py-1 px-4 w-32 text-sm"
                      value={achievement.year}
                      placeholder="2023"
                      name="year"
                      onChange={(e) => updateAchievement(e, achievement.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleAchievementsRefs(index * 3 + 1)
                      }
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">Description</label>
                  <textarea
                    ref={(el) => {
                      achievementsRefs.current[index * 3 + 2] = el;
                    }}
                    className="border rounded resize-none py-2 px-4 h-20 text-sm"
                    value={achievement.description}
                    placeholder="Details about the certification or achievement..."
                    name="description"
                    onChange={(e) => updateAchievement(e, achievement.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            className="w-full bg-primary hover:cursor-pointer text-primary-foreground flex items-center border h-10 justify-center rounded transition duration-500"
            onClick={addAchievement}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
}
