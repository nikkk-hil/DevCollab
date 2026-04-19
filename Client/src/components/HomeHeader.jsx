import React from "react";
import { getAgoTime } from "../utils/time";

function HomeHeader({
  onLogout,
  isLoggingOut,
  onToggleNotifications,
  showNotifications,
  recentActivities,
  notificationsLoading,
}) {
  return (
    <header className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            DevCollab
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage boards and collaborate in real-time.</p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="rounded-xl bg-amber-300 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

    </header>
  );
}

export default HomeHeader;
