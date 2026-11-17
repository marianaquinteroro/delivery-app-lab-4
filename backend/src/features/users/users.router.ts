import { Router } from "express";
import { getUserByIdController, getUsersController } from "./users.controller";

const router = Router();

router.get("/", getUsersController);
router.get("/:id", getUserByIdController);

export default router;
