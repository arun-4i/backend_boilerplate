import { DatabaseConnection } from "@config/database";
import { config } from "@config/env";
import { createApp } from "./app";

const startServer = async (): Promise<void> => {
  try {
    const sequelize = DatabaseConnection.getInstance();
    // Authenticate DB connection
    await sequelize.authenticate();
    const dbDialect = config.DB_CONNECTION_STRING.split(":")[0];
    console.log(`${dbDialect} DataBase Connection Establish !!!!`);

    // Sync database (only in development)
    if (config.NODE_ENV === "development") {
      await sequelize.sync({ logging: false });
      console.log("DataBase Sync complete !!!\n");
    }

    // Create Express app
    const app = createApp();

    // Start HTTP server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📊 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 Base URL: localhost:${config.PORT}${config.BASE_URL}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 ${signal} received, shutting down gracefully...`);

      server.close(async () => {
        console.log("📡 HTTP server closed");

        try {
          await DatabaseConnection.closeConnection();
          console.log("✅ Shutdown complete");
          process.exit(0);
        } catch (error) {
          console.error("❌ Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});
