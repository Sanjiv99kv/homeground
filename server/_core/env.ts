const isProduction = process.env.NODE_ENV === "production";

// In production, warn if critical secrets are missing
if (isProduction && !process.env.JWT_SECRET) {
  console.error("[ENV] CRITICAL: JWT_SECRET is not set in production! Sessions will not be secure.");
}

export const ENV = {
  appId: process.env.VITE_APP_ID || "homeground-local",
  cookieSecret: process.env.JWT_SECRET || (isProduction ? "" : "homeground-dev-secret-key-change-in-production"),
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
