import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addAssignee, createCard, deleteCard, editCard, getAllCards, removeAssignee } from "../controllers/card.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { verifyCardOwner } from "../middleware/verifyCardOwner.js";
import { verifyColumnExists } from "../middleware/verifyColumnExists.js";
import { moveCard } from "../controllers/card.controller.js";   

const router = Router();
router.use(verifyJWT)

router.route("/:boardId")
    .get(authenticateUser, getAllCards)

router.route("/:boardId/column/:columnId")
    .post(authenticateUser,verifyColumnExists, createCard)

router.route("/:cardId")
    .patch(verifyCardOwner, editCard)
    .delete(verifyCardOwner, deleteCard)

router.route("/:cardId/add-assignee/:assigneeId")
.patch(verifyCardOwner, addAssignee);

router.route("/:cardId/remove-assignee/:assigneeId")
    .patch(verifyCardOwner, removeAssignee);

router.route("/:cardId/board/:boardId/move/:columnId")
    .patch(verifyColumnExists, moveCard);
    
export default router