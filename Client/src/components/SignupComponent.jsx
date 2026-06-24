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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-cyan-500/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-sm backdrop-blur lg:block">
          <p className="inline-flex rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
            Join DevCollab
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-100">
            Create your account and start collaborating.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Build boards, track progress, and keep your team aligned in one clean workspace.
          </p>

          <div className="mt-8 space-y-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
              Fast onboarding for new teams
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
              Share updates with activity timeline
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200">
              Keep work moving in real time
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">DevCollab</p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-100">Create account</h2>
            <p className="mt-2 text-sm text-slate-400">
              Register with your details and an avatar to get started.
            </p>
          </div>

          <form onSubmit={handleSignup} className="mt-7 space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:bg-slate-950 focus:ring"
              />
            </div>

            <div>
              <label htmlFor="username" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="jane_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:bg-slate-950 focus:ring"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="jane@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400 placeholder:text-slate-500 focus:bg-slate-950 focus:ring"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                Avatar
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
              />
              {avatar && (
                <p className="mt-2 text-xs text-slate-400">Selected: {avatar.name}</p>
              )}
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
              {apiCalling ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200 hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default SignupComponent;
