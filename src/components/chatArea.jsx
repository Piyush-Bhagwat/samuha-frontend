import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { chatContext } from "../context/chatContext";
import axios from "axios";
import Message from "./message";

const ChatArea = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const { user, showNav, setUser, setShowNav, onMobile, messages, roomID, server, setRoomID } =
        useContext(chatContext);

    useEffect(() => {
        setRoomID(id);
    }, [id]);

    const sendMessage = async () => {
        const msgData = {
            message: message,
            time: Date.now(),
            userID: user?._id,
            roomID: roomID,
            username: user?.username,
        };
        await axios.post(`${server}/api/msg/add`, msgData);

        setMessage("");
    };

    const renderMessages = () => {
        return (
            <div className="message-container">
                {messages?.map((msg) => {
                    return <Message msg={msg} />;
                })}
            </div>
        );
    };

    const handleLogout = async () => {
        navigate("/");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <div className="chats">
            <div className="chat-nav">
            {onMobile && <button className="sm-btn" onClick={()=>setShowNav(!showNav)}>hi</button>}
                <h1>{user?.username}</h1>
                <button className="sm-btn" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i></button>
            </div>

            {renderMessages()}

            <div className="input-area">
                <input
                    type="text"
                    className="input-box"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                />
                <button className="send-btn" onClick={sendMessage}>
                    send
                </button>
            </div>
        </div>
    );
};

export default ChatArea;
