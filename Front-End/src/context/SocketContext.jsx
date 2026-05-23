import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const { user }       = useAuth();
    const socketRef      = useRef(null);
    const [connected, setConnected]           = useState(false);
    const [onlineStaff,  setOnlineStaff]      = useState({});   
    const [liveStatuses, setLiveStatuses]     = useState({});   

    useEffect(() => {
        if (!user) {
            // disconnect if logged out
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setConnected(false);
            }
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        // connect
        const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
            auth:              { token },
            transports:        ["websocket"],
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            setConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
            setConnected(false);
        });

        // admin listeners
        if (user.role === "admin") {
            socket.on("staff:online", ({ userId }) => {
                setOnlineStaff((prev) => ({ ...prev, [userId]: true }));
            });

            socket.on("staff:offline", ({ userId }) => {
                setOnlineStaff((prev) => ({ ...prev, [userId]: false }));
            });

            socket.on("staff:status-changed", ({ userId, status, startedAt }) => {
                setLiveStatuses((prev) => ({
                    ...prev,
                    [userId]: { status, startedAt: new Date(startedAt) },
                }));
            });
        }

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{
            socket:       socketRef.current,
            connected,
            onlineStaff,
            liveStatuses,
            setLiveStatuses,
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = () => useContext(SocketContext);