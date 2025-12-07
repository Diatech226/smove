// file: components/ui/Button.tsx
import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
  variant?: ButtonVariant;
  href?: string;
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseProps & ComponentPropsWithoutRef<"button">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/30",
  secondary:
    "border border-emerald-400/60 text-emerald-100 hover:border-emerald-200 hover:text-white",
  ghost: "text-slate-100 hover:text-white hover:bg-white/5",
};

export function Button({
  variant = "primary",
  href,
  children,
  className,
  type = "button",
  ...props
  }: ButtonProps) {
    const classes = cn(
      "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950",
      variantClasses[variant],
      className,
    );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
