import { Router } from "express";
import { createProductController } from "./products.controller";

const router = Router();

router.post("/new-product/:storeId", createProductController);

export default router;
