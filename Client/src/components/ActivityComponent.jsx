import React from "react";
import { getAgoTime } from "../utils/time";

function ActivityComponent({ setShowNotifications, activities }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" />

      <aside
        role="dialog"
        aria-label="Board notifications"
        className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-800 bg-slate-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Notifications
            </h2>
            <p className="text-xs text-slate-400">{"Board"}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowNotifications(false)}
            className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100%-64px)] overflow-y-auto p-4">
          <ul className="space-y-3">
            {activities.length === 0 ? (
              <div>No activity yet.</div>
            ) : (
              activities.map((activity, index) => (
                <li
                  key={activity?._id?.toString?.() || activity?._id || index}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-3"
                >
                  <p className="text-sm text-slate-200">
                    {activity?.action || ""}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>
                        {getAgoTime(activity.createdAt) || ""}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default ActivityComponent;
