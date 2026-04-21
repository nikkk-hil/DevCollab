import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAgoTime } from "../utils/time";

function Board({
  board,
  onRemoveMember,
  onDeleteBoard,
  actionLoading,
  actionError,
}) {
  // Challenge A:
  // Decide what belongs in Board and what belongs in Home.
  // Puzzle: Should Board own API calls, or should parent pass callbacks?

  // Challenge B:
  // Navigation behavior:
  // How will you keep card-click navigation while preventing navigation
  // when user clicks member popover buttons?

  // Challenge C:
  // Members data contract:
  // Backend may return ObjectId or populated user object.
  // How will you normalize safely before rendering avatar/fullName/username?

  // Challenge D:
  // Remove member UX:
  // Add confirmation? disable only clicked member remove button?
  // How do you show per-member error without affecting other members?

  // Challenge E:
  // Accessibility:
  // Popover should close on outside click and Escape.
  // How will you implement it without memory leaks?

  // Challenge F:
  // Race safety:
  // If user double-clicks remove/delete, how will you guard duplicate requests?

  const navigate = useNavigate();
  const [showMembersPopover, setShowMembersPopover] = useState(false);

  const boardTitle = board?.title || "Untitled Board";
  const boardType = board?.type || "general";
  const owner = board?.owner ? {...board.owner, isOwner: true} : {};
  const membersList = Array.isArray(board?.members) ? [...board.members, owner] : [owner];
  const createdAt = board?.createdAt ? getAgoTime(board.createdAt) : "Unknown";

  const boardInitial = boardTitle.trim().charAt(0).toUpperCase() || "B";
  // TODO: implement click-to-open-board behavior.
  // Hint: navigate(`/board/${board?._id}`)
  const goToBoard = () => navigate(`/board/${board?._id}`);
  const removedMemberIds = new Set();

  const removeMember = (memberId) => {
    if (typeof onRemoveMember === "function") onRemoveMember(board?._id, memberId);
  }

  const deleteBoard = () => {
    if (typeof onDeleteBoard === "function") onDeleteBoard(board?._id);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={goToBoard}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToBoard();
        }
      }}
      className={`group relative cursor-pointer overflow-visible rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${showMembersPopover ? "z-30" : ""}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-500/30 to-sky-400/10 blur-2xl" />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          deleteBoard();
        }}
        disabled={actionLoading}
        aria-label="Delete board"
        title="Delete board"
        className="absolute right-3 top-3 z-20 rounded-full border border-rose-400/40 bg-rose-500/10 p-1.5 text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>

      <div className="relative flex items-start justify-between gap-4 pr-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-lg font-bold text-white shadow-md">
            {boardInitial}
          </div>

          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-slate-100">
              {boardTitle}
            </h3>
            <p className="text-xs tracking-wide text-slate-400">Board Workspace</p>
          </div>
        </div>

        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium capitalize text-cyan-300">
          {boardType}
        </span>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Created
          </p>
          <p className="text-sm font-semibold text-slate-200">{createdAt}</p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Members
          </p>
          <div className="relative mt-1 z-10">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowMembersPopover((prev) => !prev);
              }}
              className="rounded-full bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30"
            >
              {membersList.length} Members
            </button>

            {showMembersPopover && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-cyan-500/35 bg-slate-900/95 p-3 text-left shadow-2xl shadow-black/60 backdrop-blur"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Board Members
                </p>

                {membersList.length === 0 ? (
                  <p className="text-xs text-slate-400">No additional members.</p>
                ) : (
                  <div className="max-h-56 space-y-2 overflow-auto pr-1">
                    {membersList.map((member, idx) => {
                      const memberId = typeof member === "object" ? member?._id : member;
                      const fullName = typeof member === "object" ? member?.fullName || "Unknown User" : "Unknown User";
                      const username = typeof member === "object" ? member?.username || "unknown" : "unknown";
                      const avatar = typeof member === "object" ? member?.avatar || "" : "";
                      const initial = fullName.trim().charAt(0).toUpperCase() || "U";
                      const isOwner = typeof member === "object" ? member?.isOwner : false;

                      return (
                        <div
                          key={memberId || `${board?._id}-member-${idx}`}
                          className="flex items-center justify-between gap-2 rounded-lg bg-slate-800 px-2 py-1.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={fullName}
                                className="h-8 w-8 rounded-full border border-slate-600 object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-300">
                                {initial}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-100">{fullName}</p>
                              <p className="truncate text-[11px] text-slate-400">@{username} {isOwner && <span className="text-cyan-300"> ~ Admin</span>}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            hidden={isOwner}
                            disabled={removedMemberIds.has(memberId)}
                            onClick={(event) => {
                              event.stopPropagation();
                              removedMemberIds.add(memberId);
                              removeMember(memberId);
                              removedMemberIds.delete(memberId);
                              // TODO: wire remove-member callback here.
                              // Question: Should owner be removable? If not, how will you enforce in UI + backend?
                              // Example wiring idea:
                              // if (typeof onRemoveMember === "function") onRemoveMember(board?._id, memberId)
                            }}
                            className="rounded-md bg-rose-500/20 px-2 py-1 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/30"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {actionError && <p className="relative mt-3 text-xs font-medium text-rose-300">{actionError}</p>}
    </article>
  );
}

export default Board;
