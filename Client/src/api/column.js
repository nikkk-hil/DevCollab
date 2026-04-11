import api from "./axios";

const getBoardColumns = (boardId) => api.get(`/column/${boardId}`);
const createColumn = (boardId, columnData) => api.post(`/column/${boardId}`, columnData);
const editColumn = (boardId, columnId, columnData) => api.patch(`/column/${columnId}/board/${boardId}`, columnData);
const deleteColumn = (boardId, columnId) => api.delete(`/column/${columnId}/board/${boardId}`);

export {
    getBoardColumns,
    createColumn,
    editColumn,
    deleteColumn
}
