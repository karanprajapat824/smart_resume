"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, CirclePlus } from "lucide-react";
import { ResumeSectionProps } from "@/components/ResumeForm";
import { Button, Input } from "@/components/Ui"
import { useUtility } from "@/app/providers/UtilityProvider";

export default function Achievements({
  openSections,
  setOpenSections
}: ResumeSectionProps) {
  const { resumeData, handleDataChange } = useUtility();
  const [bullet, setBullet] = useState<string>("");
  const [currentTab, setCurrentTab] = useState(false);
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
    if (nextInput) nextInput.focus();
  }

  function addAchievement() {
    handleDataChange({
      achievements: [
        ...resumeData.achievements,
        {
          id: Date.now().toString(),
          title: "",
          year: "",
          description: "",
          bulletPoints: [],
          isBulletPoints: false
        },
      ],
    });
  }

  function deleteAchievement(id: string) {
    const remainingAchievements = resumeData.achievements.filter(
      (achievement) => achievement.id !== id
    );
    handleDataChange({ achievements: remainingAchievements });
  }

  function updateAchievement(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string
  ) {
    const { value, name } = e.target;
    handleDataChange({
      achievements: resumeData.achievements.map((achievement) =>
        achievement.id === id ? { ...achievement, [name]: value } : achievement
      ),
    });
  }

  function CurrentTab() {
    setCurrentTab(!currentTab);
  }

  function addBulletPoints(id: string) {
    const trimmed = bullet.trim();
    if (trimmed.length === 0) return;

    handleDataChange({
      achievements: resumeData.achievements.map((achievement) =>
        achievement.id === id
          ? { ...achievement, bulletPoints: [...achievement.bulletPoints, trimmed] }
          : achievement
      ),
    });

    setBullet("");
  }

  function deleteBulletPoint(id: string, index: number) {
    handleDataChange({
      achievements: resumeData.achievements.map((achievement) =>
        achievement.id === id
          ? {
            ...achievement,
            bulletPoints: achievement.bulletPoints.filter((_, i) => i !== index),
          }
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
          className={`space-y-4 flex flex-col items-center justify-center mb-4 ${!openSections.achievement && "hidden"
            }`}
        >
          {resumeData.achievements.map((achievement, index) => (
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
                <div className="grid sm:grid-cols-2 grid-cols-1 space-y-4 space-x-4">
                  {/* Title */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Title</label>
                    <Input
                      ref={(el) => { (achievementsRefs.current[index * 3 + 0] = el) }}
                      id=""
                      value={achievement.title}
                      placeholder="AWS Certified Developer"
                      name="title"
                      onChange={(e) => updateAchievement(e, achievement.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAchievementsRefs(index * 3 + 0)
                      }
                    />
                  </div>

                  {/* Year */}
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Year</label>
                    <Input
                      id=""
                      ref={(el) => { (achievementsRefs.current[index * 3 + 1] = el) }}

                      value={achievement.year}
                      placeholder="2023"
                      name="year"
                      onChange={(e) => updateAchievement(e, achievement.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAchievementsRefs(index * 3 + 1)
                      }
                    />
                  </div>
                </div>

                {/* Description / Bullet Points */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm flex flex-row gap-2 mb-2 items-center">
                    <button
                      onClick={() => CurrentTab()}
                      className={`px-4 py-2 rounded-lg transition-all ${currentTab
                        ? "border-b-2 border-blue-500 text-blue-600 bg-gray-100"
                        : "border-b-2 border-transparent"
                        } bg-gray-100 cursor-pointer`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => CurrentTab()}
                      className={`px-4 py-2 rounded-lg transition-all flex flex-row items-center gap-1 ${!currentTab
                        ? "border-b-2 bg-gray-100 border-blue-500 text-blue-600"
                        : "border-b-2 border-transparent"
                        } bg-gray-100 cursor-pointer`}
                    >
                      <CirclePlus className="h-4" />
                      Add Bullet Points
                    </button>
                  </label>

                  {!currentTab ? (
                    <div className="border rounded py-2 flex flex-row justify-between px-2 gap-5">
                      <Input
                        value={bullet}
                        onChange={(e) => setBullet(e.target.value)}
                        id=""
                        placeholder="Add bullet points"
                        onKeyDown={(e) => e.key === "Enter" && addBulletPoints(achievement.id)}
                      />
                      <button
                        onClick={() => addBulletPoints(achievement.id)}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded hover:cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <textarea
                      ref={(el) => { (achievementsRefs.current[index * 3 + 2] = el) }}
                      className="border rounded resize-none py-2 px-4 h-20 text-sm"
                      value={achievement.description}
                      placeholder="Details about the certification or achievement..."
                      name="description"
                      onChange={(e) => updateAchievement(e, achievement.id)}
                    />
                  )}

                  <div className="flex gap-3 flex-wrap">
                    {achievement.bulletPoints.length > 0 && !currentTab &&
                      achievement.bulletPoints.map((point, idx) => (
                        <div
                          key={idx}
                          className="border rounded px-4 py-1 flex items-center justify-center text-sm"
                        >
                          {point}
                          <button
                            onClick={() => deleteBulletPoint(achievement.id, idx)}
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
            onClick={addAchievement}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      </div>
    </div>
  );
}
