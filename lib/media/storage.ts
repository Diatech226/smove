import { promises as fs } from "fs";
import path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { buildPublicUrl, getMediaPublicBaseUrl, getStorageKeyFromUrl, MEDIA_STORAGE, type MediaStorageType } from "./config";

export type UploadTarget = {
  key: string;
  body: Buffer;
  contentType: string;
};

export type UploadResult = {
  url: string;
};

export type StorageProvider = {
  upload: (target: UploadTarget) => Promise<UploadResult>;
  remove: (keyOrUrl: string) => Promise<void>;
  publicBaseUrl: string;
  storageType: MediaStorageType;
};

const ensureDir = async (filePath: string) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const createLocalProvider = (): StorageProvider => {
  const publicBaseUrl = getMediaPublicBaseUrl("local");
  return {
    storageType: "local",
    publicBaseUrl,
    async upload({ key, body }): Promise<UploadResult> {
      const filePath = path.join(process.cwd(), "public", "uploads", key);
      await ensureDir(filePath);
      await fs.writeFile(filePath, body);
      return { url: buildPublicUrl(`/uploads/${key}`, publicBaseUrl) };
    },
    async remove(keyOrUrl: string) {
      const key = getStorageKeyFromUrl(keyOrUrl, publicBaseUrl);
      const filePath = path.join(process.cwd(), "public", "uploads", key);
      await fs.unlink(filePath).catch(() => null);
    },
  };
};

const createS3Provider = (): StorageProvider => {
  const bucket = process.env.S3_BUCKET ?? "";
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION ?? "auto";
  const publicBaseUrl = getMediaPublicBaseUrl("s3");
  const client = new S3Client({
    region,
    endpoint: endpoint || undefined,
    forcePathStyle: Boolean(endpoint),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });

  return {
    storageType: "s3",
    publicBaseUrl,
    async upload({ key, body, contentType }): Promise<UploadResult> {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      );
      return { url: buildPublicUrl(key, publicBaseUrl) };
    },
    async remove(keyOrUrl: string) {
      const key = getStorageKeyFromUrl(keyOrUrl, publicBaseUrl);
      await client.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    },
  };
};

export const getStorageProvider = (): StorageProvider => {
  if (MEDIA_STORAGE === "s3") {
    return createS3Provider();
  }
  return createLocalProvider();
};
