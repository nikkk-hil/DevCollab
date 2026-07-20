import React, { useEffect, useState } from "react";
import { loginUser } from "../api/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice.js";

function LoginComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
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

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      setError("");
      setApiCalling(true);
      const user = await loginUser({ username: username, password });
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
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-900/80 shadow-[0_20px_70px_rgba(2,6,23,0.45)] backdrop-blur md:grid md:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden border-b border-slate-800 bg-slate-950/70 p-8 md:flex md:flex-col md:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Welcome back
              </p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-50">
                Study together, solve smarter.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                DevCollab helps placement-prep groups track DSA problems, share progress, and get AI feedback in one shared workspace.
              </p>
            </div>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                Shared DSA boards for your study group
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                Personal progress tracking for every problem
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                AI feedback on approach, complexity, and improvement
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="mx-auto max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">DevCollab</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">Login</h2>
              <p className="mt-2 text-sm text-slate-400">
                Use your username or email and password to continue.
              </p>

              <form onSubmit={handleLogin} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={apiCalling}
                  className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {apiCalling ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                New to DevCollab?{" "}
                <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                  Create an account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
