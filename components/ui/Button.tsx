import Link from "next/link";
import React, { forwardRef } from "react";

type Variant = "primary" | "primaryPlus" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", icon, href, ...rest }, ref) => {
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

    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
      <>
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        <span className="flex items-center gap-2 justify-center">{children}</span>

        {(variant === "primary" || variant === "primaryPlus") && (
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
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...rest}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
