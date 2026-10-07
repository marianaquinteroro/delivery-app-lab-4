import { Request, Response, Router } from "express";
import { createOrderController } from "./orders.controller";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Connected " });
});

router.post("/create-order", createOrderController);

export default router;
