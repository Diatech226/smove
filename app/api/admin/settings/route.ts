import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { buildSiteSettingsPayload, DEFAULT_SITE_SETTINGS, hydrateSiteSettings, SETTINGS_KEY } from "@/lib/siteSettings";
import { safePrisma } from "@/lib/safePrisma";
import { siteSettingsSchema } from "@/lib/validation/settings";

export async function GET() {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const settingsResult = await safePrisma((db) => db.siteSettings.findUnique({ where: { key: SETTINGS_KEY } }));

  if (!settingsResult.ok) {
    console.error("Failed to load site settings", { requestId, detail: settingsResult.message });
    return jsonWithRequestId(
      { success: false, error: "Database unreachable", detail: settingsResult.message },
      { status: 503, requestId },
    );
  }

  if (!settingsResult.data) {
    const createResult = await safePrisma((db) =>
      db.siteSettings.create({
        data: {
          key: SETTINGS_KEY,
          ...buildSiteSettingsPayload(DEFAULT_SITE_SETTINGS),
        },
      }),
    );

    if (!createResult.ok) {
      console.error("Failed to create default site settings", { requestId, detail: createResult.message });
      return jsonWithRequestId(
        { success: false, error: "Database unreachable", detail: createResult.message },
        { status: 503, requestId },
      );
    }

    return jsonWithRequestId(
      { success: true, settings: hydrateSiteSettings(createResult.data as any) },
      { status: 200, requestId },
    );
  }

  return jsonWithRequestId(
    { success: true, settings: hydrateSiteSettings(settingsResult.data as any) },
    { status: 200, requestId },
  );
}

export async function PUT(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const json = await request.json().catch(() => null);
  const parsed = siteSettingsSchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonWithRequestId({ success: false, error: message }, { status: 400, requestId });
  }

  const payload = buildSiteSettingsPayload(parsed.data);

  const updateResult = await safePrisma((db) =>
    db.siteSettings.upsert({
      where: { key: SETTINGS_KEY },
      create: { key: SETTINGS_KEY, ...payload },
      update: payload,
    }),
  );

  if (!updateResult.ok) {
    console.error("Failed to update site settings", { requestId, detail: updateResult.message });
    return jsonWithRequestId(
      { success: false, error: "Database unreachable", detail: updateResult.message },
      { status: 503, requestId },
    );
  }

  return jsonWithRequestId(
    { success: true, settings: hydrateSiteSettings(updateResult.data as any) },
    { status: 200, requestId },
  );
}
