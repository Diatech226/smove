"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

const transition = { duration: 0.85, ease: "easeOut" } as const;

const screenCopy = [
  {
    title: "Accélérez votre image de marque avec une agence digitale premium.",
    description:
      "Stratégie, contenus et campagnes orchestrés par une équipe senior. SMOVE pilote votre visibilité avec méthode et élégance.",
    ctaPrimary: { label: "Planifier un brief", href: "/contact" },
    ctaSecondary: { label: "Voir nos projets", href: "/projects" },
  },
  {
    title: "Des contenus immersifs pour capter votre audience sur tous les écrans.",
    description:
      "Production vidéo, social media et expériences interactives conçues pour performer. Laissez-nous orchestrer la suite.",
    ctaPrimary: { label: "Découvrir nos services", href: "/services" },
    ctaSecondary: { label: "Parler à un expert", href: "/contact" },
  },
];

type ScreenIndex = 0 | 1;

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotionPref();
  const [activeScreen, setActiveScreen] = useState<ScreenIndex>(0);
  const scrollLock = useRef(false);
  const delayMs = useMemo(() => {
    const value = Number(process.env.NEXT_PUBLIC_HERO_DELAY_MS ?? 1500);
    return Number.isFinite(value) ? Math.min(Math.max(value, 800), 4000) : 1500;
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    if (activeScreen !== 0) return;
    const timer = window.setTimeout(() => setActiveScreen(1), delayMs);
    return () => window.clearTimeout(timer);
  }, [activeScreen, delayMs, shouldReduceMotion]);

  const onWheel = (event: React.WheelEvent) => {
    if (scrollLock.current) return;
    if (Math.abs(event.deltaY) < 10) return;
    scrollLock.current = true;
    window.setTimeout(() => {
      scrollLock.current = false;
    }, 500);

    if (event.deltaY > 0) {
      setActiveScreen(1);
    } else {
      setActiveScreen(0);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-white/10" onWheel={onWheel}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-500/15 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-[160px]" />
      </div>

      <AnimatePresence mode="wait">
        {activeScreen === 0 ? (
          <motion.div
            key="hero-screen-1"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -30 }}
            transition={shouldReduceMotion ? { duration: 0 } : transition}
            className="relative min-h-[90vh] pb-16 pt-24"
          >
            <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                  Agence digitale premium
                </div>
                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  {screenCopy[0].title}
                </h1>
                <p className="text-lg text-slate-200">{screenCopy[0].description}</p>
                <div className="flex flex-wrap gap-4">
                  <Button href={screenCopy[0].ctaPrimary.href}>{screenCopy[0].ctaPrimary.label}</Button>
                  <Button href={screenCopy[0].ctaSecondary.href} variant="secondary">
                    {screenCopy[0].ctaSecondary.label}
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                  <span>Branding</span>
                  <span>•</span>
                  <span>Social Media</span>
                  <span>•</span>
                  <span>Production vidéo</span>
                </div>
              </div>

              <div className="grid gap-4">
                {["Audit express", "Planning éditorial", "Optimisation ads"].map((label) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.4)]"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Livrable</p>
                    <p className="mt-2 text-lg font-semibold text-white">{label}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Des actions concrètes pour mettre votre communication sous contrôle.
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </motion.div>
        ) : (
          <motion.div
            key="hero-screen-2"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -30 }}
            transition={shouldReduceMotion ? { duration: 0 } : transition}
            className="relative min-h-[90vh] pb-16 pt-24"
          >
            <div className="absolute inset-0">
              {process.env.NEXT_PUBLIC_HERO_VIDEO_URL ? (
                <video
                  className="h-full w-full object-cover"
                  src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL}
                  poster={process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER ?? "/hero-poster.svg"}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER ?? "/hero-poster.svg"})`,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
            </div>

            <Container className="relative z-10 flex min-h-[70vh] flex-col justify-center gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                Expériences immersives
              </div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {screenCopy[1].title}
              </h2>
              <p className="max-w-2xl text-lg text-slate-200">{screenCopy[1].description}</p>
              <div className="flex flex-wrap gap-4">
                <Button href={screenCopy[1].ctaPrimary.href}>{screenCopy[1].ctaPrimary.label}</Button>
                <Button href={screenCopy[1].ctaSecondary.href} variant="secondary">
                  {screenCopy[1].ctaSecondary.label}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <button
              type="button"
              onClick={() => setActiveScreen(0)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-slate-100 transition hover:border-sky-400/60"
            >
              Revenir
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen(1)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-slate-100 transition hover:border-sky-400/60"
            >
              Passer
            </button>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1].map((dot) => (
              <button
                key={dot}
                type="button"
                aria-label={dot === 0 ? "Écran 1" : "Écran 2"}
                onClick={() => setActiveScreen(dot as ScreenIndex)}
                className={`h-2.5 w-8 rounded-full transition ${
                  activeScreen === dot ? "bg-sky-400" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
