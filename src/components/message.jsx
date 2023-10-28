import React, { useContext} from "react";
import { chatContext } from "../context/chatContext";
import { getTime } from "../utils/getTime";

const Message = ({ msg }) => {
    const { user} = useContext(chatContext);

    const userMsg = (msg.userID === user?._id); 

    return (
        <div className={`message-card ${userMsg && "msg-self"}`}>
        {!userMsg && <div className="user-name">{msg.username[0]}</div>}
            <div className="message">
                {msg.message}

                <div className="time">{getTime(msg.time)}</div>
            </div>
        {userMsg && <div className="user-name">{msg.username[0]}</div>}
        </div>
    );
};

export default Message;
