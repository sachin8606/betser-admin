import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getChatList, getChatUser, addNewMessage, setChatSelectedUserId, uploadMedia, resetChat, updateUnreadMessages } from "../features/communicationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClock, faImage, faMicrophone, faMusic, faStop, faPaperPlane, faTimes, faTrash, faUpload, faVideo } from "@fortawesome/free-solid-svg-icons";
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
  
  // Media recording states
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showVideoConfirmation, setShowVideoConfirmation] = useState(false);
  const [showAudioConfirmation, setShowAudioConfirmation] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const videoConfirmRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

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
      // Clean up any active streams and URLs when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
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

  // Start video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedVideo(blob);
        
        // Create URL for preview
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        
        // Show confirmation UI
        setShowVideoConfirmation(true);
        
        // Clean up recording stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecordingVideo(true);
    } catch (error) {
      alert.error("Cannot access camera and microphone");
      console.error("Error accessing media devices:", error);
    }
  };

  // Stop video recording
  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
  };

  // Confirm and send video
  const confirmAndSendVideo = async () => {
    if (!recordedVideo) return;
    
    // Upload and send the recorded video
    const formData = new FormData();
    formData.append("file", recordedVideo, "recorded-video.webm");
    try {
      const res = await dispatch(uploadMedia(formData)).unwrap();
      sendMessage({ type: "video", mediaUrl: res.mediaUrl });
      
      // Clean up
      URL.revokeObjectURL(videoURL);
      setVideoURL("");
      setRecordedVideo(null);
      setShowVideoConfirmation(false);
    } catch (error) {
      alert.error("Failed to upload video");
    }
  };

  // Cancel video recording
  const cancelVideoRecording = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }
    setVideoURL("");
    setRecordedVideo(null);
    setShowVideoConfirmation(false);
  };

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(blob);
        
        // Create URL for preview
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Show confirmation UI
        setShowAudioConfirmation(true);
        
        // Clean up recording stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecordingAudio(true);
    } catch (error) {
      alert.error("Cannot access microphone");
      console.error("Error accessing media devices:", error);
    }
  };

  // Stop audio recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  // Confirm and send audio
  const confirmAndSendAudio = async () => {
    if (!recordedAudio) return;
    
    // Upload and send the recorded audio
    const formData = new FormData();
    formData.append("file", recordedAudio, "recorded-audio.webm");
    try {
      const res = await dispatch(uploadMedia(formData)).unwrap();
      sendMessage({ type: "audio", mediaUrl: res.mediaUrl });
      
      // Clean up
      URL.revokeObjectURL(audioURL);
      setAudioURL("");
      setRecordedAudio(null);
      setShowAudioConfirmation(false);
    } catch (error) {
      alert.error("Failed to upload audio");
    }
  };

  // Cancel audio recording
  const cancelAudioRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL("");
    setRecordedAudio(null);
    setShowAudioConfirmation(false);
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
          <div>
            {/* Video Recording Live Preview */}
            {isRecordingVideo && (
              <div style={styles.previewContainer}>
                <video ref={videoPreviewRef} style={styles.videoPreview} muted />
                <button onClick={stopVideoRecording} style={styles.stopButton}>
                  <FontAwesomeIcon icon={faStop} /> Stop Recording
                </button>
              </div>
            )}
            
            {/* Video Confirmation UI */}
            {showVideoConfirmation && (
              <div style={styles.confirmationContainer}>
                <div style={styles.confirmationHeader}>Confirm Video Recording</div>
                <video ref={videoConfirmRef} src={videoURL} style={styles.confirmationMedia} controls />
                <div style={styles.confirmationButtons}>
                  <button onClick={cancelVideoRecording} style={styles.cancelButton}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                  <button onClick={confirmAndSendVideo} style={styles.sendButton}>
                    <FontAwesomeIcon icon={faPaperPlane} /> Send
                  </button>
                </div>
              </div>
            )}
            
            {/* Audio Recording Indicator */}
            {isRecordingAudio && (
              <div style={styles.recordingIndicator}>
                <div style={styles.pulsingDot}></div>
                <span>Recording Audio...</span>
                <button onClick={stopAudioRecording} style={styles.stopButton}>
                  <FontAwesomeIcon icon={faStop} /> Stop
                </button>
              </div>
            )}
            
            {/* Audio Confirmation UI */}
            {showAudioConfirmation && (
              <div style={styles.confirmationContainer}>
                <div style={styles.confirmationHeader}>Confirm Audio Recording</div>
                <audio src={audioURL} style={styles.confirmationAudio} controls />
                <div style={styles.confirmationButtons}>
                  <button onClick={cancelAudioRecording} style={styles.cancelButton}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                  <button onClick={confirmAndSendAudio} style={styles.sendButton}>
                    <FontAwesomeIcon icon={faPaperPlane} /> Send
                  </button>
                </div>
              </div>
            )}
            
            <div style={styles.inputContainer}>
              <div style={styles.mediaIcons}>
                {/* Upload Image */}
                <label>
                  <FontAwesomeIcon icon={faImage} style={styles.icon} title="Upload Image" />
                  <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                </label>

                {/* Video Recording */}
                <FontAwesomeIcon 
                  icon={faVideo} 
                  style={isRecordingVideo ? {...styles.icon, color: 'red'} : styles.icon} 
                  title={isRecordingVideo ? "Stop Recording Video" : "Record Video"}
                  onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                />

                {/* Audio Recording */}
                <FontAwesomeIcon 
                  icon={faMicrophone} 
                  style={isRecordingAudio ? {...styles.icon, color: 'red'} : styles.icon} 
                  title={isRecordingAudio ? "Stop Recording Audio" : "Record Audio"}
                  onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
                />
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
  previewContainer: {
    position: 'relative',
    margin: '10px 0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '10px',
    backgroundColor: '#000',
  },
  stopButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    margin: '10px 0',
  },
  pulsingDot: {
    width: '12px',
    height: '12px',
    backgroundColor: 'red',
    borderRadius: '50%',
    marginRight: '10px',
    animation: 'pulse 1.5s infinite',
    boxShadow: '0 0 0 rgba(255, 0, 0, 0.4)',
  },
  // New styles for confirmation UI
  confirmationContainer: {
    margin: '10px 0',
    padding: '15px',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    border: '1px solid #ddd',
  },
  confirmationHeader: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#6C478F',
  },
  confirmationMedia: {
    width: '100%',
    maxHeight: '200px',
    borderRadius: '10px',
    backgroundColor: '#000',
  },
  confirmationAudio: {
    width: '100%',
    height: '40px',
    marginBottom: '10px',
  },
  confirmationButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '10px',
  },
  cancelButton: {
    padding: '8px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
};