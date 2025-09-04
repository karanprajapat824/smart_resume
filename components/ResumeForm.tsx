"use client";
import React, { useRef, useState, useEffect } from "react";
import type { ResumeData } from "@/app/create-resume/page";
import PersonalDetails from "./PersonalDetails";
import Summery from "./Summery";
import WorkExperience from "./WorkExperience";
import Education from "./Education";
import Skills from "./Skills";
import Projects from "./Projects";
import Achievements from "./Achievements";

export interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
  openSections?: any;
  setOpenSections?: any;
  currentOrder : string[];
  setCurrentOrder : React.Dispatch<React.SetStateAction<string[]>>;
}

export function ResumeForm({ data, onChange , currentOrder , setCurrentOrder }: ResumeFormProps) {
  const [openSections, setOpenSections] = useState({
    personalDetail: true,
    summery: false,
    work: false,
    education: false,
    skill: false,
    project: false,
    achievement: false,
  });

  const handleOpenSection = (name: keyof typeof openSections) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[name];
      return {
        personalDetail: false,
        summery: false,
        work: false,
        education: false,
        skill: false,
        project: false,
        achievement: false,
        [name]: !isCurrentlyOpen,
      };
    });
  };

  

  useEffect(() => {
    try {
      const raw = localStorage.getItem("resume_sections_order");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validKeys = [
            "PersonalDetails",
            "Summery",
            "WorkExperience",
            "Education",
            "Skills",
            "Projects",
            "Achievements",
          ];

          const filtered = parsed.filter(
            (k: unknown) =>
              typeof k === "string" && validKeys.includes(k as string)
          );
          const missing = validKeys.filter((k) => !filtered.includes(k));
          setCurrentOrder([...filtered, ...missing]);
        }
      }
    } catch (err) {
      console.warn("Failed to load saved resume order:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "resume_sections_order",
        JSON.stringify(currentOrder)
      );
    } catch (err) {
      console.warn("Failed to save resume order:", err);
    }
  }, [currentOrder]);

  const dragIndexRef = useRef<number | null>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const componentsMap: Record<string, React.ComponentType<any>> = {
    PersonalDetails,
    Summery,
    WorkExperience,
    Education,
    Skills,
    Projects,
    Achievements,
  };

  function handleDragStart(e: React.DragEvent, index: number) {
    dragIndexRef.current = index;
    setDraggingIndex(index);
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (hoverIndexRef.current !== index) {
      hoverIndexRef.current = index;
    }
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const fromIndexRaw =
      dragIndexRef.current ??
      parseInt(e.dataTransfer.getData("text/plain"), 10);
    const fromIndex = typeof fromIndexRaw === "number" ? fromIndexRaw : null;
    if (fromIndex === null || fromIndex === undefined) {
      dragIndexRef.current = null;
      hoverIndexRef.current = null;
      setDraggingIndex(null);
      return;
    }

    const toIndex = dropIndex;
    if (fromIndex === toIndex) {
      dragIndexRef.current = null;
      hoverIndexRef.current = null;
      setDraggingIndex(null);
      return;
    }

    setCurrentOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });

    dragIndexRef.current = null;
    hoverIndexRef.current = null;
    setDraggingIndex(null);
  }

  function handleContainerDragOver(e: React.DragEvent) {
    e.preventDefault();
    hoverIndexRef.current = currentOrder.length;
  }

  function handleDragEnd() {
    dragIndexRef.current = null;
    hoverIndexRef.current = null;
    setDraggingIndex(null);
  }

  return (
    <div
      onDragOver={handleContainerDragOver}
      className="w-full"
      aria-label="Resume sections draggable list"
    >
      {currentOrder.map((key, index) => {
        const Section = componentsMap[key];
        const isDragging = draggingIndex === index;

        return (
          <div
            key={key}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex flex-col gap-3 items-stretch cursor-grap`}
            role="group"
          >
            <div className="w-full cursor-grap">
              <Section
                data={data}
                onChange={onChange}
                openSections={openSections}
                setOpenSections={handleOpenSection}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResumeForm;
