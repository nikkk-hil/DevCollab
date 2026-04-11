import api from "./axios";

const getBoardAcitivities = (boardId) => api.get(`/activity/${boardId}`);

export {
    getBoardAcitivities
}