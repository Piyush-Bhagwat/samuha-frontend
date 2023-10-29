import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { chatContext } from "../context/chatContext";
import axios from "axios";
import Message from "./message";

const ChatArea = () => {
    const { id } = useParams();

    const container = useRef(null);
    const dummy = useRef(null);

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

        isUserAdmin,
        roomID,
        server,
        setRoomID,
    } = useContext(chatContext);

    useEffect(() => {
        setRoomID(id);
    }, [id]);

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (message == "") return;
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
            <div className="message-container" ref={container}>
                {messages?.map((msg) => {
                    return <Message msg={msg} />;
                })}

                <div className="dummy" ref={dummy}></div>
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
                {onMobile && (
                    <button
                        className="sm-btn"
                        onClick={() => setShowNav(!showNav)}
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                )}
                <div onClick={() => {setRoomInfoVisible(!roomInfoVisible)}} className="room-name">
                    {isUserAdmin && <i className="fa-solid fa-crown"></i>}
                    <h1 >{curRoomData?.name}</h1>

                    <div className={`room-info ${ roomInfoVisible && "room-info-active"}`}>
                        Admin: "Piyush"
                        code: {curRoomData?.code}
                    </div>
                </div>
                <button className="sm-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                </button>
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
                <button className="sm-btn send-btn" onClick={sendMessage}>
                    <i className="fa-solid fa-play"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatArea;
