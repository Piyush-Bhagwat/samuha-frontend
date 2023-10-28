import React, { useContext } from "react";
import { chatContext } from "../context/chatContext";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
    const {roomID} = useContext(chatContext);

    // console.log(roomID == room.code, room.name);
    return (
        <Link to={`/room/${room.code}`} className="room-card">
            <button className={`room-btn ${roomID === room.code && " room-active"}`}> {room.name} </button>
        </Link>
    );
};

export default RoomCard;
