import api from "./axios";

const getCards = (boardId) => api.get(`/card/${boardId}`);
const createCard = (boardId, cardData) => api.post(`/card/${boardId}`, cardData);
const editCard = (cardId, cardData) => api.patch(`/card/${cardId}`, cardData);
const deleteCard = (cardId) => api.delete(`/card/${cardId}`);
const updateProgress = (boardId, cardId, data) => api.patch(`/card/${cardId}/board/${boardId}/update-progress`, data)
const getFeedback = (boardId, cardId, data) => api.patch(`/card/${cardId}/board/${boardId}/ai-feedback`, data)

export {
    getCards,
    createCard,
    editCard,
    deleteCard,
    updateProgress,
    getFeedback
}