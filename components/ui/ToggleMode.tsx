import React, { useEffect, useRef, useState } from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import Button from "./Button";

export type ToggleModeProps = {
    className?: string;
    placeHolder?: string;
    exp: any;
    add: (id: string, point: string) => void;
    update: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => void;
    deletePoints: (id: string, index: number) => void;
    updatePoints: (id: string, index: number, point: string) => void;
    inputRef?: (el: HTMLTextAreaElement | null) => void;
};

export default function ToggleMode({
    className = "",
    add,
    exp,
    update,
    deletePoints,
    placeHolder,
    updatePoints,
    inputRef

}: ToggleModeProps) {
    const [currentTab, setCurrentTab] = useState(false);
    const [bullet, setBullet] = useState<string>("");
    const [isupdatePoints, setIsUpdatePoints] = useState<boolean>(false);
    const [index, setIndex] = useState(0);
    const bulletPointRef = useRef<HTMLInputElement | null>(null);
    const desRef = useRef<HTMLTextAreaElement>(null);

    const handleCurrentTab = () => {
        setCurrentTab(!currentTab);
    }

    const addPoints = (id: string, bullet: string) => {
        add(id, bullet);
        setBullet("");
    }

    function tryUpdatePoints(index: number, point: string) {
        setBullet(point)
        setIsUpdatePoints(true);
        setIndex(index);
        if (bulletPointRef.current) bulletPointRef.current.focus();
    }

    function updateBulletPoints(id: string) {
        updatePoints(id, index, bullet);
        setIsUpdatePoints(false);
        setBullet("");
    }

    function cancelUpdatePoints() {
        setBullet("");
        setIsUpdatePoints(false);
    }

    useEffect(() => {
        if (bulletPointRef.current) bulletPointRef.current.focus();
        if (desRef.current) desRef.current.focus();
    }, [currentTab]);


    return (
        <div className="flex flex-col gap-2">
            <label
                className={`font-semibold text-sm flex flex-row gap-2 mb-2 items-center ${className}`}
            >
                <button
                    type="button"
                    onClick={handleCurrentTab}
                    className={`px-3 py-2 rounded-lg transition-all ${!currentTab
                        ? "border-b-2 border-blue-500 text-blue-600 bg-gray-100"
                        : "border-b-2 border-transparent"
                        } bg-gray-100 cursor-pointer`}
                >
                    Description
                </button>

                <button
                    type="button"
                    onClick={handleCurrentTab}
                    className={`px-3 py-2 rounded-lg transition-all flex flex-row items-center gap-1 ${currentTab
                        ? "border-b-2 bg-gray-100 border-blue-500 text-blue-600"
                        : "border-b-2 border-transparent"
                        } bg-gray-100 cursor-pointer`}
                >
                    <CirclePlus className="h-4" />
                    Add Bullet Points
                </button>
            </label>

            <div className={`border rounded py-2 flex flex-row justify-between px-2 gap-5 ${!currentTab && "hidden"}`}>
                <input
                    value={bullet}
                    ref={bulletPointRef}
                    onChange={(e) => setBullet(e.target.value)}
                    className="text-sm px-2 w-full focus:outline-none"
                    placeholder="Add bullet points"
                    onKeyDown={(e) => e.key === "Enter" && (isupdatePoints ? updateBulletPoints(exp.id) : addPoints(exp.id, bullet))}
                ></input>
                {
                    isupdatePoints ?
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => updateBulletPoints(exp.id)}
                            >Update</Button>
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={cancelUpdatePoints}
                            >Cancel</Button>
                        </div>
                        :
                        <Button
                            onClick={() => addPoints(exp.id, bullet)}
                            size="sm"
                            variant="primary"
                        >Add</Button>
                }
            </div>
            <textarea
                className={`border rounded w-full resize-none py-2 px-4 h-20 text-sm ${currentTab && "hidden"}`}
                value={exp.description}
                placeholder={placeHolder || "Describe in detail"}
                name="description"
                onChange={(e) => update(e, exp.id)}
                ref={(el) => {
                    desRef.current = el;
                    if (typeof inputRef === "function") inputRef(el);
                }}
            />

            <div className="flex gap-3 flex-wrap">
                {
                    exp?.bulletPoints?.length > 0 && currentTab &&
                    exp?.bulletPoints?.map((point: string, index: number) => (
                        <div
                            key={index}
                            className="border rounded px-4 py-1 flex items-center justify-center text-sm"
                        >
                            <div onClick={() => tryUpdatePoints(index, point)}>{point}</div>
                            <button
                                onClick={() => deletePoints(exp.id, index)}
                                className="ml-2 text-red-500 hover:text-red-700 hover:cursor-pointer"
                            >
                                <Trash2 className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
