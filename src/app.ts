import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "@config/env";
import { logger } from "@utils/logger";
import { requestLogger, autoProtect } from "@middleware/autoEncryption";
import { helmetConfig } from "@config/express/helmetConfig";
import { getCorsOptions } from "@config/express/corsConfig";
import { compressionConfig } from "@config/express/compressionConfig";
import { getRateLimitOptions } from "@config/express/rateLimitConfig";
import {
  jsonBodyParserOptions,
  urlencodedBodyParserOptions,
} from "@config/express/bodyParserConfig";

import router from "@routes/index";
import { errorHandler, notFoundHandler } from "@utils/error";

export const createApp = (): Application => {
  const app = express();
  logger.info("system", "Initializing Express application", {
    nodeEnv: config.NODE_ENV,
    baseUrl: config.BASE_URL,
    port: config.PORT,
    timestamp: new Date().toISOString(),
  });

  // Security middleware
  app.use(helmet(helmetConfig));
  logger.info("system", "Security headers configured with Helmet");

  // CORS configuration
  const corsOptions = getCorsOptions();
  app.use(cors(corsOptions));
  logger.info("system", "CORS configured", {
    origins: corsOptions.origin,
    methods: corsOptions.methods?.length,
    allowedHeaders: corsOptions.allowedHeaders?.length,
  });

  // Compression middleware
  app.use(compression(compressionConfig));
  logger.info("system", "Response compression enabled", {
    level: compressionConfig.level,
    threshold: compressionConfig.threshold,
  });

  // Rate limiting
  const limiter = rateLimit(getRateLimitOptions());
  app.use(limiter);
  logger.info("system", "Rate limiting configured", {
    windowMinutes: config.RATE_LIMIT_WINDOW ?? 15,
  });

  // Body parsing
  app.use(express.json(jsonBodyParserOptions));
  app.use(express.urlencoded(urlencodedBodyParserOptions));
  logger.info("system", "Body parsing middleware configured", {
    jsonLimit: jsonBodyParserOptions.limit,
    urlencodedLimit: urlencodedBodyParserOptions.limit,
  });

  app.use(requestLogger);
  logger.info("system", "Request logging middleware enabled");

  app.use(autoProtect);

  const baseUrl = config.BASE_URL;
  app.use(baseUrl, router);

  logger.info("system", "API routes mounted", {
    baseUrl,
    routerMounted: true,
  });

  // 404 HANDLER
  app.use(notFoundHandler)
  // GLOBAL ERROR HANDLER
  app.use(errorHandler);
  // APPLICATION READY

  logger.info("system", "Express application initialized successfully", {
    baseUrl,
    healthEndpoints: ["/health", "/health/detailed"],
    middlewares: [
      "helmet",
      "cors",
      "compression",
      "rate-limiting",
      "body-parsing",
      "request-logging",
      "error-handling",
    ],
    environment: config.NODE_ENV,
    ready: true,
  });

  return app;
};
