import AdminLoginClient from "./AdminLoginClient";

export default function AdminLoginPage() {
  const isDev = process.env.NODE_ENV !== "production";
  const bootstrapEnabled = isDev && process.env.ADMIN_BOOTSTRAP_ENABLED === "true";

  return <AdminLoginClient bootstrapEnabled={bootstrapEnabled} />;
}
