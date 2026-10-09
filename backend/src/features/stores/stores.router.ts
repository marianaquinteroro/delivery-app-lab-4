import { Response, Router } from "express";
import {
  getStoreByUserIdController,
  getStoreDetailController,
  getStoresController,
  updateStoreStatusController,
} from "./stores.controller";

const router = Router();

router.get("/", getStoresController);
router.get("/:userOwnerId", getStoreByUserIdController);
router.get("/store-detail/:storeId", getStoreDetailController);
router.patch("/:storeId/status", updateStoreStatusController);

export default router;
