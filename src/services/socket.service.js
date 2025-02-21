import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addNewMessage, updateUnreadMessages } from "../features/communicationSlice";
import { playMessageIncomingSound } from "../utils/playSound";
import { useAlert } from "react-alert";

const socket = io(process.env.REACT_APP_SOCKET_API, { autoConnect: false });

const useSocket = (adminId) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { userId, unreadMessages } = useSelector((state) => state.communication);

    useEffect(() => {
        if (!adminId || socket.connected) return;

        console.log("Connecting socket...");
        socket.connect();
        socket.emit("register", { userId: adminId, role: "admin" });

    }, [adminId]);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            playMessageIncomingSound()
            alert.info("You have a new message.")
            if (message.senderId === userId) {
                dispatch(addNewMessage(message));
            } else {
                const updatedUnread = { 
                    ...unreadMessages, 
                    [message.senderId]: (unreadMessages[message.senderId] || 0) + 1 
                };
                dispatch(updateUnreadMessages(updatedUnread));
            }
        };

        if (!socket.hasListeners("receiveMessage")) {
            socket.on("receiveMessage", handleReceiveMessage);
        }

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [dispatch, userId, unreadMessages]); 

    return { socket };
};

export default useSocket;
