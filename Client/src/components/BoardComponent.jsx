import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createCard, getCards, getFeedback, updateProgress } from "../api/card";
import { useDispatch, useSelector } from "react-redux";
import { getBoardAcitivities } from "../api/activity";
import {
  addCard,
  addFeedbackNotes,
  changeStatusOfCard,
  clearCards,
  setCards,
} from "../store/slices/cardSlice";
import { addActivity, clearActivities } from "../store/slices/activitySlice";
import Column from "./Column";
import { addMemberToBoard } from "../api/board";
import { getUserByUsernameOrEmail } from "../api/auth";
import { updateBoard } from "../store/slices/boardSlice";
import AddCardDialog from "./AddCardDialog";
import AddMemberDialog from "./AddMemberDialog";
import { useSocket } from "../contexts/SocketContext";
import ActivityComponent from "./ActivityComponent";
import { DragDropContext } from "@hello-pangea/dnd";
import ProblemAnalyze from "./ProblemAnalyze";
import FeedbackComponent from "./FeedbackComponent";
import NotesComponent from "./NotesComponent";

// Fixed status lanes shown for every board.
const STATUS_COLUMNS = [
  { key: "todoCards", status: "to-do", title: "To-do" },
  { key: "inProgressCards", status: "in-progress", title: "In-Progress" },
  { key: "completedCards", status: "completed", title: "Completed" },
];

function BoardComponent() {
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const { boards } = useSelector((state) => state.board);
  const { activities } = useSelector((state) => state.activity);
  const [addMemberPopup, setAddMemberPopup] = useState(false);
  const [addCardPopup, setAddCardPopup] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [cardFormData, setCardFormData] = useState({
    title: "",
    tags: [],
    difficulty: "Easy",
    link: "",
    description: "",
  });
  const [creatingCard, setCreatingCard] = useState(false);
  const socket = useSocket();
  const [activeCard, setActiveCard] = useState(null);
  const [problemData, setProblemData] = useState({
    solution: null,
    reflections: {},
  });
  const [feedbackRes, setFeedbackRes] = useState(null)
  const [showFeedback, setShowFeedback] = useState(null)
  const [showNotes, setShowNotes] = useState(null)

  const activeBoard = useMemo(
    () => boards.find((board) => board._id === boardId),
    [boards, boardId],
  );

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) return;

      try {
        setLoading(true);
        setError("");

        dispatch(clearCards());
        dispatch(clearActivities());

        const [cardsRes, activitiesRes] = await Promise.all([
          getCards(boardId),
          getBoardAcitivities(boardId),
        ]);

        dispatch(setCards(cardsRes.data.data));
        for (let i = activitiesRes.data.data.length - 1; i >= 0; i--) {
          dispatch(addActivity(activitiesRes.data.data[i]));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch board data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();

    return () => {
      dispatch(clearCards());
      dispatch(clearActivities());
    };
  }, [boardId, dispatch]);

  useEffect(() => {
    if (!socket || !boardId) return;

    socket.emit("join:board", boardId);
    const handleNewActivity = (activity) => {
      dispatch(addActivity(activity));
    };

    socket.on("activity:new", handleNewActivity);

    return () => {
      socket.off("activity:new", handleNewActivity);
    };
  }, [socket, boardId, dispatch]);

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
      const res = await createCard(boardId, cardFormData);
      dispatch(addCard(res.data.data));
      setCardFormData({
        title: "",
        tags: [],
        difficulty: "Easy",
        link: "",
        description: "",
      });
      setAddCardPopup(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create card. Please try again.",
      );
    } finally {
      setCreatingCard(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    dispatch(
      changeStatusOfCard({
        cardId: draggableId,
        to: destination.droppableId,
        from: source.droppableId,
      }),
    );

    if (destination.droppableId === "completed") {
      setActiveCard({
        cardId: draggableId,
        source: source.droppableId,
      });

      return;
    }

    const data = {
      status: destination.droppableId,
      code: null,
      notes: null,
      aiFeedback: null,
    };
    try {
      const res = await updateProgress(boardId, draggableId, data);
    } catch (error) {
      dispatch(
        changeStatusOfCard({
          cardId: draggableId,
          to: source.droppableId,
          from: destination.droppableId,
        }),
      );
      console.log(
        error.response?.data?.message || error || "something went wrong.",
      );
    }
    // TODO: parse result (source, destination, draggableId).
    // TODO: exit if no destination or same position.
    // TODO: handle reorder vs move across statuses.
    // TODO: update state optimistically and call updateCardProgress.
    // TODO: rollback state on API failure.
  };

  const handleProblemAnalysisSubmit = async (data) => {
    const soltion = data?.solution;
    const reflections = {
      approach: data?.reflections?.approach,
      struggles: data?.reflections?.struggles,
      timeComplexity: data?.reflections?.complexity?.time,
      spaceComplexity: data?.reflections?.complexity?.space,
      takeaway: data?.reflections?.takeaways,
    };

    try {
      const progress = await updateProgress(boardId, activeCard.cardId, {status: "completed", notes: reflections});
      setActiveCard(null);
      const feedback = await getFeedback(boardId, activeCard.cardId, {code: soltion, notes: reflections})
      dispatch(addFeedbackNotes(feedback.data.data))
      setShowFeedback(feedback.data.data.card)
    } catch (error) {
      console.log(
        error.response?.data?.message || error || "something went wrong.",
      );
    }
  };

  const columnCount = STATUS_COLUMNS.length;

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
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="cursor-pointer rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/30"
            >
              Notifications
            </button>
          </div>
        </header>

        {showNotifications && (
          <ActivityComponent
            setShowNotifications={setShowNotifications}
            activities={activities}
          />
        )}

        {addCardPopup && (
          <AddCardDialog
            setAddCardPopup={setAddCardPopup}
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

        {activeCard && (
          <ProblemAnalyze
            cardId={activeCard.cardId}
            onSubmit={(data) => {
              handleProblemAnalysisSubmit(data);
            }}
            onClose={() => setActiveCard(null)}
            setProblemData={setProblemData}
          />
        )}

        {(showFeedback) && <FeedbackComponent
          setShowFeedback={setShowFeedback}
          showFeedback={showFeedback}
        />}

        {showNotes && (
          <NotesComponent
            setShowNotes={setShowNotes}
            showNotes={showNotes}
          />
        )}

        <div className="overflow-x-auto">
          {/* DnD context for all lanes/cards; onDragEnd is the integration point. */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, minmax(260px, 1fr))`,
              }}
            >
              {STATUS_COLUMNS.map((column) => (
                <Column
                  key={column.status}
                  title={column.title}
                  columnKey={column.key}
                  status={column.status}
                  setShowFeedback={setShowFeedback}
                  setShowNotes={setShowNotes}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </section>
  );
}

export default BoardComponent;
