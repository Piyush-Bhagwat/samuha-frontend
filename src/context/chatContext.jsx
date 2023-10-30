import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

export const chatContext = createContext(null);

export default function ChatContextProvider(props) {
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState(null);
    const [socket, setSocket] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [roomID, setRoomID] = useState(null);
    const [showNav, setShowNav] = useState(false);
    const [isUserAdmin, setUserAdmin] = useState(false);

    const [curRoomData, setCurRoomData] = useState(null);
    const [canPlay, setCanPlay] = useState(true);

    const navigate = useNavigate();
    // const server = "http://localhost:5000";
    const server = "https://sahuma-backend.onrender.com";

    const onMobile = window.innerWidth < 450;

    const getMessages = async () => {
        console.log("from get MEssage", roomID);
        if (roomID) {
            await axios
                .get(`${server}/api/msg/getRoomMsg?id=${roomID}`)
                .then((msg) => {
                     setMessages(msg.data);
                });
        } else {
            setMessages(null);
        }
    };

    // window.addEventListener("click", () => {
    //         console.log("clicke krtdda hai");
    //         setCanPlay(true);
    // }, {once: true});

    const getUserRooms = async (userID) => {
        if (userID) {
            await axios
                .get(`${server}/api/user/getRooms/?id=${userID}`)
                .then((res) => {
                    if (res.data !== "NaN") {
                        setRoomData(res.data);
                    }
                });

            navigate("/room");
        }
    };

    const signUp = async (userName, email, password) => {
        axios
            .post(`${server}/api/user/addUser`, {
                username: userName,
                email: email,
                password: password,
            })
            .then((id) => {
                console.log("Signed Up: ", id.data);

                if (id.data === "no-room") {
                    alert("No room Found!");
                } else {
                    setUser(id.data);
                    localStorage.setItem("user", JSON.stringify(id.data));
                    navigate("/room");
                }
            });
    };

    const login = async (email, pass) => {
        //Login process
        await axios
            .get(
                `${server}/api/user/getUserByEmail/?email=${email}&pass=${pass}`
            )
            .then((res) => {
                if (res.data === "no-user") {
                    alert("Enter correct password nd email");
                    return;
                } else {
                    setUser(res.data);
                    // userData = res.data;
                    console.log(res.data);
                    getUserRooms(res.data?._id);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    navigate("/room");
                }
            });
    };

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) setUser(JSON.parse(data));
    }, []);

    useEffect(() => {
        //Establishing connction to SocketIO
        const sckt = io.connect(server);

        sckt.on("connect", () => {
            setSocket(sckt);
            console.log("Socket Connected on: ", sckt.id);
        });

        return () => {
            // Clean up the socket connection when the component unmounts
            sckt?.disconnect();
            setSocket(null);
        };
    }, []);

    useEffect(() => {
        if (user) {
            console.log("ueser got");
            getUserRooms(user?._id);
            navigate("/room");
        }
    }, [user]);

    useEffect(() => {
        //watching changes in database
        const handleRoomUpdate = async () => {
            console.log("Update zala re!!!!!!!!!");

            await getMessages();
        };

        socket?.on("roomUpdate", handleRoomUpdate);
        console.log("mesages", messages);

        // Clean up the event listener before reattaching it
        return () => {
            socket?.off("roomUpdate", handleRoomUpdate);
        };
    }, [messages]);

    useEffect(() => {
        getMessages();
    }, [roomID]);

    useEffect(() => {
        if (roomData) {
            setCurRoomData(roomData?.find((room) => room.code === roomID));
            console.log(roomData?.find((room) => room.code === roomID));
        }
    }, [roomID]);

    useEffect(() => {
        if (curRoomData) {
            setUserAdmin(curRoomData?.adminID === user?._id);
        }
    }, [curRoomData]);

    const value = {
        user,
        messages,
        server,
        socket,
        roomData,
        roomID,
        onMobile,
        isUserAdmin,
        showNav,
        canPlay,
        curRoomData,
        setShowNav,
        getUserRooms,
        setRoomID,
        login,
        signUp,
        setUser,
    };
    return (
        <chatContext.Provider value={value}>
            {props.children}
        </chatContext.Provider>
    );
}
