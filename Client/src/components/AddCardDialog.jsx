import React from 'react'

function AddCardDialog({
  setAddCardPopup,
  columns = [],
  cardFormData,
  setCardFormData,
  handleCreateCard
}) {
  return (
          <div
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setAddCardPopup(false)}
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
                    Template UI is ready. Hook state and API logic as needed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAddCardPopup(false)}
                  className="rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-slate-300 hover:bg-slate-700"
                >
                  X
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Card Title
                  </p>
                  <input
                    type="text"
                    placeholder="Enter card title"
                    value={cardFormData.title}
                    onChange={(e) => (setCardFormData(prev => ({...prev, title: e.target.value})))}
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring"
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Difficulty
                  </p>
                  <select className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 focus:ring"
                  value={cardFormData.difficulty}
                  onChange={(e) => setCardFormData( prev => ({...prev, difficulty: e.target.value}))}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Column
                  </p>
                  <select className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 focus:ring"
                  value={cardFormData.column}
                  onChange={(e) => setCardFormData((prev) => ({...prev, column: e.target.value}))}
                  >
                    <option value="">Select column</option>
                    {columns.map((column) => (
                      <option key={column._id} value={column._id}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Description
                  </p>
                  <textarea
                    rows={4}
                    placeholder="Write a short description..."
                    className="mt-2 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring"
                    value={cardFormData.description}
                    onChange={(e) => setCardFormData(prev => ({...prev, description: e.target.value}))}
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tags (comma separated)
                  </p>
                  <input
                    type="text"
                    placeholder="array, linked-list, graph"
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring"
                    value={cardFormData.tags}
                    onChange={e => (setCardFormData(prev => ({...prev, tags: e.target.value})))}
                  />
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reference Link
                  </p>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring"
                    value={cardFormData.link}
                    onChange={(e) => setCardFormData(prev => ({...prev, link: e.target.value}))}
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddCardPopup(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCard}
                  className="rounded-lg bg-cyan-500/80 px-3 py-1.5 text-sm font-semibold text-slate-950"
                >
                  Create Card
                </button>
              </div>
            </div>
          </div>
  )
}

export default AddCardDialog