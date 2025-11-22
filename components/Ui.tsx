"use client"
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useRef, useState, forwardRef } from "react";
import { CirclePlus, Trash2 } from "lucide-react";

type Variant = "primary" | "primaryPlus" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
}

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

interface TextareaProps {
  label?: string;
  id: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

interface ToggleModeProps {
  className?: string;
  placeHolder?: string;
  exp: any;
  add: (id: string, point: string) => void;
  update: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => void;
  deletePoints: (id: string, index: number) => void;
  updatePoints: (id: string, index: number, point: string) => void;
};

interface LoaderType {
    size?: string,
}

function Loader({ size = "1" }: LoaderType) {
    return (
        <div
            style={{
                height: `${size}em`,
                width: `${size}em`,
                borderWidth: `${parseInt(size) / 6}em`,
                borderStyle: "solid",     
                borderColor: "rgb(229 231 235)",
                borderTopColor: "rgb(59 130 246)",
                borderRadius: "9999px",
            }}
            className="animate-spin"
        ></div>

    )
}

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


const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
          onChange={(e) => onChange(e)}
          className="border rounded w-full h-[90%] resize-none p-4 text-sm"
        />
      </div>
    );
  }
);

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

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", icon, href, disabled = false, ...rest }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-300 ease-in-out overflow-hidden relative";

    const variants: Record<Variant, string> = {
      primary:
        "group/button bg-primary text-primary-foreground border border-white/20 backdrop-blur-sm hover:shadow-sm cursor-pointer hover:shadow-blue-2xl ",
      primaryPlus:
        "group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-primary backdrop-blur-lg px-6 py-2 cursor-pointer font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-sm hover:shadow-blue-2xl border border-white/20",
      secondary:
        "bg-secondary text-secondary-foreground border border-zinc-600 shadow-md hover:shadow-xl cursor-pointer",
      outline: "text-muted-foreground hover:opacity-90 cursor-pointer border hover:bg-muted hover:text-primary",
      ghost: "text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
    };

    const sizes: Record<Size, string> = {
      sm: "px-3 py-1 text-sm h-9",
      md: "px-4 py-2 text-sm h-9",
      lg: "px-5 py-3 text-base h-12",
    };

    const disabledStyles =
      "opacity-50 cursor-not-allowed pointer-events-none hover:scale-100 hover:shadow-none hover:bg-none";

    const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ""} ${className}`;

    const content = (
      <>
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        <span className="flex items-center gap-2 justify-center">{children}</span>

        {(variant === "primary" || variant === "primaryPlus") && !disabled && (
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
            <div className="relative h-full w-10 bg-white/30" />
          </div>
        )}
      </>
    );

    if (href) {
      return (
        <Link href={href} ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...(rest as any)}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} disabled={disabled} {...rest}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
Input.displayName = "Input";
Textarea.displayName = "Textarea";
ToggleMode.displayName = "ToggleMode";




export {
  Button,
  Input,
  Textarea,
  ToggleMode,
  Loader
};
