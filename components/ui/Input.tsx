import React, { forwardRef, useState } from "react";
import { Eye, FileText, EyeOff, X } from "lucide-react";

interface InputFieldProps {
  label?: string;
  name?: string;
  id: string;
  value: string;
  placeholder?: string;
  index?: number;
  type?: string;
  classNameForInput?: string;
  classNameForLabel?: string;
  isPassword?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, ...args: any[]) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>, index?: number) => void;
}

const Input = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      id,
      value,
      placeholder,
      index,
      onChange,
      type = "text",
      onKeyDown,
      classNameForInput = "",
      classNameForLabel = "",
      name = "",
      isPassword = false,
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState<boolean>(false);
    return (
      <div className={`flex flex-col gap-2`}>
        <label className={`font-semibold text-sm ${classNameForLabel}`} htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            name={name}
            type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
            ref={ref}
            className={`border rounded w-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${classNameForInput}`}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => onKeyDown && onKeyDown(e, index)}
          />

          {isPassword && (
            isPasswordVisible ? (
              <EyeOff
                onClick={() => setIsPasswordVisible(false)}
                className="absolute top-[20%] right-[2%] cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setIsPasswordVisible(true)}
                className="absolute top-[20%] right-[2%] cursor-pointer"
              />
            )
          )}

        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
