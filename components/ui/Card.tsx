import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
};

type PolymorphicProps<T extends ElementType> = CardProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CardProps<T>>;

export function Card<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Component = as || "div";
  return (
    <Component
      className={cn(
        "rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
