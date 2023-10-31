import "./App.css";
import ChatRoom from "./components/ChatRoom";
import Login from "./components/login.jsx";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/room/:id" element={<ChatRoom />} />
                <Route path="/room" element={<ChatRoom />} />
            </Routes>
            <ToastContainer />
        </div>
    );
}

export default App;
