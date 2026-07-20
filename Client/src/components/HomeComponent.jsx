import { useDispatch, useSelector } from "react-redux";
import Board from "./Board.jsx";
import HomeHeader from "./HomeHeader.jsx";
import { useEffect, useState } from "react";
import {
  createBoard,
  deleteBoard,
  getBoards,
  removeMemberFromBoard,
} from "../api/board.js";
import {
  addBoard,
  clearBoard,
  removeBoard,
  setBoard,
  updateBoard,
} from "../store/slices/boardSlice.js";
import { logoutUser } from "../api/auth.js";
import { logout } from "../store/slices/authSlice.js";
import { clearColumns } from "../store/slices/columnSlice.js";
import { clearCards } from "../store/slices/cardSlice.js";
import { clearActivities } from "../store/slices/activitySlice.js";

function HomeComponent() {
  // Challenge 1:
  // Which state values do you need here for:
  // - loading home data
  // - create-board form
  // - logout in header
  // - notifications panel
  // - per-board action loading/error
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { boards } = useSelector((state) => state.board);
  console.log(boards);
  const [boardTitle, setBoardTitle] = useState("");
  const [boardType, setBoardType] = useState("DSA");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [apiCalling, setApiCalling] = useState(false);
  const [boardError, setBoardError] = useState("");

  const [boardState, setBoardState] = useState({});

  // Challenge 2:
  // Fetch boards on mount.
  // Question: where should source-of-truth live, API state or Redux state?
  // Implement a fetchBoards() that handles loading, success, and failure states.

  const resetBoardState = () => {
    const initialState = {};

    boards.forEach((board) => {
      initialState[board._id] = {
        apiCalling: false,
        error: "",
      };
    });

    setBoardState(initialState);
  }

  useEffect(() => {
    console.log("Inside useEffect.");
    resetBoardState();

    (async () => {
      try {
        if (boards.length === 0) setLoading(true);
        const res = await getBoards();
        dispatch(setBoard(res.data.data));
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load boards. Please refresh.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser();
      dispatch(logout());
      dispatch(clearBoard());
      dispatch(clearColumns());
      dispatch(clearCards());
      dispatch(clearActivities());
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to logout. Please try again.",
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (!boardTitle.trim()) {
        setError("Board title is required.");
        return;
      }
      if (!["DSA", "Project"].some((e) => e === boardType.trim())) {
        setError("Invalid board type.");
        return;
      }
      setApiCalling(true);
      const res = await createBoard({ title: boardTitle, type: boardType });
      dispatch(addBoard(res.data.data));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create board. Please try again.",
      );
    } finally {
      setApiCalling(false);
      setBoardTitle("");
      setBoardType("DSA");
    }
  };

  // Challenge 6:
  // Wire board actions (remove member, delete board).
  const handleRemoveMember = async (boardId, memberId) => {
    try {
        resetBoardState();
        setBoardState( prev => ({
        ...prev,
        [boardId]: {apiCalling: true, error: ""}
      }))
      const res = await removeMemberFromBoard(boardId, memberId);
      dispatch(updateBoard(res.data.data));
    } catch (error) {
      const err = error.response?.data?.message ||
          "Failed to remove member. Please try again."
      setBoardState( prev => ({
        ...prev,
        [boardId]: {...prev[boardId], error: err}
      }))
    } finally {
      setBoardState( prev => ({
        ...prev,
        [boardId]: {...prev[boardId], apiCalling: false}
      }))
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      resetBoardState();
      setBoardState( prev => ({
        ...prev,
        [boardId]: {apiCalling: true, error: ""}
      }))
      await deleteBoard(boardId);
      dispatch(removeBoard(boardId));
    } catch (error) {
      const err = error.response?.data?.message ||
          "Failed to delete board. Please try again.";
      console.log(err);
      setBoardState( prev => ({
        ...prev,
        [boardId]: { ...prev[boardId], error: err,}
      }))
    } finally {
      setBoardState( prev => ({
        ...prev,
        [boardId]: {...prev[boardId], apiCalling: false},
      }))
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-300">Loading...</div>
      </div>
    );

  return (
    <section className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <HomeHeader
          onLogout={handleLogout}
          isLoggingOut={loggingOut}
        />

        <form
          // TODO: implement create-board submit flow.
          onSubmit={handleCreateBoard}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-100">Create New Board</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
            <input
              type="text"
              placeholder="Enter board title"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring"
            />
            <select
              value={boardType}
              onChange={(e) => setBoardType(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 focus:ring"
            >
              <option value="DSA">DSA</option>
              <option value="Project">Project</option>
            </select>
            <button
              type="submit"
              disabled={apiCalling}
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
            >
              Add Board
            </button>
          </div>
        </form>

        {error && <div className="text-red-400">{error}</div>}

        {boards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
            No boards available. Create your first board.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {boards.map((board) => (
              <Board
                key={board._id}
                board={board}
                onRemoveMember={(boardId, memberId) => {
                  handleRemoveMember(boardId, memberId);
                }}
                onDeleteBoard={(boardId) => {
                  handleDeleteBoard(boardId);
                }}
                actionLoading={boardState[board._id]?.apiCalling || false}
                actionError={boardState[board._id]?.error || ""}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeComponent;
