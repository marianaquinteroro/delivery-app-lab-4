import express, { Request, Response, Router } from "express";
import userRouter from "./features/users/users.router";
import storesRouter from "./features/stores/stores.router";
import ordersRouter from "./features/orders/orders.router";
import { initDb } from "./db/db";
import { errorHandler } from "./middlewares/errorMiddleware";
import authRouter from "./features/auth/auth.routes";

const PORT = process.env.PORT || 8080;
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const apiRouter = Router();
app.use("/", apiRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/stores", storesRouter);
apiRouter.use("/orders", ordersRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  await initDb();
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
