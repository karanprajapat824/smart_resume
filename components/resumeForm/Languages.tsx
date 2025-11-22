"use client";
import { useEffect, useRef, useState } from "react";
import ResumeFormHeader from "@/components/ResumeFormHeader";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { ResumeSectionProps } from "../ResumeForm";
import { useUtility } from "@/app/providers/UtilityProvider";
import { Input } from "@/components/Ui";

export default function Languages({
    openSections,
    setOpenSections,
}: ResumeSectionProps) {
    const { resumeData, handleDataChange } = useUtility();
    const langRef = useRef<HTMLInputElement>(null);
    const [language, setLanguage] = useState<string>("");
    const [level, setLevel] = useState<string>("");
    const [error, setError] = useState<string>("");
    const selectRef = useRef<HTMLSelectElement>(null);


    useEffect(() => {
        langRef.current?.focus();
    }, [openSections.language]);

    function addLanguage() {
        const trimmedLang = language.trim();
        const trimmedLevel = level.trim();

        if (trimmedLang.length === 0 || trimmedLevel.length === 0) {
            setError("Please enter both language and level");
            return;
        }

        if (
            resumeData.languages?.some(
                (l) => l.language.toLowerCase() === trimmedLang.toLowerCase()
            )
        ) {
            setError("Language already exists");
            setLanguage("");
            return;
        }

        setError("");
        handleDataChange({
            languages: [
                ...resumeData.languages,
                {
                    id: Date.now().toString(),
                    language: trimmedLang,
                    level: trimmedLevel,
                },
            ],
        });

        setLanguage("");
        setLevel("");
    }

    function deleteLanguage(id: string) {
        const remaining = resumeData.languages.filter((l) => l.id !== id);
        handleDataChange({ languages: remaining });
    }

    return (
        <div>
            <ResumeFormHeader
                isOpen={openSections.language}
                setIsOpen={setOpenSections}
                heading="Languages"
                name="language"
            />
            <div className="border-b pt-4 pb-0">
                <div
                    className={`flex flex-col items-center justify-center gap-4 ${!openSections.language && "hidden"
                        }`}
                >
                    <div className="w-full flex flex-col gap-y-2">
                        {/* Input fields */}
                        <div className="flex gap-2 relative">
                            <Input
                                ref={langRef}
                                id=""
                                placeholder="Language (e.g., English)"
                                classNameForInput={`rounded px-2 w-1/2 border py-2 text-sm ${error && "border-red-500"
                                    }`}
                                onChange={(e) => {
                                    setLanguage(e.target.value);
                                    setError("");
                                }}
                                value={language}
                                onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                            />
                            <div className="w-1/2 relative">
                                <select
                                    ref={selectRef}
                                    id="select"
                                    className={`appearance-none  bg-transparent w-full rounded px-2 border py-2 hover:cursor-pointer text-sm mr-2 ${error && "border-red-500"}`}
                                    value={level}
                                    onChange={(e) => {
                                        setLevel(e.target.value);
                                        setError("");
                                    }}
                                >
                                    <option value="">Select level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Fluent">Fluent</option>
                                    <option value="Native">Native</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => selectRef.current?.focus()}
                                    className="pointer-events-none absolute top-2 right-2 cursor-pointer">
                                    <ChevronDown />
                                </button>
                            </div>
                            <button
                                className="px-4 py-1 bg-primary flex justify-center items-center gap-2 text-primary-foreground rounded hover:cursor-pointer transition duration-500"
                                onClick={addLanguage}
                            >
                                <Plus className="h-4 w-4" /> Add
                            </button>
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        {/* List */}
                        <div className="flex gap-3 flex-wrap pb-4">
                            {resumeData.languages?.map((lang) => (
                                <div
                                    key={lang.id}
                                    className="border rounded-full px-4 py-1 flex items-center justify-center text-sm"
                                >
                                    {lang.language} – <span className="ml-1 italic">{lang.level}</span>
                                    <button
                                        onClick={() => deleteLanguage(lang.id)}
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
        </div>
    );
}
