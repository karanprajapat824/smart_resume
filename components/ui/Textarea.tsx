
import React, { forwardRef } from "react";

export interface TextareaProps {
    label?: string;
    id: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, id, value, placeholder, onChange, className = "" }, ref) => {
        return (
            <div className={`flex flex-col gap-2 w-full h-full ${className}`}>
                {label && (
                    <label className="font-semibold text-sm" htmlFor={id}>
                        {label}
                    </label>
                )}
                <textarea
                    id={id}
                    ref={ref}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="border rounded w-full h-[90%] resize-none p-4 text-sm"
                />
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
export default Textarea;
