import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addAssignee, createCard, deleteCard, editCard, getAllCards, removeAssignee } from "../controllers/card.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { verifyCardOwner } from "../middleware/verifyCardOwner.js";

const router = Router();
router.use(verifyJWT)

router.route("/:boardId")
    .get(getAllCards)

router.route("/:boardId/column/:columnId")
    .post(authenticateUser, createCard)

router.route("/:cardId")
    .patch(verifyCardOwner, editCard)
    .delete(verifyCardOwner, deleteCard)

router.route("/:cardId/add-assignee/:assigneeId")
.patch(verifyCardOwner, addAssignee);

router.route("/:cardId/remove-assignee/:assigneeId")
    .patch(verifyCardOwner, removeAssignee);

export default router