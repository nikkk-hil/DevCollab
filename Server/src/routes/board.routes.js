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
router.use(verifyJWT);

router
  .route("/")
  .get(getAllBoards)
  .post(createBoard);

router
  .route("/:boardId/member/:memberId")
  .patch(verifyBoardOwner, addMemberToBoard)
  .delete(verifyBoardOwner, removeMemberFromBoard);

router
  .route("/:boardId")
  .delete(verifyBoardOwner, deleteBoard);

export default router;
