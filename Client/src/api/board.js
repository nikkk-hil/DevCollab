import api from "./axios";

const getBoards = () => api.get("/board/")
const createBoard = (data) => api.post("/board/", data)
const addMemberToBoard = (boardId, memberId) => api.patch(`/board/${boardId}/member/${memberId}`)
const removeMemberFromBoard = (boardId, memberId) => api.delete(`/board/${boardId}/member/${memberId}`)
const deleteBoard = (boardId) => api.delete(`/board/${boardId}`)

export {
    getBoards,
    createBoard,
    addMemberToBoard,
    removeMemberFromBoard,
    deleteBoard
}