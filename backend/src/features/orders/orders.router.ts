import { Router } from "express";
import { requireRole } from "../../middlewares/authMiddleware";
import {
  acceptOrderController,
  createOrderController,
  getActiveDeliveryOrderController,
  getAvailableOrdersController,
  getOrderDetailController,
  getOrdersByClientIdController,
  getOrdersByStoreIdController,
  updateCourierLocationController,
} from "./orders.controller";

const router = Router();

router.get("/available", requireRole("delivery"), getAvailableOrdersController);
router.get(
  "/delivery/active",
  requireRole("delivery"),
  getActiveDeliveryOrderController,
);
router.get(
  "/store/:storeId",
  requireRole("store"),
  getOrdersByStoreIdController,
);
router.get("/detail/:orderId", getOrderDetailController);
router.get("/:clientId", getOrdersByClientIdController);

router.post("/create-order", requireRole("consumer"), createOrderController);

router.patch(
  "/:orderId/accept",
  requireRole("delivery"),
  acceptOrderController,
);
router.patch(
  "/:orderId/location",
  requireRole("delivery"),
  updateCourierLocationController,
);

export default router;
