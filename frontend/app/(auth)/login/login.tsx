"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, clearAuthMessage, loginUser } from "@/store/authSlice";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();

  const {
    status,
    error: authError,
    message: authMessage,
  } = useAppSelector((state) => state.auth);

  const isLoading = status === "loading";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    dispatch(clearAuthError());
    dispatch(clearAuthMessage());

    try {
      await dispatch(
        loginUser({
          email: email.trim(),
          password,
        }),
      ).unwrap();
    } catch {
      // Redux stores the readable error in auth.error.
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030817] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-250px] left-1/3 h-[500px] w-[600px] rounded-full bg-pink-600/10 blur-[150px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030817_100%)]" />
      </div>

      {/* Brand */}
      <header className="absolute left-6 top-6 z-20 sm:left-10 sm:top-8">
        <Link href="/login" className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-blue-400" />

          <span className="text-2xl font-semibold tracking-tight">
            Vest<span className="text-blue-400">IQ</span>
          </span>
        </Link>

        <p className="ml-9 mt-0.5 text-[10px] tracking-wide text-slate-400">
          AI Fashion Assistant
        </p>
      </header>

      {/* Login layout */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-8 pt-28 sm:px-8 sm:pt-24">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-blue-400/30 bg-[#061329]/80 shadow-[0_0_70px_rgba(37,99,235,0.12)] backdrop-blur-xl md:grid-cols-2">
          {/* Left promotional panel */}
          <div className="relative hidden min-h-[590px] overflow-hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
              alt="Fashion inspiration"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#030817] via-[#030817]/45 to-blue-950/20" />

            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/30" />

            <div className="absolute left-8 top-1/3 max-w-sm">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-blue-300">
                Your personal style assistant
              </p>

              <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
                Your Style.
                <br />
                Smarter.
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  With AI.
                </span>
              </h1>

              <p className="mt-5 max-w-xs text-sm leading-6 text-slate-200/80">
                Try on. Get styled. Discover better options. Your fashion
                journey starts here.
              </p>
            </div>

            <div className="absolute bottom-7 left-7 right-7 flex flex-wrap gap-2">
              {["Virtual Try-On", "AI Stylist", "Smart Discovery"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-white/20 bg-black/25 px-3 py-2 text-xs text-white/90 backdrop-blur-md"
                  >
                    {feature}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Right login panel */}
          <div className="flex min-h-[590px] items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                  Welcome back
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  Welcome Back 👋
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Sign in to continue your style journey.
                </p>
              </div>

              {/* Google button — integration comes later */}
              <button
                type="button"
                onClick={() => alert("Google sign-in will be connected later.")}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-blue-400/30 bg-white/[0.03] text-sm transition hover:border-blue-400/70 hover:bg-blue-500/10"
              >
                <span className="text-lg font-bold text-blue-400">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-500">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        dispatch(clearAuthError());
                        dispatch(clearAuthMessage());
                      }}
                      required
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        dispatch(clearAuthError());
                        dispatch(clearAuthMessage());
                      }}
                      required
                      className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between gap-3 text-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-blue-500"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-sm font-medium shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>

                {authError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
                  >
                    {authError}
                  </p>
                )}

                {authMessage && status === "succeeded" && (
                  <p
                    role="status"
                    className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200"
                  >
                    {authMessage}
                  </p>
                )}
              </form>

              <p className="mt-7 text-center text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-400 transition hover:text-purple-300"
                >
                  Create account
                </Link>
              </p>

              <div className="my-6 h-px bg-white/[0.07]" />

              <p className="text-center text-xs text-slate-500">
                Your style journey starts here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
