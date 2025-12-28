import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL;
const DIRECT_DATABASE_URL = process.env.DIRECT_DATABASE_URL;

function maskMongoUrl(url) {
  if (!url) return "";
  return url.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@)/, "$1***$3");
}

function formatEnvStatus(name, value) {
  if (!value) {
    return `${name}: MISSING`;
  }
  return `${name}: ${maskMongoUrl(value)}`;
}

function hasQuotedValue(value) {
  return /^['"]/.test(value) || /['"]$/.test(value);
}

function analyzeMongoUrl(url) {
  const warnings = [];

  if (hasQuotedValue(url)) {
    warnings.push("Supprimez les guillemets autour de l'URL (pas de quotes dans .env).");
  }

  if (/\s/.test(url)) {
    warnings.push("Supprimez les espaces dans l'URL MongoDB.");
  }

  if (/<.+>/.test(url)) {
    warnings.push("Remplacez les placeholders (<db_password>, <user>, ...) par des valeurs réelles.");
  }

  if (!url.includes("/smove")) {
    warnings.push("Ajoutez '/smove' dans le chemin de l'URI pour pointer la base.");
  }

  if (!url.startsWith("mongodb://") && !url.startsWith("mongodb+srv://")) {
    warnings.push("L'URI doit commencer par mongodb:// ou mongodb+srv://.");
  }

  return warnings;
}

function summarizePrismaError(error) {
  const message = error instanceof Error ? error.message : String(error);

  if (/SCRAM|bad auth|Authentication failed|AuthenticationFailed/i.test(message)) {
    return "Échec d'authentification: vérifiez user/mot de passe, encodez les caractères spéciaux (URL-encode) et retirez les guillemets dans .env.";
  }

  if (/IP address|not authorized|whitelist|Network Access/i.test(message)) {
    return "Accès réseau refusé: ajoutez l'IP dans Atlas > Network Access (ou 0.0.0.0/0 temporairement).";
  }

  if (/Invalid|parse|connection string/i.test(message)) {
    return "URI invalide: vérifiez le format mongodb+srv://.../smove et les caractères encodés.";
  }

  return message;
}

async function main() {
  console.log("DB CHECK\n---");
  console.log(formatEnvStatus("DATABASE_URL", DATABASE_URL));
  console.log(formatEnvStatus("DIRECT_DATABASE_URL", DIRECT_DATABASE_URL));

  if (!DATABASE_URL) {
    console.error("\n❌ DATABASE_URL manquante. Ajoutez-la dans .env/.env.local.");
    process.exitCode = 1;
    return;
  }

  const warnings = analyzeMongoUrl(DATABASE_URL);
  if (warnings.length) {
    console.warn("\n⚠️  Vérifications de l'URI:");
    warnings.forEach((warning) => console.warn(`- ${warning}`));
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log("\n✅ Connexion Prisma établie.");
    await prisma.siteSettings.findFirst();
    console.log("✅ Requête simple OK (siteSettings.findFirst).");
  } catch (error) {
    console.error("\n❌ Échec de connexion Prisma.");
    console.error(summarizePrismaError(error));
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
