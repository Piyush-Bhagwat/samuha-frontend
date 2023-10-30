import "./App.css";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/login.jsx";
import { Route, Routes } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/room/:id" element={<ChatRoom />} />
                <Route path="/room" element={<ChatRoom />} />
            </Routes>
        </div>
    );
}

export default App;
