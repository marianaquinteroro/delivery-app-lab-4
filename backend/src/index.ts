import cors from "cors";
import express, { Request, Response, Router } from "express";
import { PORT } from "./config/config";
import { initDb } from "./db/db";
import { errorHandler } from "./middlewares/errorMiddleware";
import { authMiddleware } from "./middlewares/authMiddleware";
import authRouter from "./features/auth/auth.routes";
import userRouter from "./features/users/users.router";
import storesRouter from "./features/stores/stores.router";
import ordersRouter from "./features/orders/orders.router";
import productsRouter from "./features/products/products.router";

const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = Router();
app.use("/", apiRouter);

apiRouter.use("/auth", authRouter);

apiRouter.use(authMiddleware);

apiRouter.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

apiRouter.use("/users", userRouter);
apiRouter.use("/stores", storesRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/orders", ordersRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  await initDb();
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
