import { Response, Router } from "express";
import {
  getStoreByUserIdController,
  getStoreDetailController,
  getStoresController,
} from "./stores.controller";

const router = Router();

router.get("/", getStoresController);
router.get("/store-detail/:storeId", getStoreDetailController);
// router.get("/owner/:userId", getStoreByUserIdController);

export default router;
