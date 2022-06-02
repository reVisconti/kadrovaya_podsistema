import "./App.css";
import LoginPanel from "./components/LoginPanel";
import { Route, Routes, Link, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import useToken from "./utils/auth";

function App() {
  const { token, setToken, removeToken } = useToken();
  if (!token) {
    return <LoginPanel setToken={setToken} />;
  }
  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home removeToken={removeToken} />} />
        <Route path="/" element={<Navigate replace to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;
