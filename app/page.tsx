const services = [
  {
    title: "3D Landing Experiences",
    description: "Immersive hero narratives that combine product storytelling with interactive visuals.",
    items: ["3D hero concepts", "High-performance builds", "Brand-calibrated art direction"],
  },
  {
    title: "Acquisition & Funnels",
    description: "Paid media ecosystems engineered to convert across search, social, and remarketing.",
    items: ["Full-funnel strategy", "Conversion design", "Analytics & reporting"],
  },
  {
    title: "Brand Platforms",
    description: "Modular brand systems that stay cohesive across every digital touchpoint.",
    items: ["Design systems", "Content guidelines", "Motion identity"],
  },
];

const caseStudies = [
  {
    name: "Aether Mobility",
    result: "+128% qualified demos",
    summary: "Revitalized their launch site with immersive storytelling and high-intent nurture flows.",
  },
  {
    name: "Northwind SaaS",
    result: "2.4x pipeline velocity",
    summary: "Rebuilt acquisition journeys that tightened targeting and simplified onboarding.",
  },
  {
    name: "Pulse Commerce",
    result: "+38% paid social ROAS",
    summary: "Scaled creative testing and improved product education with narrative landing pages.",
  },
];

const processSteps = [
  {
    title: "Discovery",
    detail: "Align on goals, customer truths, and brand constraints to anchor the engagement.",
  },
  {
    title: "Strategy",
    detail: "Channel selection, messaging architecture, and 3D/visual direction mapped to outcomes.",
  },
  {
    title: "Production",
    detail: "Rapid prototyping of pages, creative, and supporting assets with stakeholder reviews.",
  },
  {
    title: "Launch",
    detail: "Rigorous QA, analytics instrumentation, and coordinated roll-out across channels.",
  },
  {
    title: "Optimization",
    detail: "Continuous testing of offers, creative, and motion to compound performance.",
  },
];

export default function Home() {
  return (
    <div className="bg-slate-950">
      <section
        id="hero"
        className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              NovaDigital Studio
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
              Growth partners for bold brands
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Digital marketing built with cinematic polish and measurable rigor.
              </h1>
              <p className="max-w-xl text-lg text-slate-300">
                We design experiences that command attention and convert. From 3D hero moments to multi-channel acquisition, every detail is tuned for momentum.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                Book a strategy call
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                View case studies
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <div>
                <p className="text-2xl font-semibold text-white">75+</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">Campaign launches</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">4.8/5</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">Avg. partner rating</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">11 yrs</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">Building digital wins</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400/20 via-violet-500/10 to-transparent blur-3xl" aria-hidden />
            <div className="relative flex h-full min-h-[360px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">3D showcase</p>
                <p className="text-lg font-medium text-white">
                  Animated 3D hero experience landing here in the next iteration.
                </p>
                <p className="text-sm text-slate-300">
                  The scene will feature an abstract form that mirrors our strategic, adaptive marketing workflows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-white/5 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Services</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Built for marketing leaders who need speed and craft.
            </h2>
            <p className="max-w-3xl text-base text-slate-300">
              From early positioning to ongoing optimization, our team blends creative storytelling with performance discipline.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
                </div>
                <p className="text-sm text-slate-300">{service.description}</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-b border-white/5 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Case Studies</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Work that balances impression and impact.
            </h2>
            <p className="max-w-3xl text-base text-slate-300">
              A glimpse into recent partnerships shaping launches, rebrands, and growth mandates.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseStudies.map((study) => (
              <article
                key={study.name}
                className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    <span>{study.name}</span>
                    <span className="text-cyan-200">{study.result}</span>
                  </div>
                  <p className="text-sm text-slate-300">{study.summary}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
                  <span>Full case study coming soon</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-white/5 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Process</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              A clear path from insight to launch.
            </h2>
            <p className="max-w-3xl text-base text-slate-300">
              Structured checkpoints keep stakeholders aligned and velocity high.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-[1fr,1fr] md:items-start">
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-300">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-slate-900/40 to-slate-950 p-6 text-slate-300">
              <h3 className="text-xl font-semibold text-white">What to expect</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
                  Transparent milestones, so your stakeholders stay confident.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
                  Async-first communication with weekly progress capsules.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden />
                  QA checklists for performance, accessibility, and launch-readiness.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Contact</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Tell us about your next launch.
            </h2>
            <p className="max-w-3xl text-base text-slate-300">
              Share a few details and we will respond with a tailored plan within one business day.
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="space-y-4 text-sm text-slate-300">
              <p>
                We collaborate with product, marketing, and brand teams to build memorable, high-performing digital experiences. Expect candor, momentum, and measurable outcomes.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Response Time</p>
                <p className="mt-2 text-lg font-semibold text-white">&lt; 24 hours</p>
                <p className="mt-1 text-sm text-slate-300">Dedicated strategist reviews every submission.</p>
              </div>
            </div>
            <form className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <label className="text-sm text-slate-200" htmlFor="name">
                Name
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                />
              </label>
              <label className="text-sm text-slate-200" htmlFor="email">
                Email or WhatsApp
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="you@company.com"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                />
              </label>
              <label className="text-sm text-slate-200" htmlFor="company">
                Company
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Brand or team name"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                />
              </label>
              <label className="text-sm text-slate-200" htmlFor="project">
                Project description
                <textarea
                  id="project"
                  name="project"
                  rows={4}
                  placeholder="Launch goals, timelines, challenges"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
