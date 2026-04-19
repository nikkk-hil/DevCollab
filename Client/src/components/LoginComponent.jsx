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
  const [apiCalling, setApiCalling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    if (isAuthenticated) {
      navigate("/", {replace: true});
    }
    setLoading(false)
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("")
      setApiCalling(true)
      const user = await loginUser({ username: usernameOrEmail, password });
      dispatch(login(user.data.data));
      navigate("/", {replace: true});
    } catch (error) {
      setError(error.response?.data?.message || "Login Failed, try again.")
    } finally {
      setApiCalling(false)
    }
  };

      if (loading)
        return(
            <div>
                Loading...
            </div>
        )

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
        <button type="submit" disabled={apiCalling}>Submit</button>
        {
          error && <div>
            {error}
          </div>
        }
      </form>
    </div>
  );
}

export default LoginComponent;
