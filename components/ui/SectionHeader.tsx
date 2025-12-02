"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  highlight?: ReactNode;
  tone?: "dark" | "light";
}

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  highlight,
  tone = "dark",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const maxWidth = align === "center" ? "max-w-3xl" : "max-w-4xl";
  const titleClass = tone === "dark" ? "text-slate-900" : "text-white";
  const subtitleClass = tone === "dark" ? "text-slate-600" : "text-blue-50/90";
  const badgeClasses =
    tone === "dark"
      ? "bg-blue-600/10 text-blue-800"
      : "bg-white/10 text-white/90 border border-white/15";

  return (
    <motion.div
      className={`space-y-3 ${alignment} ${maxWidth}`}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      <p
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${badgeClasses}`}
      >
        {eyebrow}
        {highlight}
      </p>
      <h2 className={`text-3xl font-semibold sm:text-4xl ${titleClass}`}>{title}</h2>
      {subtitle ? <p className={`text-base ${subtitleClass}`}>{subtitle}</p> : null}
    </motion.div>
  );
}
