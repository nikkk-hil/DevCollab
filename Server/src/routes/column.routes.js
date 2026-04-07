import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyBoardOwner } from "../middleware/verifyBoardOwner.middleware.js";
import { verifyColumnExists } from "../middleware/verifyColumnExists.js";
import { authenticateUser } from "../middleware/authenticateUser.js";
import {
  createColumn,
  deleteColumn,
  editColumn,
  getBoardColumn,
} from "../controllers/column.controller.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:boardId")
  .get(authenticateUser, getBoardColumn) // ask to claude if needed that check whether user is present in either owner or member of board
  .post(verifyBoardOwner, createColumn);

router
  .route("/:boardId/column/:columnId")
  .patch(verifyBoardOwner,verifyColumnExists, editColumn)
  .delete(verifyBoardOwner,verifyColumnExists, deleteColumn);

export default router;
