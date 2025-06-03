import { config } from "@config/env";

export const getCorsOptions = () => ({
  origin: config.CORS_ORIGINS?.split(",") ?? ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "x-request-id",
    "x-client-version",
  ],
  exposedHeaders: ["x-request-id"],
});
