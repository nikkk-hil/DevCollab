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
  const members = membersList.length;
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
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-cyan-200/60 to-sky-300/20 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-md">
            {boardInitial}
          </div>

          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
              {boardTitle}
            </h3>
            <p className="text-xs tracking-wide text-slate-500">Board Workspace</p>
          </div>
        </div>

        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium capitalize text-cyan-700">
          {boardType}
        </span>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Created
          </p>
          <p className="text-sm font-semibold text-slate-800">{createdAt}</p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Members
          </p>
          <div className="relative mt-1">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowMembersPopover((prev) => !prev);
              }}
              className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-200"
            >
              {members} Members
            </button>

            {showMembersPopover && (
              <div
                className="absolute right-0 top-[120%] z-20 w-72 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Board Members
                </p>

                {membersList.length === 0 ? (
                  <p className="text-xs text-slate-500">No additional members.</p>
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
                          className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2 py-1.5"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            {avatar ? (
                              <img
                                src={avatar}
                                alt={fullName}
                                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                                {initial}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800">{fullName}</p>
                              <p className="truncate text-[11px] text-slate-500">@{username} {isOwner && <span className="text-cyan-600"> ~ Admin</span>}</p>
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
                            className="rounded-md bg-rose-100 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-200"
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

      <div className="relative mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Board Actions
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              deleteBoard();
              // TODO: wire delete-board callback.
              // Puzzle: Where should confirmation live, in parent or this component?
              // Example wiring idea:
              // if (typeof onDeleteBoard === "function") onDeleteBoard(board._id)
            }}
            disabled={actionLoading}
            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Delete Board
          </button>
        </div>

        {actionError && <p className="mt-2 text-xs font-medium text-rose-600">{actionError}</p>}
      </div>
    </article>
  );
}

export default Board;
