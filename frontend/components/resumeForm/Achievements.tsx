"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, CirclePlus } from "lucide-react";
import { ResumeSectionProps } from "@/components/ResumeForm";
import { Button, Input, ToggleMode } from "@/components/Ui"
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
    }, false);
  }

  function deleteAchievement(id: string) {
    const remainingAchievements = resumeData.achievements.filter(
      (achievement) => achievement.id !== id
    );
    handleDataChange({ achievements: remainingAchievements }, true);
  }

  function updateAchievement(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string,
    commit: boolean
  ) {
    const { value, name } = e.target;
    handleDataChange({
      achievements: resumeData.achievements.map((achievement) =>
        achievement.id === id ? { ...achievement, [name]: value } : achievement
      ),
    }, commit);
  }

  function CurrentTab() {
    setCurrentTab(!currentTab);
  }

  function addBulletPoints(id: string, point: string) {
    const trimmed = point.trim();
    if (trimmed.length === 0) return;

    handleDataChange({
      achievements: resumeData.achievements.map((achievement) =>
        achievement.id === id
          ? { ...achievement, bulletPoints: [...achievement.bulletPoints, trimmed] }
          : achievement
      ),
    }, true);
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
    }, true);
  }

  function updateBulletPoints(id: string, index: number, point: string, commit: boolean) {
    handleDataChange({
      achievements: resumeData.achievements?.map((achievement) =>
        achievement.id === id ?
          {
            ...achievement,
            bulletPoints: achievement.bulletPoints?.map((p, i) => i === index ? point : p)
          } : achievement
      )
    }, commit)
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
                      onChange={(e) => updateAchievement(e, achievement.id, false)}
                      onBlur={(e) => updateAchievement(e, achievement.id, true)}
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
                      onChange={(e) => updateAchievement(e, achievement.id, false)}
                      onBlur={(e) => updateAchievement(e, achievement.id, true)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAchievementsRefs(index * 3 + 1)
                      }
                    />
                  </div>
                </div>
                <ToggleMode
                  add={addBulletPoints}
                  update={updateAchievement}
                  exp={achievement}
                  deletePoints={deleteBulletPoint}
                  updatePoints={updateBulletPoints}
                  placeHolder="Describe Your Achievements..."
                  ref={(el) => { achievementsRefs.current[index * 3 + 2] = el; }}
                />
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
