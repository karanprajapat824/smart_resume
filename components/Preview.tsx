"use client";
import { ResumeData } from "@/app/create-resume/page";
import SimpleResume from "@/templates/SimpleResume";
import T1 from "@/templates/T1";
import { useRef, useState } from "react";


interface PreviewType {
    data: ResumeData;
    template?: string;
}

const makeTemplateMap = () => {
    const map: Record<string, React.ElementType> = {
        SimpleResume,
        T1,
    };
    return map;
};

export default function SmallPreview({ data, template = "SmartResume" }: PreviewType) {
    const resumeRef = useRef<HTMLDivElement>(null);
    const order = [
        "PersonalDetails",
        "Summary",
        "WorkExperience",
        "Education",
        "Skills",
        "Projects",
        "Achievements",
        "Languages"
    ]

    const rawMap = makeTemplateMap();
    const SelectedTemplate = rawMap[template] || SimpleResume

    if (!SelectedTemplate) {
        const available = Object.keys(rawMap).join(", ");
        return (
            <div className="p-4 border rounded bg-yellow-50 text-yellow-900">
                <strong>Template not found:</strong> <span>{String(template)}</span>
                <div className="mt-2 text-sm text-neutral-700">
                    Available templates: {available}
                </div>
                <div className="mt-3">
                    Use one of the available template keys or check casing/spelling.
                </div>
            </div>
        );
    }

    return (
            <div className="small-page">
                <SelectedTemplate
                    data={data}
                    ref={resumeRef}
                    order={order}
                />
            </div>
    );
}
