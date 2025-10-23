import React from "react";

export interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  index?: number;
  onChange: (value: string, index?: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, index?: number) => void;
  inputRef?: (el: HTMLInputElement | null) => void;
  className?: string;
}

export default function Input({
  label,
  id,
  value,
  placeholder,
  index,
  onChange,
  type = "text",
  onKeyDown,
  inputRef,
  className = "",
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-semibold text-sm" htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        ref={(el) => {
          if (typeof inputRef === "function") inputRef(el);
        }}
        className="border rounded py-1 px-4 text-sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value, index)}
        onKeyDown={(e) => onKeyDown && onKeyDown(e, index)}
      />
    </div>
  );
}
