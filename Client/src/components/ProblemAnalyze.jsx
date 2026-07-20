import React, { useState } from "react";

function ProblemAnalyze({ cardId, onSubmit, onClose, error, setError }) {
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState({
    approach: "",
    struggles: "",
    complexity: { time: "", space: "" },
    takeaways: "",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="problem-analyze-title"
      data-card-id={cardId}
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-800/80 shadow-2xl">
        <div className="pointer-events-none absolute -top-14 right-6 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-amber-400/15 blur-3xl" />

        <header className="relative flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/70 px-6 py-5">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">
              Problem Lab
            </p>
            <h2
              id="problem-analyze-title"
              className="text-2xl font-semibold text-slate-100"
              style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
            >
              Problem analysis
            </h2>
            <p className="max-w-xl text-sm text-slate-300">
              Capture your solution first, then reflect on your approach,
              struggles, and complexity.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose()
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 bg-slate-950/60 text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-200"
            aria-label="Close"
          >
            X
          </button>
        </header>

        <div className="relative px-6 py-5">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
            <span className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-emerald-200">
              Code
            </span>
            <span className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-3 py-1 text-emerald-200">
              Notes
            </span>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex h-full flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3
                  className="text-lg font-semibold text-slate-100"
                  style={{
                    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
                  }}
                >
                  Solution code
                </h3>
              </div>

              <div className="flex-1 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setError("");
                    setCode(e.target.value);
                  }}
                  className="min-h-[200px] h-full w-full resize-none bg-transparent font-mono text-sm text-slate-100 placeholder-slate-500 outline-none"
                  placeholder="Paste your DSA solution code here..."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span>Tip: Focus on the final working approach.</span>
                <span>Lines: --</span>
              </div>
            </section>

            <section className="grid h-full gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Approach summary
                  </label>
                  <textarea
                    className="min-h-[110px] w-full resize-none bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="Explain the approach in a few concise sentences."
                    value={notes.approach}
                    onChange={(e) =>{
                      setError("");
                      setNotes((prev) => ({ ...prev, approach: e.target.value }));
                    }}
                  />
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Struggles
                  </label>
                  <textarea
                    className="min-h-[110px] w-full resize-none bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="Where did you get stuck or hesitate?"
                    value={notes.struggles}
                    onChange={(e) =>{
                      setError("");
                      setNotes((prev) => ({ ...prev, struggles: e.target.value }))
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Time complexity
                  </label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="e.g. O(n log n)"
                    value={notes.complexity.time}
                    onChange={(e) =>{
                      setError("")
                      setNotes((prev) => ({
                        ...prev,
                        complexity: { ...prev.complexity, time: e.target.value },
                      }))
                    }}
                  />
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Space complexity
                  </label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="e.g. O(n)"
                    value={notes.complexity.space}
                    onChange={(e) =>{
                      setError("")
                      setNotes((prev) => ({
                        ...prev,
                        complexity: { ...prev.complexity, space: e.target.value },
                      }))
                    }}
                  />
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Time spent
                  </label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="e.g. 35 min"
                    value={notes.timeSpent}
                    onChange={(e) =>{
                      setError("");
                      setNotes((prev) => ({
                        ...prev,
                        timeSpent: e.target.value,
                      }))
                    }}
                  />
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                  <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Key takeaways
                  </label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
                    placeholder="e.g. two pointers, monotonic stack, prefix sums"
                    value={notes.takeaways}
                    onChange={(e) =>{
                      setError("");
                      setNotes((prev) => ({ ...prev, takeaways: e.target.value }))
                    }}
                  />
                </div>
              </div>
            </section>
          </div>

          {error && <div className="mt-2 text-sm uppercase tracking-[0.2em] text-red-400">
              {error}
            </div>}

          <div className="mt-8 border-t border-slate-800/70 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                className="rounded-full border border-slate-700/80 bg-slate-950/60 px-5 py-2 text-xs uppercase tracking-[0.24em] text-slate-300 transition hover:border-amber-300/60 hover:text-amber-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSubmit({ solution: code, reflections: notes })}
                  className="rounded-full border border-emerald-400/70 bg-emerald-500/20 px-6 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-500/30"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemAnalyze;
