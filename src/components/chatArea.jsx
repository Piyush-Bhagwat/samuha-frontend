import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { chatContext } from "../context/chatContext";
import axios from "axios";
import Message from "./message";
import audioFile from "../assets/audio/recived.mp3";
import ChatInfo from "./chatInfo";

const ChatArea = () => {
    const { id } = useParams();

    const container = useRef(null);
    const dummy = useRef(null);
    const audioRef = useRef(null);

    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [roomInfoVisible, setRoomInfoVisible] = useState(false);
    const {
        user,
        showNav,
        setUser,
        setShowNav,
        onMobile,
        curRoomData,
        messages,
        canPlay,
        isUserAdmin,
        roomID,
        server,
        setRoomID,
    } = useContext(chatContext);

    useEffect(() => {
        setRoomID(id);
    }, [id]);

    useEffect(() => {
        dummy.current?.scrollIntoView({ behavior: "smooth" });
        if (canPlay && messages) {
            if (messages[messages?.length - 1]?.userID !== user?._id) {
                // audioRef.current.muted = false;
                // audioRef.current.play();
            }
        }
    }, [messages]);

    const openNav = (e) => {
        e.stopPropagation();
        setShowNav(true);
    };

    const sendMessage = async () => {
        if (message == "") return;
        const msgData = {
            message: message,
            time: Date.now(),
            userID: user?._id,
            roomID: roomID,
            username: user?.username,
        };
        await axios.post(`${server}/api/msg/add`, msgData).then(() => {
            audioRef.current.muted = false;
            audioRef.current.volume = 0.3;
            audioRef.current.play();
        });
        setMessage("");
    };

    const renderMessages = () => {
        return (
            <>
                {messages?.map((msg) => {
                    return <Message msg={msg} />;
                })}

                <div className="dummy" ref={dummy}></div>
                <audio ref={audioRef} muted="true">
                    <source src={audioFile} type="audio/mpeg" />
                </audio>
            </>
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            // If the Enter key is pressed, send the message
            sendMessage();
        }
    };

    const handleLogout = async () => {
        navigate("/");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="chats">
            <div className="chat-nav">
                {onMobile && (
                    <button className="sm-btn" onClick={openNav}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                )}
                <div
                    onClick={() => {
                        setRoomInfoVisible(!roomInfoVisible);
                    }}
                    className="room-name"
                >
                    {isUserAdmin && <i className="fa-solid fa-crown"></i>}
                    {roomID ? (
                        <h1>{curRoomData?.name}</h1>
                    ) : (
                        <h1> {user?.username} </h1>
                    )}

                    <ChatInfo
                        visible={roomInfoVisible}
                        adminName={curRoomData?.adminName}
                        members={curRoomData?.members}
                        code={curRoomData?.code}
                    />
                </div>
                <button className="sm-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
            <div className="message-container" ref={container}>
                {curRoomData ? renderMessages() : <h1> Select the room </h1>}
            </div>

            {roomID && (
                <div className="input-area">
                    <input
                        type="text"
                        className="input-box"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                        }}
                        onKeyDown={handleKeyPress}
                    />
                    <button className="sm-btn send-btn" onClick={sendMessage}>
                        <i className="fa-solid fa-play"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatArea;
