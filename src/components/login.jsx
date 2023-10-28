import React, { useContext, useState } from "react";
import { chatContext } from "../context/chatContext";

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUsername] = useState("");

    const { user, signUp, login } = useContext(chatContext);

    const handleSignup = async () => {
        await signUp(userName, email, password);
    };

    const handleLogin = async () => {
        await login(email, password);
    };

    return (
        <div className="login">
            <div className="signup-card">
                <h1>Sign Up</h1>
                <input
                    type="text"
                    placeholder="userName"
                    onChange={(e) => setUsername(e.target.value)}
                    value={userName}
                />
                <input
                    type="email"
                    placeholder="email"
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                />
                <input
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignup}>Enter Room</button>
            </div>

            <div className="signup-card">
                <h1>Login</h1>
                <input
                    type="email"
                    placeholder="email"
                    autoComplete="true"
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                />
                <input
                    type="text"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Enter Room</button>
            </div>
        </div>
    );
};

export default Login;
