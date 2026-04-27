import {io} from 'socket.io-client';
import { createContext, useContext, useEffect, useRef } from 'react';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
    const socketRef = useRef();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
            autoConnect: true,
        });
        socketRef.current = socket;

        return () => {
            socket.disconnect();
        }
    }, [])


    return (
        <SocketContext.Provider value={socketRef}>
            {children}
        </SocketContext.Provider>
    )
}

const useSocket = () => {
    const socketRef = useContext(SocketContext);
    if (!socketRef) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socketRef.current;
}

export { SocketProvider, useSocket };