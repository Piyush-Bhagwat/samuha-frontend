import React from "react";

const ChatInfo = ({visible, adminName, code, members}) => {
    return (
        <div className={`room-info ${visible && "room-info-active"}`}>
            <div><h3>Admin:</h3> {adminName}</div>
            <div> <h3>Code:</h3>  {code}</div>
            <div><h3>Members:</h3>  {members?.length}</div>
        </div>
    );
};

export default ChatInfo;
