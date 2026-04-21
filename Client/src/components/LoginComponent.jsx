import React, { useEffect, useState } from "react";
import { loginUser } from "../api/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice.js";

function LoginComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiCalling, setApiCalling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail.trim() || !password.trim()) {
      setError("Username/email and password are required.");
      return;
    }

    try {
      setError("");
      setApiCalling(true);
      const user = await loginUser({ username: usernameOrEmail, password });
      dispatch(login(user.data.data));
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Login failed, try again.");
    } finally {
      setApiCalling(false);
    }
  };

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 px-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 shadow-sm">
          Checking your session...
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-cyan-500/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-sm backdrop-blur lg:block">
          <p className="inline-flex rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
            Welcome Back
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-100">
            Log in and continue building with DevCollab.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Manage boards, track progress, and collaborate with your team from one place.
          </p>

          <div className="mt-8 space-y-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
              Real-time board collaboration
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
              Activity timeline and updates
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
              Fast workflow for interviews and projects
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">DevCollab</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-100">Login</h2>
            <p className="mt-2 text-sm text-slate-400">Use your username or email and password to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <div>
              <label htmlFor="usernameOrEmail" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                placeholder="jane_doe or jane@mail.com"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:bg-slate-950 focus:ring"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:bg-slate-950 focus:ring"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={apiCalling}
              className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {apiCalling ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            New to DevCollab?{" "}
            <Link to="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200 hover:underline">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginComponent;
