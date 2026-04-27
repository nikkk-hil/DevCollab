import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

function AddAssigneeDialog({
    setAddAssigneePopover,
    boardUsers,
    handleAddAssigneeToCard
}) {
    const user = useSelector((state) => state.auth.user);
    const [assigneeId, setAssigneeId] = useState("");

    const assignees = useMemo(() => {
        return boardUsers.filter((member) => member._id !== user._id);
    }, [boardUsers, user._id]);

  return (
    <div
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setAddAssigneePopover(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Add assignee popup"
              className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-100">Add Assignee</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setAddAssigneePopover(false)}
                  className="rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold text-slate-300 hover:bg-slate-700"
                >
                  X
                </button>
              </div>

              <div className="mt-5">

                <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 w-full">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Board Members
                  </p>
                  <select className="mt-2 h-10 w-full rounded-lg border border-dashed border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none ring-cyan-400 focus:ring"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">Select assignee</option>
                    {assignees.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.fullName || "Unknown User"}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddAssigneePopover(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (assigneeId) {
                      handleAddAssigneeToCard(assigneeId);
                      setAddAssigneePopover(false);
                    }
                  }}
                  disabled={assigneeId === ""}
                  className="rounded-lg bg-cyan-500/80 px-3 py-1.5 text-sm font-semibold text-slate-950"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
  )
}

export default AddAssigneeDialog