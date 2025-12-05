// file: components/pages/ContactPageContent.tsx
"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { trackEvent } from "@/lib/analytics";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

type FormState = typeof initialState;
type FieldErrors = Partial<Record<keyof FormState, string>>;

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPageContent() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const isSubmitting = status === "submitting";
  const hasSuccess = status === "success";
  const hasError = status === "error";

  const errorMessageId = useMemo(
    () =>
      Object.keys(errors).reduce<Record<string, string>>((acc, key) => {
        acc[key] = `${key}-error`;
        return acc;
      }, {}),
    [errors],
  );

  const handleChange = (
    field: keyof FormState,
    value: string,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setServerMessage("");
    setErrors({});
    firstErrorRef.current = null;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone || undefined,
          subject: formState.subject || undefined,
          message: formState.message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setStatus("error");
        setServerMessage(
          data?.message ||
            "Une erreur est survenue. Merci de vérifier les champs ci-dessous.",
        );
        if (data?.errors) {
          const apiErrors: FieldErrors = data.errors;
          setErrors(apiErrors);

          const firstErrorField = Object.keys(apiErrors)[0] as keyof FormState | undefined;
          if (firstErrorField) {
            const target = document.getElementById(firstErrorField) as
              | HTMLInputElement
              | HTMLTextAreaElement
              | null;
            firstErrorRef.current = target;
            target?.focus();
          }
        }
        return;
      }

      setStatus("success");
      setServerMessage("Votre message a bien été envoyé. Nous revenons vers vous rapidement.");
      setFormState(initialState);
      trackEvent({
        name: "contact_form_submitted",
        payload: { source: "contact_page" },
      });
    } catch (error) {
      console.error("Contact form submission failed", error);
      setStatus("error");
      setServerMessage("Une erreur réseau est survenue. Merci de réessayer.");
    }
  };

  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-10">
        <SectionHeader
          eyebrow="Contact"
          title="Parlons de vos objectifs"
          subtitle="Un brief, une idée, une urgence ? Écrivons ensemble la prochaine étape de votre communication."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {serverMessage ? (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    hasError
                      ? "border border-red-500/40 bg-red-500/10 text-red-100"
                      : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                  }`}
                  role={hasError ? "alert" : "status"}
                  aria-live="polite"
                >
                  {serverMessage}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="name">
                    Nom
                  </label>
                  <input
                    id="name"
                    name="name"
                    ref={errors.name ? firstErrorRef : null}
                    type="text"
                    autoComplete="name"
                    required
                    value={formState.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="Votre nom complet"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? errorMessageId.name : undefined}
                  />
                  {errors.name ? (
                    <p id={errorMessageId.name} className="text-sm text-red-300">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formState.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="vous@email.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? errorMessageId.email : undefined}
                  />
                  {errors.email ? (
                    <p id={errorMessageId.email} className="text-sm text-red-300">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="phone">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={formState.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="+226 ..."
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? errorMessageId.phone : undefined}
                  />
                  {errors.phone ? (
                    <p id={errorMessageId.phone} className="text-sm text-red-300">
                      {errors.phone}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="subject">
                    Sujet
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formState.subject}
                    onChange={(event) => handleChange("subject", event.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="Campagne social media, tournage..."
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? errorMessageId.subject : undefined}
                  />
                  {errors.subject ? (
                    <p id={errorMessageId.subject} className="text-sm text-red-300">
                      {errors.subject}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formState.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="Dites-nous en plus sur votre besoin"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? errorMessageId.message : undefined}
                />
                {errors.message ? (
                  <p id={errorMessageId.message} className="text-sm text-red-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? "Envoi…" : "Envoyer le message"}
                </Button>
              </div>

              {hasSuccess ? (
                <p className="text-sm text-emerald-100" aria-live="polite">
                  Merci ! Nous vous répondrons dans les plus brefs délais.
                </p>
              ) : null}
            </form>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Contact direct</h3>
            <p className="text-slate-200">
              Vous préférez échanger immédiatement ? Appelez-nous ou écrivez-nous sur WhatsApp.
            </p>
            <div className="space-y-2 text-slate-100">
              <p>+226 60 67 32 42</p>
              <p>+226 67 42 35 40</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="https://wa.me/22660673242" variant="secondary">
                WhatsApp
              </Button>
              <Button href="mailto:contact@smove.agency" variant="ghost">
                contact@smove.agency
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
