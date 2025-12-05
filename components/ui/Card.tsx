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
        "rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-lg shadow-black/10 backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
