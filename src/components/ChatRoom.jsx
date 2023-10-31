import React, { useContext, useEffect, useRef, useState } from "react";
import { chatContext } from "../context/chatContext";
import axios from "axios";
import Message from "./message";
import { useNavigate } from "react-router-dom";
import RoomCard from "./roomCard";
import ChatArea from "./chatArea";
import { toast } from "react-toastify";
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
        setDarkTheme,
        darkTheme,
    } = useContext(chatContext);

    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [roomName, setRoomName] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const navRef = useRef(null);

    const renderRooms = () => {
        return (
            <>
                {roomData?.map((room, id) => {
                    return <RoomCard room={room} key={id} />;
                })}
            </>
        );
    };

    const handleJoin = async () => {
        await axios
            .put(
                `${server}/api/user/joinRoom/?userID=${
                    user?._id
                }&roomID=${roomCode.toLowerCase()}`
            )
            .then((res) => {
                if (res.data === "no-room") {
                    toast.error("Room Not Found", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: darkTheme ? "dark" : "light",
                    });
                } else {
                    console.log("Joint");
                    getUserRooms(user?._id);
                    setShowAdd(false);
                    navigate(`/room/${roomCode}`);
                    toast.info("Room Joint", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: darkTheme ? "dark" : "light",
                    });
                }
            });
    };

    const handleCreate = async () => {
        const data = {
            code: roomCode.toLowerCase(),
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
                toast.error("Someting went wrong", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: darkTheme ? "dark" : "light",
                });
            }
        });
    };

    useEffect(() => {
        const closeNavIfClickedOutside = (e) => {
            if (
                showNav &&
                navRef.current &&
                !navRef.current.contains(e.target)
            ) {
                // If showNav is true and the click is outside the navigation menu, close the menu.
                setShowNav(false);
            }
        };

        document.addEventListener("click", closeNavIfClickedOutside);

        return () => {
            document.removeEventListener("click", closeNavIfClickedOutside);
        };
    }, []);

    return (
        <div className={`chat-room ${darkTheme && "dark"}`}>
            <div className="background"></div>
            <div className={`rooms ${showNav && "rooms-active"}`} ref={navRef}>
                {onMobile && (
                    <button
                        className="sm-btn"
                        onClick={() => setShowNav(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}

                <div className="user-info"></div>

                <div className="room-nav">
                    <button
                        className="sm-btn"
                        onClick={() => {
                            setDarkTheme((prev) => !prev);
                        }}
                    >
                        {darkTheme ? (
                            <i className="fa-solid fa-sun"></i>
                        ) : (
                            <i className="fa-solid fa-moon"></i>
                        )}
                    </button>
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
