import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import { z } from "zod";

import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { prisma } from "@/lib/prisma";

const activateSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string().min(8, "Mot de passe trop court (8 caractères min.)"),
});

export async function POST(request: Request) {
  const requestId = createRequestId();
  const json = await request.json().catch(() => null);
  const parsed = activateSchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const { token, password } = parsed.data;
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      inviteTokenHash: tokenHash,
      inviteExpiresAt: { gt: new Date() },
      status: "pending",
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return jsonError("Lien d'activation invalide ou expiré.", { status: 400, requestId });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      status: "active",
      inviteTokenHash: null,
      inviteExpiresAt: null,
    },
  });

  return jsonOk({}, { status: 200, requestId });
}

export const dynamic = "force-dynamic";
