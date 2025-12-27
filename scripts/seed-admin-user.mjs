import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.env.SMOVE_ADMIN_SEED_EMAIL;
const password = process.env.SMOVE_ADMIN_SEED_PASSWORD;
const passwordHash =
  process.env.SMOVE_ADMIN_SEED_PASSWORD_HASH ||
  (password ? await bcrypt.hash(password, 10) : undefined);

if (!email) {
  console.error("SMOVE_ADMIN_SEED_EMAIL manquant. Fournissez un email pour créer le compte admin.");
  process.exit(1);
}

try {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "admin",
      status: "active",
      ...(passwordHash ? { passwordHash } : {}),
    },
    create: {
      email,
      role: "admin",
      status: "active",
      ...(passwordHash ? { passwordHash } : {}),
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log("Admin seed terminé:", user);
} catch (error) {
  console.error("Erreur lors du seed admin:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
