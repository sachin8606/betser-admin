import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getChatList, getChatUser, addNewMessage, setChatSelectedUserId, uploadMedia, resetChat, updateUnreadMessages } from "../features/communicationSlice";
import io from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faImage, faMicrophone, faMusic, faUpload, faVideo } from "@fortawesome/free-solid-svg-icons";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format"
import Loader from "../components/Loader";
import { useAlert } from "react-alert";
import useSocket from "../services/socket.service";

export default function AdminChat() {
  const alert = useAlert()
  const history = useHistory()
  const { id } = useParams();
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.admin)
  const { currentChat, loading, userList, userId, unreadMessages } = useSelector((state) => state.communication);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [curUserName, setCurUserName] = useState("")
  const [adminId, setAdminId] = useState(localStorage.getItem("betser-admin"))
  const { socket } = useSocket()
  useEffect(() => {
    dispatch(setChatSelectedUserId(id))
    socket.on("onlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    socket.on("userStatus", ({ userId, status }) => {
      setOnlineUsers((prev) =>
        status === "online" ? [...prev, userId] : prev.filter((id) => id !== userId)
      );
    });
    if (id) {
      dispatch(getChatUser({ id }));
      socket.emit("selectUser", { adminId: "admin", userId: id });
      const updatedUnread = { ...unreadMessages };
      delete updatedUnread[id];
      dispatch(updateUnreadMessages(updatedUnread))
    }
    dispatch(getChatList());
    return () => {
      dispatch(resetChat())
      socket.off("onlineUsers");
      socket.off("userStatus");
    };
  }, [id, dispatch]);

  useEffect(() => {
    const userName = userList.filter((user) => user.id === id)
    if (userName.length > 0)
      setCurUserName(userName[0].firstName + " " + userName[0].lastName)
  }, [userList])


  const handleUserClick = (userId) => {
    history.push(`/chat/${userId}`);
  };


  const sendMessage = ({ type = "text", mediaUrl = null } = {}) => {
    if (!(type === "text") && !mediaUrl) {
      if (newMessage === "" || newMessage === undefined || newMessage === null) {
        return
      }
    }
    const messageData = {
      senderId: adminId,
      senderRole: "admin",
      receiverId: id,
      receiverRole: "user",
      message: newMessage,
      type: type,
      mediaUrl: mediaUrl,
      createdAt: new Date().toISOString()
    }
    socket.emit("sendMessage", messageData);
    dispatch(addNewMessage(messageData));
    setNewMessage("");
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const formData = new FormData();
    formData.append("file", file);
    const res = await dispatch(uploadMedia(formData)).unwrap();
    const fileTypeCategory = file.type.startsWith("image")
      ? "image"
      : file.type.startsWith("video")
        ? "video" :
        file.type.startsWith("audio") ? "audio" : null;
    sendMessage({ type: fileTypeCategory, mediaUrl: res.mediaUrl })
  };

  return (
    <div style={styles.container}>
      {/* Sidebar: List of Users */}
      <div style={styles.sidebar}>
        {/* <input type="text" placeholder="Search" style={styles.searchInput} /> */}
        <ul style={styles.userList}>
          {userList &&
            userList.map((user) => {

              return (
                <li key={user.id} style={styles.userItem} onClick={() => handleUserClick(user.id)}>
                  <img src={user.avatar} alt={user.id} style={styles.userAvatar} />
                  {user.firstName + " " + user.lastName} <br />{onlineUsers.includes(user.id) ? "Online" : "Offline"}
                  {unreadMessages[user.id] && <span style={styles.unreadBadge}>{unreadMessages[user.id]}</span>}
                </li>
              )
            }
            )}
        </ul>
      </div>

      {/* Chat Section */}
      <div style={styles.chatContainer}>
        <div style={styles.header}>{id ? curUserName : "Users"}</div>
        <div style={styles.messageList}>
          {loading ? <div><Loader /></div> :
            currentChat &&
            currentChat.map((message) => {
              const messageDate = new Date(message.createdAt);
              const formattedDate =
                formatDistanceToNow(messageDate, { addSuffix: true }) === "less than a minute ago"
                  ? "Just now"
                  : format(messageDate, "dd MMM yyyy, hh:mm a");

              return (
                <div
                  key={message.id}
                  style={message.senderRole === "admin" ? styles.adminMessage : styles.userMessage}
                >
                  <div className="chat-messages-cntn">{message.message}</div>
                  {message.type !== "text" && (
                    <div>
                      {message.type === "image" && (
                        <img src={message.mediaUrl} alt="Chat media" style={styles.media} />
                      )}
                      {message.type === "video" && (
                        <video controls style={styles.media}>
                          <source src={message.mediaUrl} type="video/mp4" />
                        </video>
                      )}
                      {message.type === "audio" && (
                        <audio controls style={{ ...styles.media, "height": "23px" }}>
                          <source src={message.mediaUrl} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  )}
                  <div style={message.senderRole === "admin" ? styles.adminTimeStamp : styles.userTimeStamp}>{formattedDate} <FontAwesomeIcon icon={faCheck} style={{ margin: "0px 0px 0px 3px" }} /></div>
                </div>
              );
            })}
        </div>
        {id && (
          <div style={styles.inputContainer}>
            <div style={styles.mediaIcons}>
              {/* Upload Image */}
              <label>
                <FontAwesomeIcon icon={faImage} style={styles.icon} title="Upload Image" />
                <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
              </label>

              {/* Upload Video */}
              <label>
                <FontAwesomeIcon icon={faVideo} style={styles.icon} title="Upload Video" />
                <input type="file" accept="video/*" hidden onChange={handleFileUpload} />
              </label>

              {/* Upload Audio */}
              <label>
                <FontAwesomeIcon icon={faMicrophone} style={styles.icon} title="Upload Audio" />
                <input type="file" accept="audio/*" hidden onChange={handleFileUpload} />
              </label>
            </div>

            <input
              type="text"
              placeholder="Your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.messageInput}
              onKeyUp={(e) => { if (e.key === "Enter") sendMessage({ type: "text" }) }}
            />
            <button onClick={() => sendMessage({ type: "text" })} style={styles.sendButton}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: { display: "flex", height: "88vh", backgroundColor: "#F4F1FC" },
  sidebar: { width: "25%", backgroundColor: "#fff", padding: "20px", borderRight: "1px solid #ddd" },
  userList: { listStyle: "none", padding: "0" },
  userItem: { display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd", cursor: "pointer" },
  userAvatar: { width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" },
  unreadBadge: { backgroundColor: "red", color: "white", borderRadius: "50%", padding: "5px", marginLeft: "8px", fontSize: "12px" },
  chatContainer: { flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "white", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", padding: "15px", width: "75%" },
  header: { backgroundColor: "rgba(108,71,143,255)", color: "white", padding: "6px", borderRadius: "10px 10px 0 0", textAlign: "center", fontSize: "18px", fontWeight: "bold" },
  messageList: { flexGrow: 1, display: "flex", flexDirection: "column", padding: "15px", overflowY: "auto" },
  adminMessage: { padding: "12px", borderRadius: "15px", maxWidth: "60%", fontSize: "14px", alignSelf: "flex-end", backgroundColor: "rgba(108,71,143,255)", color: "white", margin: "10px 0px" },
  userMessage: { padding: "12px", borderRadius: "15px", maxWidth: "60%", fontSize: "14px", alignSelf: "flex-start", backgroundColor: "#F6F3F9", color: "#7D5C9C", margin: "10px 0px" },
  inputContainer: { display: "flex", alignItems: "center", padding: "10px", borderTop: "1px solid #ddd" },
  messageInput: { flexGrow: 1, padding: "12px", borderRadius: "10px", border: "1px solid #7D5C9C", backgroundColor: "#F6F3F9", marginRight: "8px", fontSize: "14px" },
  sendButton: { padding: "10px 18px", backgroundColor: "#6C478F", color: "white", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "14px" },
  media: { maxWidth: "100%", borderRadius: "10px", marginTop: "10px" },
  icon: { cursor: 'pointer', color: '#7D5C9C', fontSize: '20px' },
  mediaIcons: { display: 'flex', gap: '10px', marginRight: '10px', },
  adminTimeStamp: {
    fontSize: "12px", color: "wheat", marginTop: "5px",
    textAlign: "right",
  },
  userTimeStamp: {
    fontSize: "12px", color: "#888", marginTop: "5px",
    textAlign: "right",
  },
};
