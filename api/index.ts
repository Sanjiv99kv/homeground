import "dotenv/config";
import express from "express";

const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check (available immediately, before lazy-loaded routes)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Lazy-load the heavy route setup to catch import errors
let routesLoaded = false;
let loadError: Error | null = null;

async function loadRoutes() {
  if (routesLoaded) return;
  try {
    const { createExpressMiddleware } = await import("@trpc/server/adapters/express");
    const { registerOAuthRoutes } = await import("../server/_core/oauth");
    const { appRouter } = await import("../server/routers");
    const { createContext } = await import("../server/_core/context");

    registerOAuthRoutes(app);
    app.use(
      "/api/trpc",
      createExpressMiddleware({
        router: appRouter,
        createContext,
      })
    );
    routesLoaded = true;
  } catch (err) {
    loadError = err instanceof Error ? err : new Error(String(err));
    console.error("[API] Failed to load routes:", loadError.message, loadError.stack);
  }
}

// Middleware to ensure routes are loaded
app.use("/api/trpc", async (req, res, next) => {
  if (!routesLoaded && !loadError) {
    await loadRoutes();
  }
  if (loadError) {
    res.status(500).json({
      error: "Server initialization failed",
      message: loadError.message,
      stack: process.env.NODE_ENV !== "production" ? loadError.stack : undefined,
    });
    return;
  }
  next();
});

// Trigger route loading
loadRoutes();

export default app;
