import { Router } from "express";
import { getStoresController } from "./stores.controller";

const router = Router();

router.get("/", getStoresController);

export default router;
