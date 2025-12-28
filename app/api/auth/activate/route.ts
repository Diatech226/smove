import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import { z } from "zod";

import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { safePrisma } from "@/lib/safePrisma";

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

  const userResult = await safePrisma((db) =>
    db.user.findFirst({
      where: {
        inviteTokenHash: tokenHash,
        inviteExpiresAt: { gt: new Date() },
        status: "pending",
      },
      select: {
        id: true,
      },
    }),
  );

  if (!userResult.ok) {
    console.error("Activate database error", { requestId, detail: userResult.message });
    return jsonError("Connexion à la base de données impossible.", {
      status: 503,
      requestId,
      data: { detail: userResult.message },
    });
  }

  const user = userResult.data;

  if (!user) {
    return jsonError("Lien d'activation invalide ou expiré.", { status: 400, requestId });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const updateResult = await safePrisma((db) =>
    db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        status: "active",
        inviteTokenHash: null,
        inviteExpiresAt: null,
      },
    }),
  );

  if (!updateResult.ok) {
    console.error("Activate update error", { requestId, detail: updateResult.message });
    return jsonError("Connexion à la base de données impossible.", {
      status: 503,
      requestId,
      data: { detail: updateResult.message },
    });
  }

  return jsonOk({}, { status: 200, requestId });
}

export const dynamic = "force-dynamic";
