import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { regiterUser } from "../api/auth.js";

function SignupComponent() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [apiCalling, setApiCalling] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (!avatar) {
      setError("Please upload an avatar image.");
      return;
    }

    try {
      setError("");
      setApiCalling(true);

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);

      await regiterUser(formData);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed, try again.");
    } finally {
      setApiCalling(false);
    }
  };

  if (loading)
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 px-4">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 shadow-sm">
          Loading signup...
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
                Join DevCollab
              </p>
              <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-50">
                Build your study circle around real progress.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                Create boards for DSA patterns, track each member’s progress, and turn prep sessions into something structured and collaborative.
              </p>
            </div>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                Join a group and start a shared DSA board
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                Keep personal todo, in-progress, and done states visible
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                Share notes, code, and AI feedback in one place
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="mx-auto max-w-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">DevCollab</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50">Create account</h2>
              <p className="mt-2 text-sm text-slate-400">
                Register with your details and an avatar to get started.
              </p>

              <form onSubmit={handleSignup} className="mt-7 space-y-4">
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="jane_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="avatar" className="mb-1.5 block text-sm font-medium text-slate-300">
                    Avatar
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    className="w-full rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
                  />
                  {avatar && (
                    <p className="mt-2 text-xs text-slate-400">Selected: {avatar.name}</p>
                  )}
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
                  {apiCalling ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
                  Sign in
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SignupComponent;
