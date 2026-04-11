import api from "./axios";

const getCards = (boardId) => api.get(`/card/${boardId}`);
const createCard = (boardId, columnId, cardData) => api.post(`/card/${boardId}/column/${columnId}`, cardData);
const editCard = (cardId, cardData) => api.patch(`/card/${cardId}`, cardData);
const deleteCard = (cardId) => api.delete(`/card/${cardId}`);
const addAssignee = (cardId, assigneeId) => api.patch(`/card/${cardId}/add-assignee/${assigneeId}`);
const removeAssignee = (cardId, assigneeId) => api.patch(`/card/${cardId}/remove-assignee/${assigneeId}`);
const moveCard = (cardId, boardId, columnId) => api.patch(`/card/${cardId}/board/${boardId}/move/${columnId}`);

export {
    getCards,
    createCard,
    editCard,
    deleteCard,
    addAssignee,
    removeAssignee,
    moveCard
}