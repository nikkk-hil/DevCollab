import React, { useState } from 'react'

function AddCardDialog({
  setAddCardPopup,
  cardFormData,
  setCardFormData,
  handleCreateCard,
  creatingCard = false
}) {
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    // Validation
    if (!cardFormData.title || !cardFormData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (cardFormData.title.trim().length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }

    // Call the parent handler
    handleCreateCard();
  };

  return (
          <div
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-4"
            onClick={() => !creatingCard && setAddCardPopup(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Add card popup"
              className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Create Card</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Fill in the required information to create a new card.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => !creatingCard && setAddCardPopup(false)}
                  disabled={creatingCard}
                  className="rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  X
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm font-semibold text-red-300">{error}</p>
                </div>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Card Title <span className="text-red-400">*</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Enter card title"
                    value={cardFormData.title}
                    onChange={(e) => {
                      setCardFormData(prev => ({...prev, title: e.target.value}));
                      setError("");
                    }}
                    disabled={creatingCard}
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Difficulty
                  </p>
                  <select 
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                    value={cardFormData.difficulty}
                    onChange={(e) => setCardFormData( prev => ({...prev, difficulty: e.target.value}))}
                    disabled={creatingCard}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Description
                  </p>
                  <textarea
                    rows={4}
                    placeholder="Write a short description..."
                    className="mt-2 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                    value={cardFormData.description}
                    onChange={(e) => setCardFormData(prev => ({...prev, description: e.target.value}))}
                    disabled={creatingCard}
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tags (comma separated)
                  </p>
                  <input
                    type="text"
                    placeholder="array, linked-list, graph"
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                    value={cardFormData.tags}
                    onChange={e => (setCardFormData(prev => ({...prev, tags: e.target.value})))}
                    disabled={creatingCard}
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reference Link
                  </p>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                    value={cardFormData.link}
                    onChange={(e) => setCardFormData(prev => ({...prev, link: e.target.value}))}
                    disabled={creatingCard}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddCardPopup(false)}
                  disabled={creatingCard}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={creatingCard}
                  className="rounded-lg bg-cyan-500/80 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {creatingCard ? "Creating Card..." : "Create Card"}
                </button>
              </div>
            </div>
          </div>
  );
}

export default AddCardDialog;