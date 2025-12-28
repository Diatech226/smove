import { PrismaClient } from "@prisma/client";

import { buildSiteSettingsPayload, DEFAULT_SITE_SETTINGS, SETTINGS_KEY } from "../lib/siteSettings";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.siteSettings.findUnique({ where: { key: SETTINGS_KEY } });

  if (existing) {
    console.log("SiteSettings déjà présent, aucun changement.");
    return;
  }

  await prisma.siteSettings.create({
    data: {
      key: SETTINGS_KEY,
      ...buildSiteSettingsPayload(DEFAULT_SITE_SETTINGS),
    },
  });

  console.log("SiteSettings créé avec les valeurs par défaut.");
}

main()
  .catch((error) => {
    console.error("Erreur lors du seed SiteSettings", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
