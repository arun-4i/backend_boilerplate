import dotenv from "dotenv";

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000"),
  BASE_URL: process.env.BASE_URL || "/api/v1",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "http://localhost:3000",

  // Database
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || "",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "12"),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || "15"),
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || "100"
  ),
  MASTER_ENCRYPTION_KEY: process.env.MASTER_ENCRYPTION_KEY || "",
  ENCRYPTION_ENABLED: process.env.ENCRYPTION_ENABLED !== "false",

  // Logger
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_DIR: process.env.LOG_DIR || "logs",
  LOG_BASE_FILENAME: process.env.LOG_BASE_FILENAME || "app",
  LOG_MAX_SIZE: process.env.LOG_MAX_SIZE || "10m",
  LOG_DATE_PATTERN: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD-HH",
  LOG_CONSOLE_ENABLED: process.env.LOG_CONSOLE_ENABLED || "false",
  LOG_FILE_ENABLED: process.env.LOG_FILE_ENABLED || "true",
  LOG_JSON_PRETTY: process.env.LOG_JSON_PRETTY || "false",
};

// Validate required environment variables
const requiredEnvVars = [
  "DB_CONNECTION_STRING",
  "JWT_SECRET",
  // Logger essentials (mark as required if you want to enforce presence, else leave as optional with defaults)
  // "LOG_LEVEL",
  // "LOG_DIR",
  // "LOG_BASE_FILENAME",
  // "LOG_MAX_SIZE",
  // "LOG_DATE_PATTERN",
  // "LOG_CONSOLE_ENABLED",
  // "LOG_FILE_ENABLED",
  // "LOG_JSON_PRETTY",
];
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !config[envVar as keyof typeof config]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}
