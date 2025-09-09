import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure Unity WebGL compression support
app.use((req, res, next) => {
  const url = req.url;
  
  // Handle Unity WebGL compressed files (both .br and .unityweb)
  if (url.endsWith('.data.br') || url.endsWith('.data.unityweb')) {
    res.set('Content-Type', 'application/octet-stream');
    if (url.endsWith('.br')) {
      res.set('Content-Encoding', 'br');
    }
  } else if (url.endsWith('.js.br') || url.endsWith('.js.unityweb')) {
    res.set('Content-Type', 'application/javascript');
    if (url.endsWith('.br')) {
      res.set('Content-Encoding', 'br');
    }
  } else if (url.endsWith('.wasm.br') || url.endsWith('.wasm.unityweb')) {
    res.set('Content-Type', 'application/wasm');
    if (url.endsWith('.br')) {
      res.set('Content-Encoding', 'br');
    }
  }
  
  // Ensure .unityweb files get proper content types even if not matched above
  if (url.includes('.unityweb')) {
    if (url.includes('.data.')) {
      res.set('Content-Type', 'application/octet-stream');
    } else if (url.includes('.framework.js.') || url.includes('.js.')) {
      res.set('Content-Type', 'application/javascript');
    } else if (url.includes('.wasm.')) {
      res.set('Content-Type', 'application/wasm');
    }
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Try to start the Telegram bot (will be disabled if token is missing)
  try {
    await import("./telegram-bot");
  } catch (error) {
    console.log("Telegram bot not started - this is normal if no token is provided");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
