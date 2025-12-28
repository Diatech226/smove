import { slugify } from "@/lib/utils";

export type SeedCategory = {
  type: "post" | "service" | "project" | "event";
  name: string;
  slug: string;
  order: number;
};

const POST_CATEGORIES = ["Stratégie", "Création", "Social Media", "Production", "Marketing digital"];
const SERVICE_CATEGORIES = ["Stratégie", "Branding", "Social Media", "Production", "Activation"];
const PROJECT_CATEGORIES = ["Campagne", "Branding", "Digital", "Événementiel", "Content"];
const EVENT_CATEGORIES = ["Événement", "Webinar", "Activation", "Culture", "Corporate"];

export const DEFAULT_CATEGORIES: SeedCategory[] = [
  ...POST_CATEGORIES.map((name, index) => ({
    type: "post" as const,
    name,
    slug: slugify(name),
    order: index,
  })),
  ...SERVICE_CATEGORIES.map((name, index) => ({
    type: "service" as const,
    name,
    slug: slugify(name),
    order: index,
  })),
  ...PROJECT_CATEGORIES.map((name, index) => ({
    type: "project" as const,
    name,
    slug: slugify(name),
    order: index,
  })),
  ...EVENT_CATEGORIES.map((name, index) => ({
    type: "event" as const,
    name,
    slug: slugify(name),
    order: index,
  })),
];
