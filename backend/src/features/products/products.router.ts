import { Router } from "express";
import {
  createProductController,
  updateProductController,
} from "./products.controller";

const router = Router();

router.post("/new-product/:storeId", createProductController);
router.patch("/:productId", updateProductController);

export default router;
