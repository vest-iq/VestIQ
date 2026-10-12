"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  Compass,
  Menu,
  Search,
  Settings,
  Sparkles,
  X,
  LogOut,
  UserRound,
  House,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutLocal } from "@/store/authSlice";

const navigation = [
  { label: "Home", href: "/dashboard", icon: House },
  { label: "Discover", href: "/dashboard/discover", icon: Compass },
  { label: "Stylist", href: "/dashboard/stylist", icon: Sparkles },
];

const features = [
  {
    title: "AI Stylist",
    description: "Get personalized outfit suggestions.",
    href: "/dashboard/stylist",
    icon: Sparkles,
    number: "01",
  },
  {
    title: "Smart Discovery",
    description: "Find similar styles & best prices.",
    href: "/dashboard/discover",
    icon: Search,
    number: "02",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Grab the authenticated user from Redux
  const { user } = useAppSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  // Calculate time of day on client mount to avoid hydration mismatch
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Format dynamic user data
  const firstName = user?.first_name || "User";
  const lastName = user?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName.charAt(0)}${
    lastName ? lastName.charAt(0) : ""
  }`.toUpperCase();

  // Secure logout handler
  const handleLogout = () => {
    dispatch(logoutLocal());
    router.replace("/login");
  };

  return (
    // Changed to h-screen and overflow-hidden to lock the viewport size
    <main className="flex h-screen w-full overflow-hidden bg-[#060613] text-white">
      
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar - Remains fixed on mobile, but static on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.05] bg-[#080914] px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 lg:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d64ce9] to-[#563cff] shadow-lg shadow-violet-500/20">
              <Sparkles size={21} />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">
                Vest
                <span className="bg-gradient-to-r from-[#e7a5ff] via-[#ad79ff] to-[#f1b7ff] bg-clip-text text-transparent">
                  IQ
                </span>
              </p>
            </div>
          </Link>
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f96b2]">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/dashboard";

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                  active
                    ? "border border-violet-400/15 bg-violet-500/10 text-white"
                    : "text-[#8f96b2] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  className={
                    active
                      ? "text-violet-400"
                      : "text-[#777d99] group-hover:text-violet-300"
                  }
                />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d7a1ff]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="mb-5 rounded-2xl border border-[#d2a2ff]/10 bg-gradient-to-br from-violet-500/[0.08] to-purple-500/[0.03] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-[#d7a1ff]">
              <Sparkles size={18} />
            </div>
            <p className="text-sm font-medium">Your style, reimagined.</p>
            <p className="mt-1 text-xs leading-5 text-[#8f96b2]">
              Discover looks that feel like you.
            </p>
          </div>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#8f96b2] transition hover:bg-white/[0.04] hover:text-white"
          >
            <Settings size={18} />
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#8f96b2] transition hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>

          <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-[#d64ce9]/20 to-[#563cff]/20 text-sm font-semibold text-[#e2a6ff]">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{fullName}</p>
              <p className="truncate text-xs text-[#777d99]">
                Personal account
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content - Allows scrolling ONLY in this section */}
      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        
        {/* Header - Stays sticky at top of scrollable section */}
        <header className="sticky top-0 z-30 flex h-[76px] flex-shrink-0 items-center justify-between border-b border-white/[0.04] bg-[#060613]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 p-2 text-gray-300 hover:bg-white/5 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-medium text-white">Your space</p>
              <p className="hidden text-xs text-[#8f96b2] sm:block">
                Your personal fashion studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/[0.05]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d64ce9] to-[#563cff] text-xs font-semibold">
                  {initials}
                </span>
                <ChevronDown
                  size={15}
                  className="hidden text-[#8f96b2] sm:block"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-white/10 bg-[#0b0c1c] p-2 shadow-2xl">
                  <div className="border-b border-white/[0.07] px-3 py-2">
                    <p className="text-sm font-medium">{fullName}</p>
                    <p className="text-xs text-[#777d99]">Personal account</p>
                  </div>
                  <Link
                    href="/settings"
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#8f96b2] hover:bg-white/5 hover:text-white"
                  >
                    <UserRound size={16} />
                    Profile & settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard body limits width but centers inside scrollable area */}
        <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#d2a2ff]">
              YOUR PERSONAL STYLE STUDIO
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {greeting}, {firstName} <span className="inline-block">👋</span>
                </h1>
                <p className="mt-3 text-sm text-[#a8adc5] sm:text-base">
                  Let&apos;s find your next perfect look.
                </p>
              </div>
              <p className="hidden items-center gap-2 text-xs text-[#777d99] md:flex">
                <span className="h-2 w-2 rounded-full bg-[#d7a1ff] shadow-[0_0_8px_rgba(215,161,255,0.6)]" />
                Your style journey starts here
              </p>
            </div>
          </motion.div>

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="group relative mt-9 min-h-[360px] overflow-hidden rounded-[28px] border border-white/[0.05] bg-[#0b0c1c] sm:min-h-[410px] lg:min-h-[430px]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(6,6,19,0.97) 0%, rgba(6,6,19,0.85) 45%, rgba(6,6,19,0.25) 100%), linear-gradient(0deg, rgba(6,6,19,0.5), transparent 60%), url('/images/fashion-hero.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center 35%",
            }}
          >
            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px] transition duration-700 group-hover:bg-violet-500/25" />
            
            <div className="relative flex min-h-[360px] max-w-2xl flex-col items-start justify-center p-7 sm:min-h-[410px] sm:p-10 lg:min-h-[430px] lg:p-14">
              <div className="mb-6 flex items-center gap-2 rounded-full border border-[#d2a2ff]/20 bg-violet-500/[0.08] px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-[#e5bdff]">
                <Sparkles size={13} />
                YOUR STYLE. YOUR RULES.
              </div>

              <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px]">
                Discover a look that&apos;s{" "}
                <span className="bg-gradient-to-r from-[#e7a5ff] via-[#ad79ff] to-[#f1b7ff] bg-clip-text text-transparent">
                  uniquely you.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#a8adc5] sm:text-base sm:leading-7">
                Explore new styles, find pieces you&apos;ll love, and create
                outfits that express who you are.
              </p>

              <Link
                href="/dashboard/discover"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#d64ce9] via-[#9745f5] to-[#563cff] px-6 py-3.5 text-sm font-semibold shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-violet-600/40"
              >
                Start Exploring
                <ArrowRight size={17} />
              </Link>
            </div>
          </motion.section>

          {/* Feature cards */}
          <section className="mt-11">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f96b2]">
                  MADE FOR YOU
                </p>
                <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                  Explore your tools
                </h2>
              </div>
              <span className="hidden text-xs text-[#777d99] sm:block">
                Two ways to elevate your style
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 + index * 0.1 }}
                  >
                    <Link
                      href={feature.href}
                      className="group flex h-full min-h-[190px] items-start gap-5 rounded-2xl border border-white/[0.05] bg-[#0b0c1c] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d2a2ff]/30 hover:bg-white/[0.035] sm:p-6"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-purple-500/10 text-[#d7a1ff] transition group-hover:border-[#e7a5ff]/40 group-hover:from-violet-500/25 group-hover:to-purple-500/20">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold tracking-widest text-[#777d99]">
                            {feature.number}
                          </span>
                          <ArrowDownRight
                            size={19}
                            className="text-[#777d99] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e7a5ff]"
                          />
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#8f96b2]">
                          {feature.description}
                        </p>
                        <p className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#d2a2ff]">
                          Explore feature
                          <ArrowRight
                            size={14}
                            className="transition group-hover:translate-x-1"
                          />
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <footer className="mt-12 border-t border-white/[0.04] py-5 text-center text-xs text-[#777d99]">
            VestIQ · Discover your personal style.
          </footer>
        </div>
      </section>
    </main>
  );
}