import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";

export async function GET() {
  const result = await safePrisma((db) => db.post.count(), { timeoutMs: 2500 });

  if (!result.ok) {
    return NextResponse.json(
      { status: "error", detail: result.message, errorType: result.errorType },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: "ok", checked: "post.count" });
}
