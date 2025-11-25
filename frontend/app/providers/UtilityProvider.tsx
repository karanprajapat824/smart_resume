"use client";
import { createContext, useState, useEffect, useContext, useCallback } from "react";

function useUndoRedo<T>(initial: T, maxHistory = 30) {
    const [state, setState] = useState<T>(initial);
    const [undoStack, setUndoStack] = useState<T[]>([]);
    const [redoStack, setRedoStack] = useState<T[]>([]);
    const [pendingChange, setPendingChange] = useState<boolean>(false);

    const updateState = useCallback(
        (newState: T, commit = false) => {
            if (commit) {
                setUndoStack(stack => {
                    const updated = [...stack, structuredClone(state)];
                    return updated.length > maxHistory
                        ? updated.slice(updated.length - maxHistory)
                        : updated;
                });
                setRedoStack([]);
                setPendingChange(false);
            } else {
                setPendingChange(true);
            }

            setState(structuredClone(newState));
        },
        [state, maxHistory]
    );

    const undo = useCallback(() => {
        if (undoStack.length === 0) return;
        const prev = undoStack[undoStack.length - 1];

        setRedoStack(r => [...r, structuredClone(state)]);
        setUndoStack(u => u.slice(0, -1));
        setState(prev);
    }, [undoStack, state]);

    const redo = useCallback(() => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];

        setUndoStack(u => [...u, structuredClone(state)]);
        setRedoStack(r => r.slice(0, -1));
        setState(next);
    }, [redoStack, state]);

    return {
        state,
        updateState,
        undo,
        redo,
        pendingChange
    };
}


export const defaultResumeData: ResumeData = {
    resume_id: null,
    template: "SimpleResume",
    order: [
        "PersonalDetails",
        "Summary",
        "WorkExperience",
        "Education",
        "Skills",
        "Projects",
        "Achievements",
        "Languages"
    ],
    personalDetails: {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        location: "",
        country: ""
    },
    summary: "",
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    languages: []
};

interface UtilityContextType {
    API_URL: string,
    templateNames: string[]
    width: number;
    resumeData: ResumeData,
    handleDataChange: (newData: Partial<ResumeData>, commit: boolean) => void;
    autoFill: (d: any) => void;
    clearForm: () => void;
    isDirty: boolean,
    undo: () => void;
    redo: () => void;
}

const UtilityContext = createContext<UtilityContextType>({
    API_URL: "http://localhost:5000",
    templateNames: ["SampleResume", "T1"],
    width: 0,
    resumeData: defaultResumeData,
    handleDataChange: () => { },
    autoFill: (d: any) => { },
    clearForm: () => { },
    isDirty: false,
    undo: () => { },
    redo: () => { },
});

export interface ResumeData {
    resume_id: string | null;
    template: string | null;
    order: Array<string>;
    personalDetails: {
        name: string;
        email: string;
        phone: string;
        linkedin: string;
        github: string;
        location: string;
        country: string;
    };
    summary: string;
    workExperience: Array<{
        id: string;
        company: string;
        role: string;
        duration: string;
        description: string;
        bulletPoints: Array<string>;
    }>;
    education: Array<{
        id: string;
        degree: string;
        institution: string;
        year: string;
        description: string;
        grade: string;
        location: string;
    }>;
    skills: Array<{
        id: string;
        name: string;
        level: string;
        key: string;
        value: string;
    }>;
    projects: Array<{
        id: string;
        title: string;
        link: string;
        duration : string;
        description: string;
        bulletPoints: Array<string>;
    }>;
    achievements: Array<{
        id: string;
        title: string;
        year: string;
        description: string;
        bulletPoints: Array<string>;
        isBulletPoints: boolean;
    }>;
    languages: Array<{
        id: string;
        language: string;
        level: string;
    }>
}

