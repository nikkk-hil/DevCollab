import React, { useEffect } from 'react'
import { getBoards } from '../api/board.js'
import { useDispatch, useSelector } from 'react-redux'
import { addBoard, removeBoard } from '../store/slices/boardSlice.js';
import { useState } from 'react';
import { logout } from '../store/slices/authSlice.js';

function HomeComponent() {
    const dispatch = useDispatch();
    const {boards} = useSelector(state => state.board)
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        setLoading(true);
        ;(async () => {
            try {
                const boardsRes = await getBoards();
                const boardsData = boardsRes.data.data;
                boardsData.forEach((board) => dispatch(addBoard(board)));
                // boardsData.forEach((board) => dispatch(removeBoard(boardsData[0])));
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    useEffect( ()=> {
        console.log(boards)
    },[boards])

    if (loading)
        return(
            <div>
                Loading...
            </div>
        )
  return (
    <div>HomeComponent</div>
  )
}

export default HomeComponent