import express from "express";
import { notFound } from "./errors/notFound";
import { errorHandler } from "./errors/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({limit:'100kb'}));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

app.use("/auth", authRouter);

app.use(notFound);
app.use(errorHandler);
