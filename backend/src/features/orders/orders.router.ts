import { Request, Response, Router } from "express";
import { createOrderController, getOrdersByClientIdController } from "./orders.controller";

const router = Router();

router.get("/:clientId", getOrdersByClientIdController);

router.post("/create-order", createOrderController);

export default router;
