import { authenticateUser } from "../middleware/authenticateUser.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { addComment, deleteComment, getCardComments } from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/:cardId")
    .get(getCardComments)
    .post(authenticateUser, addComment);

router.route("/:commentId")
    .delete(deleteComment);

export default router;
