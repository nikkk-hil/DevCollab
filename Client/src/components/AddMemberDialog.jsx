import React from 'react'

function AddMemberDialog({
    setAddMemberPopup,
    memberUsername,
    setMemberUsername,
    handleAddMemberToBoard,
    addingMember,
}) {
  return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setAddMemberPopup(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Add member popup"
              className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {addingMember ? "Adding Member..." : "Add Member"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setAddMemberPopup(false)}
                  className="rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-slate-300 hover:bg-slate-700"
                >
                  X
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Enter username
                  </p>
                  <input
                    type="text"
                    value={memberUsername}
                    onChange={(e) => setMemberUsername(e.target.value)}
                    className="mt-2 h-10 rounded-lg border border-dashed border-slate-700 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:ring w-full"
                  />
                </div>

              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddMemberPopup(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!memberUsername.trim()}
                  onClick={handleAddMemberToBoard}
                  className="rounded-lg bg-cyan-500/70 px-3 py-1.5 text-sm font-semibold text-slate-950 opacity-80 cursor-not-allowed hover:bg-cyan-500/90 enabled:cursor-pointer enabled:opacity-100"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )
}

export default AddMemberDialog