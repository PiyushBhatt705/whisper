import { Router } from "express";
import { authCallback, getMe} from "../controller/authController";
import { protectRoute } from "../middleware/auth";

const router = Router()

router.get("/me",protectRoute,getMe)
router.post("/callback", authCallback)
export default router