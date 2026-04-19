import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getAgoTime } from "../utils/time";

function DraggableCard({ card, children, columnId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: card._id,
    data: {
      type: "card",
      cardId: card._id,
      columnId,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition-colors hover:border-cyan-300"
    >
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          className="rounded-md bg-slate-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 cursor-grab active:cursor-grabbing"
          aria-label="Drag card"
          {...listeners}
          {...attributes}
        >
          Drag
        </button>
      </div>
      {children}
    </article>
  );
}

function Column({ column }) {
  const [activeAssigneePopover, setActiveAssigneePopover] = useState(null);
  const title = column?.title || "Untitled Column";
  const { cards } = useSelector((state) => state.card);
  const thisColumnCards = cards.filter((card) => card.column?.toString() === column?._id?.toString());
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `column-${column?._id}`,
    data: {
      type: "column",
      columnId: column?._id,
    },
  });

  const difficultyStyles = {
    Easy: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-rose-100 text-rose-700",
  };

  return (
    <section className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {thisColumnCards.length}
        </span>
      </div>

      {thisColumnCards.length === 0 ? (
        <div
          ref={setDroppableRef}
          className={`rounded-xl border border-dashed bg-slate-50 p-4 text-sm text-slate-500 transition-colors ${
            isOver ? "border-cyan-400 bg-cyan-50/70" : "border-slate-200"
          }`}
        >
          No cards in this column yet.
        </div>
      ) : (
        <div
          ref={setDroppableRef}
          className={`space-y-3 rounded-xl p-1 transition-colors ${isOver ? "bg-cyan-50/60" : ""}`}
        >
          {thisColumnCards.map((card) => {
            const assignees = Array.isArray(card.assignees) ? card.assignees : [];
            const createdBy = card.createdBy;
            const tags = Array.isArray(card.tags) ? card.tags : [];
            const difficulty = card.difficulty || "Easy";
            const link = card.link || "";
            const createdByDisplay =
              typeof createdBy === "object" && createdBy !== null
                ? createdBy.fullName || createdBy.username || "Unknown"
                : createdBy
                  ? "User"
                  : "Unknown";

            return (
              <DraggableCard key={card._id} card={card} columnId={column?._id}>
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">{card.title}</h3>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${difficultyStyles[difficulty] || "bg-slate-200 text-slate-700"}`}
                  >
                    {difficulty}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAssigneePopover((prev) =>
                          prev === card._id ? null : card._id,
                        )
                      }
                      className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-700 transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      {assignees.length} Assignee{assignees.length === 1 ? "" : "s"}
                    </button>

                    {activeAssigneePopover === card._id && (
                      <div className="absolute left-0 top-[120%] z-20 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Assignees
                        </p>

                        {assignees.length === 0 ? (
                          <p className="text-xs text-slate-500">No assignee yet.</p>
                        ) : (
                          <div className="max-h-44 space-y-2 overflow-auto pr-1">
                            {assignees.map((assignee, idx) => {
                              const assigneeName = assignee?.fullName || "Unknown User";
                              const assigneeUsername = assignee?.username || "unknown";
                              const assigneeAvatar = assignee?.avatar || "";
                              const initial = assigneeName.trim().charAt(0).toUpperCase() || "U";

                              return (
                                <div
                                  key={assignee?._id || `${card._id}-assignee-${idx}`}
                                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5"
                                >
                                  {assigneeAvatar ? (
                                    <img
                                      src={assigneeAvatar}
                                      alt={assigneeName}
                                      className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                                      {initial}
                                    </div>
                                  )}

                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-slate-800">{assigneeName}</p>
                                    <p className="truncate text-[11px] text-slate-500">@{assigneeUsername}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setActiveAssigneePopover(null)}
                          className="mt-3 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <span
                        key={`${card._id}-tag-${idx}`}
                        className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-700">Created by:</span> {createdByDisplay}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Created:</span> {card.createdAt ? getAgoTime(card.createdAt) : "Unknown"}
                  </p>
                </div>

                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-cyan-700 hover:text-cyan-800 hover:underline"
                  >
                    Open Reference
                  </a>
                )}
              </DraggableCard>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Column;