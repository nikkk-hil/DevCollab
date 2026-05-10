import React from "react";
import { useSelector } from "react-redux";

function FeedbackComponent({ setShowFeedback, showFeedback }) {
    const cards = useSelector((state) => state.card);
    let pickCard;
    Object.keys(cards).forEach((status) => {
        cards[status].forEach((card) => {
        if (card?._id?.toString?.() === showFeedback?.toString?.()){
            pickCard = card.aiFeedback;
        }
        })

    })
    console.log("PICKEDCARD:", pickCard)
    const feedback = typeof pickCard === "object" ? pickCard : {};
    const patternAnalysis = feedback?.patternAnalysis || "NA";
    const tc = feedback?.timeComplexity || "NA";
    const sc = feedback?.spaceComplexity || "NA";
    const readability = feedback?.readability || "NA";
    const optimization = feedback?.optimization || "NA";
    const overallFeedback = feedback?.overallFeedback || "NA";
    const score = feedback?.score || "NA";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
        >
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                aria-hidden="true"
            />

            <div className="relative flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-slate-800/80 shadow-2xl">
                <div className="pointer-events-none absolute -top-14 right-6 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-amber-400/15 blur-3xl" />

                <header className="relative flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/70 px-6 py-5">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-300/70">
                            Feedback Lab
                        </p>
                        <h2
                            id="feedback-title"
                            className="text-2xl font-semibold text-slate-100"
                            style={{ fontFamily: '"Space Grotesk", "Segoe UI", sans-serif' }}
                        >
                            Solution feedback
                        </h2>
                        <p className="max-w-xl text-sm text-slate-300">
                            Review pattern, complexity, and optimization insights.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowFeedback(null)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 bg-slate-950/60 text-lg text-slate-200 transition hover:border-emerald-400/60 hover:text-emerald-200"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Pattern analysis
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-slate-100">
                                    {patternAnalysis}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Overall feedback
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-slate-100">
                                    {overallFeedback}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                                    Score
                                </p>
                                <p className="mt-3 text-4xl font-semibold text-emerald-100">
                                    {score}/10
                                </p>
                                <p className="mt-2 text-xs text-emerald-200/70">
                                    Higher is better
                                </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Time complexity
                                    </p>
                                    <p className="mt-2 text-sm text-slate-100">{tc}</p>
                                </div>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Space complexity
                                    </p>
                                    <p className="mt-2 text-sm text-slate-100">{sc}</p>
                                </div>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Readability
                                    </p>
                                    <p className="mt-2 text-sm text-slate-100">{readability}</p>
                                </div>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Optimization
                                    </p>
                                    <p className="mt-2 text-sm text-slate-100">{optimization}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end border-t border-slate-800/70 bg-slate-950/50 px-6 py-4">
                    <button
                        type="button"
                        onClick={() => setShowFeedback(null)}
                        className="rounded-full border border-emerald-400/70 bg-emerald-500/20 px-6 py-2 text-xs uppercase tracking-[0.24em] text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-500/30"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeedbackComponent;