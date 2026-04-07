import { authenticateUser } from "../middleware/authenticateUser.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { createComment, deleteComment, getCardComments } from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/board/:boardId/card/:cardId")
    .get(authenticateUser, getCardComments)
    .post(authenticateUser, createComment);

router.route("/:commentId")
    .delete(deleteComment);

export default router;
