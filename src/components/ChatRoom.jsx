import React, { useContext, useState } from "react";
import { chatContext } from "../context/chatContext";
import axios from "axios";
import Message from "./message";
import { useNavigate } from "react-router-dom";
import RoomCard from "./roomCard";
import ChatArea from "./chatArea";
// const socket = io.connect("http://localhost:5000/");

const ChatRoom = () => {
    const {
        user,
        showNav,
        onMobile,
        setShowNav,
        roomData,
        server,
        getUserRooms,
    } = useContext(chatContext);
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [roomName, setRoomName] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const renderRooms = () => {
        return (
            <>
                {roomData?.map((room) => {
                    return <RoomCard room={room} />;
                })}
            </>
        );
    };

    const handleJoin = async () => {
        await axios
            .put(
                `${server}/api/user/joinRoom/?userID=${user?._id}&roomID=${roomCode}`
            )
            .then((res) => {
                if (res.data === "no-room") {
                    alert("Room not found");
                } else {
                    console.log("Joint");
                    getUserRooms(user?._id);
                    setShowAdd(false);
                    navigate(`/room/${roomCode}`);
                }
            });
    };

    const handleCreate = async () => {
        const data = {
            code: roomCode.toLocaleLowerCase(),
            name: roomName,
            adminID: user._id,
            adminName: user.username,
            size: 0,
        };
        await axios.post(`${server}/api/room/createRoom`, data).then((res) => {
            if (res.data === "room-created") {
                console.log("RoomCreated");
                handleJoin();
            } else {
                alert("something went wrong");
            }
        });
    };

    return (
        <div className="chat-room">
            <div className={`rooms ${showNav && "rooms-active"}`}>
                {onMobile && (
                    <button
                        className="sm-btn"
                        onClick={() => setShowNav(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
                <div className="room-nav">
                    <h2>Rooms</h2>

                    <button
                        className="sm-btn"
                        onClick={() => setShowAdd(!showAdd)}
                    >
                        {showAdd ? (
                            <i className="fa-solid fa-x"></i>
                        ) : (
                            <i className="fa-solid fa-plus"></i>
                        )}
                    </button>
                </div>
                {showAdd && (
                    <div className="add-room">
                        <div>
                            <h3>Join Room</h3>
                            <input
                                type="text"
                                className="code-input"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                placeholder="Room Code"
                            />
                            <button onClick={handleJoin}>Join</button>
                        </div>

                        <div>
                            <h3>Create Room</h3>
                            <input
                                type="text"
                                className="code-input"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Room Name"
                            />
                            <input
                                type="text"
                                className="code-input"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                placeholder="Room Code"
                            />

                            <button onClick={handleCreate}>Create</button>
                        </div>
                    </div>
                )}
                {renderRooms()}
            </div>

            <ChatArea />
        </div>
    );
};

export default ChatRoom;
