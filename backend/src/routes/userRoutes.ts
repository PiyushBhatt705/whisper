import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUser } from "../controller/userController";

const router = Router()

router.get("/", protectRoute, getUser)

export default router