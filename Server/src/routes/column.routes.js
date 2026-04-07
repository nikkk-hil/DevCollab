import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyBoardOwner } from "../middleware/verifyBoardOwner.middleware.js";
import { verifyColumnExists } from "../middleware/verifyColumnExists.js";
import {
  createColumn,
  deleteColumn,
  editColumn,
  getBoardColumn,
} from "../controllers/column.controller.js";

const router = Router();

router
  .route("/:boardId")
  .get(verifyJWT, getBoardColumn) // ask to claude if needed that check whether user is present in either owner or member of board
  .post(verifyJWT, verifyBoardOwner, createColumn);

router
  .route("/:boardId/column/:columnId")
  .patch(verifyJWT, verifyBoardOwner,verifyColumnExists, editColumn)
  .delete(verifyJWT, verifyBoardOwner,verifyColumnExists, deleteColumn);

export default router;
