import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyBoardOwner } from "../middleware/verifyBoardOwner.middleware.js";
import {
  getAllBoards,
  createBoard,
  addMemberToBoard,
  removeMemberFromBoard,
  deleteBoard,
} from "../controllers/board.controller.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, getAllBoards)
  .post(verifyJWT, createBoard);

router
  .route("/:boardId/member/:memberId")
  .patch(verifyJWT,verifyBoardOwner, addMemberToBoard)
  .delete(verifyJWT,verifyBoardOwner, removeMemberFromBoard);

router
  .route("/:boardId")
  .delete(verifyJWT,verifyBoardOwner, deleteBoard);

export default router;
