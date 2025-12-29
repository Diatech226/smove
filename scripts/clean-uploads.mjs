import { rm } from "fs/promises";
import path from "path";

const uploadsPath = path.join(process.cwd(), "public", "uploads");

try {
  await rm(uploadsPath, { recursive: true, force: true });
  console.log(`Uploads supprimés: ${uploadsPath}`);
} catch (error) {
  console.error("Impossible de supprimer le dossier uploads.", error);
  process.exitCode = 1;
}
