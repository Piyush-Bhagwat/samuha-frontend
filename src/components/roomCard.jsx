import React, { useContext } from "react";
import { chatContext } from "../context/chatContext";
import { Link } from "react-router-dom";
import axios from "axios";

const RoomCard = ({ room }) => {
    const { roomID, user, setRoomID, getUserRooms, server } =
        useContext(chatContext);

    const handleExit = async () => {
        await axios
            .delete(
                `${server}/api/user/leaveRoom/?userID=${user?._id}&roomID=${room?.code}`
            )
            .then(() => {
                setRoomID(null);
                getUserRooms(user?._id);
            });
    };

    // console.log(roomID == room.code, room.name);
    return (
        <Link
            to={`/room/${room.code}`}
            className={`room-card  ${roomID === room.code && " room-active"}`}
        >
            <button className="room-btn"> <h3>{room.name}</h3> </button>
            
            <button onClick={handleExit} className="delete-room sm-btn">
            <i className="fa-solid fa-delete-left"></i>
            </button>
        </Link>
    );
};

export default RoomCard;
