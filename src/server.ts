import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./db/connect";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("MongoDB is connected");
    app.listen(env.PORT, () => {
      console.log(`App is listening at port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
};

startServer();
