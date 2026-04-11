import api from "./axios";

const getCardComments = (boardId, cardId) => api.get(`/comment/board/${boardId}/card/${cardId}`);
const createComment = (boardId, cardId, commentData) => api.post(`/comment/board/${boardId}/card/${cardId}`, commentData);
const deleteComment = (commentId) => api.delete(`/comment/${commentId}`);

export {
    getCardComments,
    createComment,
    deleteComment
}