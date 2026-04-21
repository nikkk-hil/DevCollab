import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardColumns } from "../api/column";
import { createCard, getCards, moveCard } from "../api/card";
import { useDispatch, useSelector } from "react-redux";
import { getBoardAcitivities } from "../api/activity";
import { addColumn, clearColumns } from "../store/slices/columnSlice";
import {
  addCard,
  changeColumnOfCard,
  clearCards,
} from "../store/slices/cardSlice";
import { addActivity, clearActivities } from "../store/slices/activitySlice";
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import { addMemberToBoard } from "../api/board";
import { getUserByUsernameOrEmail } from "../api/auth";
import { updateBoard } from "../store/slices/boardSlice";
import AddCardDialog from "./AddCardDialog";
import AddMemberDialog from "./AddMemberDialog";

function BoardComponent() {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const { boards } = useSelector((state) => state.board);
  const { columns } = useSelector((state) => state.column);
  const { cards } = useSelector((state) => state.card);
  const { activities } = useSelector((state) => state.activity);
  const [addMemberPopup, setAddMemberPopup] = useState(false);
  const [addCardPopup, setAddCardPopup] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    title: "",
    column: "",
    tags: [],
    difficulty: "Easy",
    link: "",
    description: "",
  });
  const [creatingCard, setCreatingCard] = useState(false);

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

    if (
      !cardId ||
      !fromColumnId ||
      !toColumnId ||
      fromColumnId === toColumnId
    ) {
      return;
    }

    dispatch(changeColumnOfCard({ cardId, columnId: toColumnId }));

    try {
      await moveCard(cardId, boardId, toColumnId);
    } catch (err) {
      dispatch(changeColumnOfCard({ cardId, columnId: fromColumnId }));
      setError(
        err.response?.data?.message || "Unable to move card. Please try again.",
      );
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
        activitiesRes.data.data.forEach((activity) =>
          dispatch(addActivity(activity)),
        );
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

  const handleAddMemberToBoard = async () => {
    try {
      setError("");
      setAddingMember(true);
      const username = memberUsername.trim();

      if (!username) {
        setError("Username of a member is required.");
        return;
      }

      const userRes = await getUserByUsernameOrEmail(username);
      const memberId = userRes.data.data._id;
      const res = await addMemberToBoard(boardId, memberId);
      dispatch(updateBoard(res.data.data));
      setMemberUsername("");
      setAddMemberPopup(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add member. Please try again.",
      );
    } finally {
      setAddingMember(false);
    }
  };

  const handleCreateCard = async () => {
    try {
      setCreatingCard(true);
      setError("");
      const res = await createCard(boardId, cardFormData.column, cardFormData);
      dispatch(addCard(res.data.data));
      setCardFormData({
        title: "",
        column: "",
        tags: [],
        difficulty: "Easy",
        link: "",
        description: "",
      });
      setAddCardPopup(false);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create card. Please try again.",
      );
    } finally {
      setCreatingCard(false);
    }
  };

  const columnCount = columns.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-slate-300">
        Loading board...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-red-400">{error}</div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
            {activeBoard?.title || "Board"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Organize work by columns and track cards by status.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="cursor-pointer rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/30"
              onClick={() => setAddCardPopup(true)}
            >
              Add Card
            </button>
            <button
              className="cursor-pointer rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/30"
              onClick={() => setAddMemberPopup(true)}
            >
              Add Member
            </button>
          </div>
        </header>

        {addCardPopup && (
          <AddCardDialog
            setAddCardPopup={setAddCardPopup}
            columns={columns}
            cardFormData={cardFormData}
            setCardFormData={setCardFormData}
            handleCreateCard={handleCreateCard}
          />
        )}

        {addMemberPopup && (
          <AddMemberDialog
            setAddMemberPopup={setAddMemberPopup}
            memberUsername={memberUsername}
            setMemberUsername={setMemberUsername}
            handleAddMemberToBoard={handleAddMemberToBoard}
            addingMember={addingMember}
          />
        )}

        {columns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
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