export function UtilityProvider({ children }: { children: React.ReactNode }) {

    const API_URL = "http://localhost:5000";
    const templateNames = ["SampleResume", "T1"];
    const [width, setWidth] = useState<number>(0);
    const [isDirty, setIsDirty] = useState(true);
    const {
        state: resumeData,
        updateState,
        undo,
        redo,
        pendingChange
    } = useUndoRedo<ResumeData>(initialLoad(defaultResumeData));

    function initialLoad(defaultData: ResumeData): ResumeData {
        if (typeof window === "undefined") return autoFix(defaultData)!;

        try {
            const raw = localStorage.getItem("data");

            if (!raw) {
                const fresh = autoFix(defaultData)!;
                localStorage.setItem("data", JSON.stringify(fresh));
                return fresh;
            }

            return autoFix(JSON.parse(raw))!;
        } catch {
            return autoFix(defaultData)!;
        }
    }

    function clearForm() {
        updateState(defaultResumeData, true);
        localStorage.removeItem("data");
    }

    useEffect(() => {
        try {
            localStorage.setItem("data", JSON.stringify(resumeData));
        } catch (err) {
            console.error("Failed to save resume data:", err);
        }
    }, [resumeData]);

    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function autoFix(data: any): ResumeData | null {
        try {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
        } catch (err) {
            console.error("Failed to parse resume data:", err);
            return null;
        }

        if (!data || typeof data !== "object") {
            console.warn("Input not an object — creating blank resume object.");
            data = {};
        }

        data.resume_id = typeof data.resume_id === "string" ? data.resume_id : null;
        data.template = typeof data.template === "string" ? data.template : "";

        const defaultOrder = [
            "PersonalDetails",
            "Summary",
            "WorkExperience",
            "Education",
            "Skills",
            "Projects",
            "Achievements",
            "Languages",
        ];

        let userOrder = Array.isArray(data.order) ? data.order.map(String) : [];

        const mergedOrder = [
            ...userOrder,
            ...defaultOrder.filter(section => !userOrder.includes(section))
        ];
        data.order = mergedOrder;


        data.personalDetails = data.personalDetails && typeof data.personalDetails === "object"
            ? data.personalDetails
            : {};
        const pdFields = [
            "name",
            "email",
            "phone",
            "linkedin",
            "github",
            "location",
            "country",
        ];
        pdFields.forEach((f) => {
            data.personalDetails[f] =
                typeof data.personalDetails[f] === "string"
                    ? data.personalDetails[f]
                    : "";
        });

        data.summary = typeof data.summary === "string" ? data.summary : "";

        const ensureArray = (v: any) => (Array.isArray(v) ? v : []);

        const sanitizeItems = (arr: any[], template: { [k: string]: any }) => {
            if (!Array.isArray(arr)) return [];
            if (arr.length === 0) return [];
            return arr.map((it) => {
                const item = it && typeof it === "object" ? { ...it } : {};
                const out: any = {};

                for (const key of Object.keys(template)) {
                    const def = template[key];
                    const val = item[key];

                    if (Array.isArray(def)) {
                        out[key] = Array.isArray(val) ? val.map(String) : [];
                    } else if (typeof def === "string") {
                        out[key] = typeof val === "string" ? val : "";
                    } else if (typeof def === "boolean") {
                        out[key] = typeof val === "boolean" ? val : def;
                    } else {
                        out[key] = val && typeof val === "object" ? { ...val } : def;
                    }
                }
                out.id = typeof item.id === "string" ? item.id : null;

                return out;
            });
        };

        const workTemplate = {
            id: null as string | null,
            company: "",
            role: "",
            duration: "",
            description: "",
            bulletPoints: [] as string[],
        };

        const educationTemplate = {
            id: null as string | null,
            degree: "",
            institution: "",
            year: "",
            description: "",
            grade: "",
            location: "",
            bulletPoints: [] as string[],
        };

        const skillTemplate = {
            id: null as string | null,
            name: "",
            level: "",
            key: "",
            value: "",
        };

        const projectTemplate = {
            id: null as string | null,
            title: "",
            link: "",
            duration : "",
            description: "",
            bulletPoints: [] as string[],
            isBulletPoints: false,
        };

        const achievementTemplate = {
            id: null as string | null,
            title: "",
            year: "",
            description: "",
            bulletPoints: [] as string[],
            isBulletPoints: false,
        };

        const languageTemplate = {
            id: null as string | null,
            language: "",
            level: "",
        };

        data.workExperience = ensureArray(data.workExperience);
        data.education = ensureArray(data.education);
        data.skills = ensureArray(data.skills);
        data.projects = ensureArray(data.projects);
        data.achievements = ensureArray(data.achievements);
        data.languages = ensureArray(data.languages);

        data.workExperience =
            data.workExperience.length > 0
                ? sanitizeItems(data.workExperience, workTemplate)
                : [];
        data.education =
            data.education.length > 0
                ? sanitizeItems(data.education, educationTemplate)
                : [];
        data.skills =
            data.skills.length > 0 ? sanitizeItems(data.skills, skillTemplate) : [];
        data.projects =
            data.projects.length > 0
                ? sanitizeItems(data.projects, projectTemplate)
                : [];
        data.achievements =
            data.achievements.length > 0
                ? sanitizeItems(data.achievements, achievementTemplate)
                : [];
        data.languages =
            data.languages.length > 0
                ? sanitizeItems(data.languages, languageTemplate)
                : [];

        data.workExperience = Array.isArray(data.workExperience)
            ? data.workExperience
            : [];
        data.education = Array.isArray(data.education) ? data.education : [];
        data.skills = Array.isArray(data.skills) ? data.skills : [];
        data.projects = Array.isArray(data.projects) ? data.projects : [];
        data.achievements = Array.isArray(data.achievements) ? data.achievements : [];
        data.languages = Array.isArray(data.languages) ? data.languages : [];

        return data as ResumeData;
    }

    function autoFill(data: any) {
        const fixed = autoFix(data);
        if (!fixed) return null;

        updateState(fixed, true);
        setIsDirty(false);
    }


    const handleDataChange = (
        newData: Partial<ResumeData>,
        commit: boolean = false
    ) => {
        updateState(
            {
                ...resumeData,
                ...newData
            },
            commit
        );
        setIsDirty(true);
    };

    return (
        <UtilityContext.Provider value={{
            API_URL,
            templateNames,
            width,
            resumeData,
            handleDataChange,
            autoFill,
            clearForm,
            isDirty,
            undo,
            redo,
        }}>
            {children}
        </UtilityContext.Provider>
    )
}

export function useUtility() {
    return useContext(UtilityContext);
}