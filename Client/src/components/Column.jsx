import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { getAgoTime } from "../utils/time";
import { deleteCard } from "../api/card";
import { removeCard } from "../store/slices/cardSlice";

function Column({ title, columnKey, status, setShowFeedback, setShowNotes }) {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card);
  const columnTitle = title || "Untitled Column";
  const thisColumnCards = Array.isArray(card[columnKey]) ? card[columnKey] : [];
  const [deletingCard, setDeletingCard] = useState(false);

  const difficultyStyles = {
    Easy: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-rose-100 text-rose-700",
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setDeletingCard(true);
      await deleteCard(cardId);
      dispatch(removeCard({ cardId, from: status }));
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          "Failed to delete card. Please try again.",
      );
    } finally {
      setDeletingCard(false);
    }
  };

  return (
    <section className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-100">{columnTitle}</h2>
        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300">
          {thisColumnCards.length}
        </span>
      </div>

      {/* Each status lane is a Droppable area. */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 rounded-xl p-1 ${
              snapshot.isDraggingOver ? "bg-cyan-500/10" : ""
            }`}
          >
            {thisColumnCards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 text-sm text-slate-400">
                No cards in this column yet.
              </div>
            ) : (
              thisColumnCards.map((card, index) => {
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
                const notes = card.notes || null;
                const hasNotes =
                  notes &&
                  Object.values(notes).some((value) =>
                    String(value || "").trim(),
                  );
                // const aiFeedback = card.aiFeedback || ""

                return (
                  // Each card is draggable; index is required by the library.
                  <Draggable
                    key={card._id}
                    draggableId={String(card._id)}
                    index={index}
                  >
                    {(dragProvided, dragSnapshot) => (
                      <article
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        // Drag handle props are applied to the full card for now.
                        {...dragProvided.dragHandleProps}
                        className={`rounded-xl border border-slate-700 bg-slate-900 p-3 transition-colors hover:border-cyan-500/60 ${
                          dragSnapshot.isDragging ? "opacity-70" : ""
                        }`}
                        style={dragProvided.draggableProps.style}
                      >
                        <h3 className="line-clamp-2 text-sm font-semibold text-slate-100">
                          {card.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                              difficultyStyles[difficulty] ||
                              "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {difficulty}
                          </span>
                        </div>

                        {tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {tags.map((tag, idx) => (
                              <span
                                key={`${card._id}-tag-${idx}`}
                                className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3">
                          {status === "completed" && hasNotes && (
                            <button
                              onClick={() => setShowNotes(card._id)}
                              className="inline-block cursor-pointer text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                            >
                              Notes
                            </button>
                          )}
                          {status === "completed" && (
                            <button
                              onClick={() => setShowFeedback(card._id)}
                              className="inline-block cursor-pointer text-xs font-semibold text-blue-400 hover:text-blue-300"
                            >
                              Feedback
                            </button>
                          )}
                        </div>

                        <div className="mt-3 space-y-1 text-xs text-slate-300">
                          <p>
                            <span className="font-semibold text-slate-200">
                              Created by:
                            </span>{" "}
                            {createdByDisplay}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-200">
                              Created:
                            </span>{" "}
                            {card.createdAt
                              ? getAgoTime(card.createdAt)
                              : "Unknown"}
                          </p>
                        </div>

                        <div className="flex justify-between">
                          {link ? (
                            <a
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-block text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:underline"
                            >
                              Open Reference
                            </a>
                          ) : (
                            <div />
                          )}
                          <button
                            onClick={() => handleDeleteCard(card._id)}
                            disabled={deletingCard}
                            className="mt-3 inline-block cursor-pointer text-xs font-semibold text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    )}
                  </Draggable>
                );
              })
            )}
            {/* Placeholder keeps layout stable while dragging. */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}

export default Column;
