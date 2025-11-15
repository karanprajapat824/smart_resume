import React, { useEffect, useRef, useState, forwardRef } from "react";
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
};

const ToggleMode = forwardRef<HTMLTextAreaElement, ToggleModeProps>(
    ({ className = "", add, exp, update, deletePoints, placeHolder, updatePoints }, ref) => {
        const [currentTab, setCurrentTab] = useState(false);
        const [bullet, setBullet] = useState("");
        const [isUpdating, setIsUpdating] = useState(false);
        const [index, setIndex] = useState(0);

        const bulletPointRef = useRef<HTMLInputElement | null>(null);
        const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

        // Forward external ref → textarea
        useEffect(() => {
            if (!ref) return;
            if (typeof ref === "function") ref(textAreaRef.current);
            else ref.current = textAreaRef.current;
        }, [ref]);

        const addPoints = () => {
            if (!bullet.trim()) return;
            add(exp.id, bullet);
            setBullet("");
        };

        const beginUpdate = (i: number, point: string) => {
            setBullet(point);
            setIsUpdating(true);
            setIndex(i);
            bulletPointRef.current?.focus();
        };

        const applyUpdate = () => {
            updatePoints(exp.id, index, bullet);
            setIsUpdating(false);
            setBullet("");
        };

        useEffect(() => {
            bulletPointRef.current?.focus();
            textAreaRef.current?.focus();
        }, [currentTab]);

        return (
            <div className="flex flex-col gap-2">
                <label className={`font-semibold text-sm flex gap-2 mb-2 ${className}`}>
                    <button
                        type="button"
                        onClick={() => setCurrentTab(false)}
                        className={`px-3 py-2 rounded-lg ${!currentTab && "border-b-2 border-blue-500 text-blue-600 bg-gray-100"}`}
                    >
                        Description
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentTab(true)}
                        className={`px-3 py-2 rounded-lg flex gap-1 ${currentTab && "border-b-2 border-blue-500 text-blue-600 bg-gray-100"}`}
                    >
                        <CirclePlus className="h-4" />
                        Add Bullet Points
                    </button>
                </label>

                {currentTab && (
                    <div className="border rounded py-2 flex justify-between px-2 gap-5">
                        <input
                            ref={bulletPointRef}
                            value={bullet}
                            onChange={(e) => setBullet(e.target.value)}
                            placeholder="Add bullet points"
                            className="text-sm px-2 w-full focus:outline-none"
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                (isUpdating ? applyUpdate() : addPoints())
                            }
                        />

                        {isUpdating ? (
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="primary" onClick={applyUpdate}>
                                    Update
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => {
                                        setBullet("");
                                        setIsUpdating(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button size="sm" variant="primary" onClick={addPoints}>
                                Add
                            </Button>
                        )}
                    </div>
                )}

                {!currentTab && (
                    <textarea
                        ref={textAreaRef}
                        className="border rounded w-full resize-none py-2 px-4 h-20 text-sm"
                        value={exp.description}
                        name="description"
                        placeholder={placeHolder || "Describe in detail"}
                        onChange={(e) => update(e, exp.id)}
                    />
                )}

                {currentTab && exp?.bulletPoints?.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {exp.bulletPoints.map((point: string, i: number) => (
                            <div key={i} className="border rounded px-4 py-1 flex items-center text-sm">
                                <div onClick={() => beginUpdate(i, point)}>{point}</div>

                                <button
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    onClick={() => deletePoints(exp.id, i)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

ToggleMode.displayName = "ToggleMode";
export default ToggleMode;
