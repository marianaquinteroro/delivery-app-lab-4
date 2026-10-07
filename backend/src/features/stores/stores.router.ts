import { Response, Router } from "express";
import {
  getStoreByUserIdController,
  getStoreDetailController,
  getStoresController,
} from "./stores.controller";

const router = Router();

router.get("/", getStoresController);
router.get("/:userOwnerId", getStoreByUserIdController);
router.get("/store-detail/:storeId", getStoreDetailController);

export default router;
