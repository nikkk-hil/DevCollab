import { useDispatch, useSelector } from "react-redux";
import Board from "./Board.jsx";
import HomeHeader from "./HomeHeader.jsx";
import { useEffect, useState } from "react";
import { createBoard, deleteBoard, getBoards, removeMemberFromBoard } from "../api/board.js";
import { addBoard, clearBoard, removeBoard, updateBoard } from "../store/slices/boardSlice.js";
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
  const [loading, setLoading] = useState(true);
  const { boards } = useSelector((state) => state.board);
  const [boardTitle, setBoardTitle] = useState("");
  const [boardType, setBoardType] = useState("DSA")
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false)
  const [apiCalling, setApiCalling] = useState(false)
  const [boardError, setBoardError] = useState("")


  // Challenge 2:
  // Fetch boards on mount.
  // Question: where should source-of-truth live, API state or Redux state?
  // Implement a fetchBoards() that handles loading, success, and failure states.

  useEffect(() => {
    (async () => {
      try {
        console.log(boards);
        if (boards.length === 0) setLoading(true);
        const res = await getBoards();
        console.log(res.data.data);
        res.data.data.forEach((board) => dispatch(addBoard(board)));
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load boards. Please refresh.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [boards.length, dispatch]);

  // Challenge 3:
  // Fetch recent activities for notifications.
  // Puzzle: How will you merge activity lists from multiple boards and keep newest first?

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
            error.response?.data?.message ||
            "Failed to logout. Please try again."
        );
    } finally {
        setLoggingOut(false);
    }
  }

  // Challenge 4:
  // Implement logout flow.
  // Ask yourself: after logout succeeds, which slices must be cleared to avoid stale UI?

  // Challenge 5:
  // Implement create-board submit flow.
  // Question: where should validation happen first, frontend or backend? (answer: both)

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
        setBoardTitle("");
        setBoardType("DSA");
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to create board. Please try again."
        );
    } finally {
        setApiCalling(false);
    }
  }

  // Challenge 6:
  // Wire board actions (remove member, delete board).
  // Puzzle: how will you avoid one board button showing loading for all boards?

  const handleRemoveMember = async (boardId, memberId) => {
    try {
        setBoardError("");
        setApiCalling(true)
        const res = await removeMemberFromBoard(boardId, memberId)
        dispatch(updateBoard(res.data.data));
    } catch (error) {
        setBoardError(
            error.response?.data?.message ||
            "Failed to remove member. Please try again."
        );
    } finally {
        setApiCalling(false);
    }
  }
  
  const handleDeleteBoard = async (boardId) => {
    try {
        setBoardError("")
        setApiCalling(true)
        await deleteBoard(boardId)
        dispatch(removeBoard(boardId));

    } catch (error) {
        setBoardError(
            error.response?.data?.message ||
            "Failed to delete board. Please try again."
        );
    } finally {
        setApiCalling(false);
    }
  }
  // Challenge 7:
  // Think interviewer mode:
  // "How do you avoid race conditions when user clicks create/delete rapidly?"
  // Implement disable/guard logic and idempotent UI updates.

  if (loading) return(
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-slate-300">Loading...</div>
    </div>
  )

  return (
    <section className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <HomeHeader
          // TODO: implement logout handler and pass it here.
          onLogout={() => {handleLogout()}}
          // TODO: bind actual logout loading state.
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

        {/* TODO: render API/global error state here after you implement data flow. */}
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
                // TODO: wire remove-member action from members popover in Board component.
                onRemoveMember={(boardId, memberId) => {handleRemoveMember(boardId, memberId)}}
                // TODO: wire delete-board action.
                onDeleteBoard={(boardId) => {handleDeleteBoard(boardId)}}
                // TODO: connect board-specific loading map, not a single global boolean.
                actionLoading={apiCalling}
                // TODO: pass board-specific error text.
                actionError={boardError}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeComponent;
