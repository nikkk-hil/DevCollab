import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addAssignee, createCard, deleteCard, editCard, getAllCards, getFeedback, removeAssignee, updateCardProgress } from "../controllers/card.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import { verifyCardOwner } from "../middleware/verifyCardOwner.js";
import { verifyColumnExists } from "../middleware/verifyColumnExists.js";
import { moveCard } from "../controllers/card.controller.js";   

const router = Router();
router.use(verifyJWT)

router.route("/:boardId")
    .get(authenticateUser, getAllCards)

router.route("/:boardId")
    .post(authenticateUser, createCard)

router.route("/:cardId")
    .patch(verifyCardOwner, editCard)
    .delete(verifyCardOwner, deleteCard)

router.route("/:cardId/add-assignee/:assigneeId")
.patch(verifyCardOwner, addAssignee);

router.route("/:cardId/remove-assignee/:assigneeId")
    .patch(verifyCardOwner, removeAssignee);

router.route("/:cardId/board/:boardId/move/:columnId")
    .patch(verifyColumnExists, moveCard);

router.route("/:cardId/board/:boardId/update-progress")
    .patch(authenticateUser, updateCardProgress);

router.route("/:cardId/board/:boardId/ai-feedback")
    .patch(authenticateUser,getFeedback )
    
export default router