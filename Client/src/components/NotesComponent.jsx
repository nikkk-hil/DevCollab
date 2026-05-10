import React from "react";
import { useSelector } from "react-redux";

function NotesComponent({ setShowNotes, showNotes }) {
  const cards = useSelector((state) => state.card);
  let pickedNotes = null;
  let pickedTitle = "";

  Object.keys(cards).forEach((status) => {
    cards[status].forEach((card) => {
      if (card?._id?.toString?.() === showNotes?.toString?.()) {
        pickedNotes = card.notes || null;
        pickedTitle = card.title || "";
      }
    });
  });

  const notes = pickedNotes || {};
  const approach = notes.approach || "Not added yet.";
  const struggles = notes.struggles || "Not added yet.";
  const timeComplexity = notes.timeComplexity || "Not added yet.";
  const spaceComplexity = notes.spaceComplexity || "Not added yet.";
  const takeaway = notes.takeaway || "Not added yet.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-title"
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-800/80 shadow-2xl">
        <div className="pointer-events-none absolute -top-14 right-6 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-blue-400/15 blur-3xl" />

        <header className="relative flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/70 px-6 py-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">
              Notes Lab
            </p>
            <h2
              id="notes-title"
              className="text-2xl font-semibold text-slate-100"
              style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
            >
              Notes snapshot
            </h2>
            <p className="max-w-xl text-sm text-slate-300">
              {pickedTitle ? `For ${pickedTitle}` : "Review your saved notes."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNotes(null)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 bg-slate-950/60 text-lg text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
            aria-label="Close"
          >
            x
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Approach
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                {approach}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Struggles
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                {struggles}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Time complexity
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                {timeComplexity}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Space complexity
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                {spaceComplexity}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Key takeaway
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-100">
                {takeaway}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-800/70 bg-slate-950/50 px-6 py-4">
          <button
            type="button"
            onClick={() => setShowNotes(null)}
            className="rounded-full border border-cyan-400/70 bg-cyan-500/20 px-6 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotesComponent;
