import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardColumns } from "../api/column";
import { getCards, moveCard } from "../api/card";
import { useDispatch, useSelector } from "react-redux";
import { getBoardAcitivities } from "../api/activity";
import { addColumn, clearColumns } from "../store/slices/columnSlice";
import { addCard, changeColumnOfCard, clearCards } from "../store/slices/cardSlice";
import { addActivity, clearActivities } from "../store/slices/activitySlice";
import { DndContext, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./Column";

function BoardComponent() {
    const dispatch = useDispatch();
    const { boardId } = useParams();
    const { boards } = useSelector((state) => state.board);
    const { columns } = useSelector((state) => state.column);
    const { cards } = useSelector((state) => state.card);
    const { activities } = useSelector((state) => state.activity);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const activeBoard = useMemo(
        () => boards.find((board) => board._id === boardId),
        [boards, boardId],
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        }),
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!active || !over || !boardId) return;

        const cardId = active.id?.toString();
        const fromColumnId = active.data?.current?.columnId?.toString();

        const toColumnId =
            over.data?.current?.type === "column"
                ? over.data.current.columnId?.toString()
                : null;

        if (!cardId || !fromColumnId || !toColumnId || fromColumnId === toColumnId) {
            return;
        }

        dispatch(changeColumnOfCard({ cardId, columnId: toColumnId }));

        try {
            await moveCard(cardId, boardId, toColumnId);
        } catch (err) {
            dispatch(changeColumnOfCard({ cardId, columnId: fromColumnId }));
            setError(err.response?.data?.message || "Unable to move card. Please try again.");
        }
    };

    useEffect(() => {
        const fetchBoardData = async () => {
            if (!boardId) return;

            try {
                setLoading(true);
                setError("");

                dispatch(clearColumns());
                dispatch(clearCards());
                dispatch(clearActivities());

                const [columnsRes, cardsRes, activitiesRes] = await Promise.all([
                    getBoardColumns(boardId),
                    getCards(boardId),
                    getBoardAcitivities(boardId),
                ]);

                columnsRes.data.data.forEach((column) => dispatch(addColumn(column)));
                cardsRes.data.data.forEach((card) => dispatch(addCard(card)));
                activitiesRes.data.data.forEach((activity) => dispatch(addActivity(activity)));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch board data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoardData();

        return () => {
            dispatch(clearColumns());
            dispatch(clearCards());
            dispatch(clearActivities());
        };
    }, [boardId, dispatch]);

    const columnCount = columns.length;

    if (loading) {
        return <div className="p-4 text-slate-600">Loading board...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

  return (
        <section className="min-h-screen bg-slate-100/60 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        {activeBoard?.title || "Board"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Organize work by columns and track cards by status.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {columnCount} {columnCount === 1 ? "Column" : "Columns"}
                        </span>
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                            {cards.length} {cards.length === 1 ? "Card" : "Cards"}
                        </span>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {activities.length} Activities
                        </span>
                    </div>
                </header>

                {columns.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                        No columns found for this board.
                    </div>
        ) : (
                    <div className="overflow-x-auto">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragEnd={handleDragEnd}
                        >
                            <div
                            className="grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(260px, 1fr))`,
                            }}
                        >
                            {columns.map((column) => (
                                <Column key={column._id} column={column} />
                            ))}
                        </div>
                        </DndContext>
                    </div>
        )}
            </div>
        </section>
    );
}

export default BoardComponent;