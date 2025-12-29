"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        subtitle="Centralisez vos images et vidéos pour le CMS."
      />
      <MediaLibrary />
    </div>
  );
}
