/** @type {import("next").NextConfig} */
const mediaRemotePatterns = [];

const addRemotePattern = (value) => {
  if (!value) return;
  try {
    const url = new URL(value);
    mediaRemotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
    });
  } catch {
    // ignore invalid URLs
  }
};

addRemotePattern(process.env.MEDIA_PUBLIC_BASE_URL);
addRemotePattern(process.env.S3_PUBLIC_BASE_URL);

const nextConfig = {
  reactStrictMode: true,
  images: mediaRemotePatterns.length
    ? {
        remotePatterns: mediaRemotePatterns,
      }
    : undefined,
};

export default nextConfig;
