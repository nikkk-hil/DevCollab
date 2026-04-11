import React, { useEffect, useState } from "react";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice.js";

function LoginComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser({ username: usernameOrEmail, password });
      dispatch(login(user.data.data));
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginComponent;
