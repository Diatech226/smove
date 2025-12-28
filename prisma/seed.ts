import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { DEFAULT_CATEGORIES } from "../lib/config/categories";
import { buildSiteSettingsPayload, DEFAULT_SITE_SETTINGS, SETTINGS_KEY } from "../lib/siteSettings";

const prisma = new PrismaClient();

async function seedSiteSettings() {
  const existing = await prisma.siteSettings.findUnique({ where: { key: SETTINGS_KEY } });

  if (existing) {
    console.log("SiteSettings déjà présent, aucun changement.");
    return false;
  }

  await prisma.siteSettings.create({
    data: {
      key: SETTINGS_KEY,
      ...buildSiteSettingsPayload(DEFAULT_SITE_SETTINGS),
    },
  });

  console.log("SiteSettings créé avec les valeurs par défaut.");
  return true;
}

async function seedCategories() {
  const types = ["post", "service", "project", "event"] as const;

  for (const type of types) {
    const count = await prisma.category.count({ where: { type } });
    if (count > 0) {
      console.log(`Catégories ${type} déjà présentes, aucun changement.`);
      continue;
    }

    const defaults = DEFAULT_CATEGORIES.filter((category) => category.type === type);
    if (!defaults.length) {
      console.log(`Aucune catégorie par défaut pour ${type}.`);
      continue;
    }

    await prisma.category.createMany({
      data: defaults.map((category) => ({
        type: category.type,
        name: category.name,
        slug: category.slug,
        order: category.order,
      })),
    });
    console.log(`Catégories ${type} créées (${defaults.length}).`);
  }
}

async function seedBootstrapAdmin() {
  const bootstrapEnabled = process.env.ADMIN_BOOTSTRAP_ENABLED === "true";
  const bootstrapAllowProd = process.env.ADMIN_BOOTSTRAP_ALLOW_PROD === "true";
  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  const bootstrapRole = process.env.ADMIN_BOOTSTRAP_ROLE?.trim().toLowerCase() === "client" ? "client" : "admin";
  const isProd = process.env.NODE_ENV === "production";

  if (!bootstrapEnabled) return;
  if (isProd && !bootstrapAllowProd) {
    console.warn("Bootstrap admin désactivé en production. Ajoutez ADMIN_BOOTSTRAP_ALLOW_PROD=true pour l'autoriser.");
    return;
  }
  if (!bootstrapEmail || !bootstrapPassword) {
    console.warn("Bootstrap admin incomplet: ADMIN_BOOTSTRAP_EMAIL ou ADMIN_BOOTSTRAP_PASSWORD manquant.");
    return;
  }

  const passwordHash = await bcrypt.hash(bootstrapPassword, 12);
  const user = await prisma.user.upsert({
    where: { email: bootstrapEmail },
    update: {
      role: bootstrapRole,
      status: "active",
      passwordHash,
    },
    create: {
      email: bootstrapEmail,
      role: bootstrapRole,
      status: "active",
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log(`Bootstrap admin prêt (${user.email}).`);
}

async function main() {
  await seedSiteSettings();
  await seedCategories();
  await seedBootstrapAdmin();
}

main()
  .catch((error) => {
    console.error("Erreur lors du seed SiteSettings", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
