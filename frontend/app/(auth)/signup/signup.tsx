"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
} from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Later we will connect this with Redux + FastAPI
    router.push("/gender");
  };

  return (
    <>
      {/* ================= ANIMATIONS ================= */}
      <style jsx>{`
        @keyframes floatOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(35px, -25px, 0) scale(1.05);
          }
        }

        @keyframes floatTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, 25px, 0) scale(1.08);
          }
        }

        @keyframes shimmerWave {
          0%,
          100% {
            transform: translateX(-8%) rotate(-8deg);
            opacity: 0.25;
          }

          50% {
            transform: translateX(8%) rotate(-6deg);
            opacity: 0.55;
          }
        }

        @keyframes lightSweep {
          0% {
            transform: translateX(-150%) rotate(18deg);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          55% {
            opacity: 0.8;
          }

          100% {
            transform: translateX(500%) rotate(18deg);
            opacity: 0;
          }
        }

        @keyframes softPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.65;
            transform: scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-[#080711] text-white">
        {/* ================= PREMIUM GLOSSY BACKGROUND ================= */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(
                  circle at 15% 15%,
                  rgba(109, 74, 255, 0.18),
                  transparent 32%
                ),
                radial-gradient(
                  circle at 85% 25%,
                  rgba(196, 123, 183, 0.13),
                  transparent 30%
                ),
                radial-gradient(
                  circle at 50% 100%,
                  rgba(139, 124, 255, 0.12),
                  transparent 38%
                )
              `,
            }}
          />

          {/* Purple floating glow */}
          <div
            className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#735cff]/20 blur-[120px]"
            style={{
              animation: "floatOne 9s ease-in-out infinite",
            }}
          />

          {/* Rose floating glow */}
          <div
            className="absolute -right-32 top-[10%] h-[400px] w-[400px] rounded-full bg-[#c47bb7]/15 blur-[120px]"
            style={{
              animation: "floatTwo 11s ease-in-out infinite",
            }}
          />

          {/* Bottom atmospheric glow */}
          <div
            className="absolute -bottom-40 left-[28%] h-[400px] w-[600px] rounded-full bg-[#8b7cff]/10 blur-[130px]"
            style={{
              animation: "softPulse 8s ease-in-out infinite",
            }}
          />

          {/* Glossy wave */}
          <div
            className="absolute -left-[15%] top-[18%] h-[190px] w-[80%] rounded-[50%] bg-gradient-to-r from-transparent via-[#9b8cff]/10 to-transparent blur-[35px]"
            style={{
              animation: "shimmerWave 8s ease-in-out infinite",
            }}
          />

          <div
            className="absolute -right-[15%] bottom-[15%] h-[170px] w-[75%] rounded-[50%] bg-gradient-to-r from-transparent via-[#d39ac6]/10 to-transparent blur-[40px]"
            style={{
              animation: "shimmerWave 10s ease-in-out infinite reverse",
            }}
          />

          {/* Moving light */}
          <div
            className="absolute -left-[20%] top-[-20%] h-[140%] w-[18%] bg-gradient-to-r from-transparent via-white/[0.025] to-transparent blur-2xl"
            style={{
              animation: "lightSweep 12s linear infinite",
            }}
          />

          <div
            className="absolute -left-[20%] top-[-20%] h-[140%] w-[10%] bg-gradient-to-r from-transparent via-[#b9adf5]/[0.035] to-transparent blur-xl"
            style={{
              animation: "lightSweep 16s linear infinite 4s",
            }}
          />

          {/* Dark vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.38) 100%)",
            }}
          />

          {/* Tiny glossy highlights */}
          <div className="absolute left-[18%] top-[12%] h-1 w-1 rounded-full bg-white/30 blur-[1px]" />
          <div className="absolute right-[22%] top-[25%] h-1 w-1 rounded-full bg-[#cfc5ff]/30 blur-[1px]" />
          <div className="absolute bottom-[18%] left-[15%] h-1 w-1 rounded-full bg-[#e2b7d8]/20 blur-[1px]" />
        </div>

        {/* ================= BRAND ================= */}
        <div className="absolute left-7 top-5 z-30">
          <Link
            href="/signup"
            className="text-lg font-semibold tracking-wide"
          >
            Vest<span className="text-[#a78bfa]">IQ</span>
          </Link>
        </div>

        {/* ================= MAIN CARD ================= */}
        <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
          <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.035] shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:grid-cols-2">
            {/* ================= IMAGE — LEFT ================= */}
            <div className="relative hidden h-[560px] overflow-hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?fm=jpg&q=60&w=3000&auto=format&fit=crop"
                alt="VestIQ fashion"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Image dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080711] via-[#080711]/15 to-transparent" />

              {/* Purple tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6d4aff]/20 via-transparent to-[#c47bb7]/20 mix-blend-screen" />

              {/* Soft image glow */}
              <div
                className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#8b7cff]/20 blur-[100px]"
                style={{
                  animation: "softPulse 7s ease-in-out infinite",
                }}
              />

              {/* Image content */}
              <div className="absolute bottom-7 left-7 right-7">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#d5ccff]">
                  Intelligent Fashion
                </p>

                <h2 className="text-2xl font-medium leading-tight">
                  Your style,
                  <br />
                  reimagined.
                </h2>

                <p className="mt-2 max-w-xs text-xs leading-5 text-white/60">
                  Discover your style and create personalized looks powered by
                  AI.
                </p>
              </div>
            </div>

            {/* ================= FORM — RIGHT ================= */}
            <div className="flex h-[560px] items-center justify-center px-7 py-8 sm:px-10">
              <div className="w-full max-w-sm">
                {/* Heading */}
                <div className="mb-5">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#a78bfa]">
                    Welcome to VestIQ
                  </p>

                  <h1 className="text-2xl font-semibold tracking-tight">
                    Create your account
                  </h1>

                  <p className="mt-2 text-xs leading-5 text-[#aaa5b8]">
                    Step into a smarter way to discover and redefine your
                    style.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[#d6d2df]">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777184]"
                      />

                      <input
                        type="text"
                        placeholder="Enter your name"
                        required
                        className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.045] pl-10 pr-3 text-xs text-white outline-none transition-all placeholder:text-[#676272] hover:border-white/[0.14] focus:border-[#9b8cff]/60 focus:bg-white/[0.065] focus:ring-2 focus:ring-[#8b7cff]/10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[#d6d2df]">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777184]"
                      />

                      <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.045] pl-10 pr-3 text-xs text-white outline-none transition-all placeholder:text-[#676272] hover:border-white/[0.14] focus:border-[#9b8cff]/60 focus:bg-white/[0.065] focus:ring-2 focus:ring-[#8b7cff]/10"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium text-[#d6d2df]">
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777184]"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                        className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.045] pl-10 pr-10 text-xs text-white outline-none transition-all placeholder:text-[#676272] hover:border-white/[0.14] focus:border-[#9b8cff]/60 focus:bg-white/[0.065] focus:ring-2 focus:ring-[#8b7cff]/10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777184] transition hover:text-white"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Create Account */}
                  <button
                    type="submit"
                    className="group mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#7669d9] via-[#8977d7] to-[#a978a5] text-xs font-medium text-white shadow-[0_7px_25px_rgba(139,124,255,0.18)] transition-all duration-300 hover:-translate-y-[1px] hover:from-[#8175e8] hover:via-[#9582e0] hover:to-[#b47eaa] hover:shadow-[0_10px_32px_rgba(139,124,255,0.3)]"
                  >
                    Create Account

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </form>

                {/* Divider */}
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.08]" />

                  <span className="text-[9px] uppercase tracking-wider text-[#706b79]">
                    or
                  </span>

                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-white/[0.09] bg-white/[0.035] text-xs text-[#ddd9e5] transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.06] hover:shadow-[0_5px_20px_rgba(139,124,255,0.08)]"
                >
                  <span className="font-semibold">G</span>
                  Continue with Google
                </button>

                {/* Login */}
                <p className="mt-4 text-center text-[10px] text-[#85808e]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[#b9adf5] transition hover:text-white"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}