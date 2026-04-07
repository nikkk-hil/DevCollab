import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { getBoardActivities } from "../controllers/activity.controller.js";

const router = Router();
router.use(verifyJWT)

router.route("/:boardId")
    .get(authenticateUser, getBoardActivities)

export default router;