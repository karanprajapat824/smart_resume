"use client";
import React, { useRef, useState, useEffect } from "react";
import type { ResumeData } from "@/exports/utility";
import PersonalDetails from "./resumeForm/PersonalDetails";
import Summary from "./resumeForm/Summary";
import WorkExperience from "./resumeForm/WorkExperience";
import Education from "./resumeForm/Education";
import Skills from "./resumeForm/Skills";
import Projects from "./resumeForm/Projects";
import Achievements from "./resumeForm/Achievements";
import Languages from "./resumeForm/Languages";

export interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
}

export interface ResumeSectionProps extends ResumeFormProps {
  openSections: {
    personalDetail: boolean;
    summary: boolean;
    work: boolean;
    education: boolean;
    skill: boolean;
    project: boolean;
    achievement: boolean;
    language: boolean;
  };
  setOpenSections: (name: keyof ResumeSectionProps["openSections"]) => void;
}

export function ResumeForm({ data, onChange}: ResumeFormProps) {
  const [openSections, setOpenSections] = useState({
    personalDetail: true,
    summary: false,
    work: false,
    education: false,
    skill: false,
    project: false,
    achievement: false,
    language : false
  });

  const handleOpenSection = (name: keyof typeof openSections) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[name];
      return {
        personalDetail: false,
        summary: false,
        work: false,
        education: false,
        skill: false,
        project: false,
        achievement: false,
        language : false,
        [name]: !isCurrentlyOpen,
      };
    });
  };

  const dragIndexRef = useRef<number | null>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const componentsMap: Record<string, React.ComponentType<any>> = {
    PersonalDetails,
    Summary,
    WorkExperience,
    Education,
    Skills,
    Projects,
    Achievements,
    Languages
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

    const next = data.order;
    const [moved] = next.splice(fromIndex,1);
    next.splice(toIndex,0,moved);
    
    onChange({
      order : next
    });

    dragIndexRef.current = null;
    hoverIndexRef.current = null;
    setDraggingIndex(null);
  }

  function handleContainerDragOver(e: React.DragEvent) {
    e.preventDefault();
    hoverIndexRef.current = data.order.length;
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
      {data.order?.map((key, index) => {
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
