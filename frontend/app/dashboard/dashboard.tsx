"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Compass,
  Menu,
  Search,
  Settings,
  Shirt,
  Sparkles,
  X,
  LogOut,
  UserRound,
  House,
} from "lucide-react";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#070811] text-white">
      <div className="flex min-h-screen">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0a0b15] px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-12 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Sparkles size={21} />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight">VestIQ</p>
                <p className="text-[10px] tracking-[0.24em] text-gray-500">
                  PERSONAL STYLE AI
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

          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = item.href === "/dashboard";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
                    active
                      ? "border border-indigo-400/15 bg-indigo-500/10 text-white"
                      : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    size={19}
                    className={
                      active
                        ? "text-indigo-400"
                        : "text-gray-500 group-hover:text-indigo-300"
                    }
                  />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="mb-5 rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.12] to-purple-500/[0.04] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                <Sparkles size={18} />
              </div>
              <p className="text-sm font-medium">Your style, reimagined.</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Discover looks that feel like you.
              </p>
            </div>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <Settings size={18} />
              Settings
            </Link>

            <button
              onClick={() => (window.location.href = "/login")}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>

            <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-sm font-semibold">
                RR
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">Rishika Rajput</p>
                <p className="truncate text-xs text-gray-500">
                  Personal account
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#070811]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
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
                <p className="hidden text-xs text-gray-500 sm:block">
                  Your personal fashion studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  aria-label="Notifications"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-[#11121e] p-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Notifications</p>
                      <button
                        aria-label="Close notifications"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        <X size={15} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Sparkles
                        size={17}
                        className="shrink-0 text-violet-400"
                      />
                      <p className="text-xs leading-5 text-gray-400">
                        Your personal style studio is ready to explore.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/[0.05]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold">
                    RR
                  </span>
                  <ChevronDown
                    size={15}
                    className="hidden text-gray-500 sm:block"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-white/10 bg-[#11121e] p-2 shadow-2xl">
                    <div className="border-b border-white/[0.07] px-3 py-2">
                      <p className="text-sm font-medium">Rishika Rajput</p>
                      <p className="text-xs text-gray-500">Personal account</p>
                    </div>
                    <Link
                      href="/settings"
                      className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                      <UserRound size={16} />
                      Profile & settings
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Dashboard body */}
          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-sm font-medium text-indigo-300">
                YOUR PERSONAL STYLE STUDIO
              </p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Good morning, Rishika{" "}
                    <span className="inline-block">👋</span>
                  </h1>
                  <p className="mt-3 text-sm text-gray-400 sm:text-base">
                    Let&apos;s find your next perfect look.
                  </p>
                </div>
                <p className="hidden items-center gap-2 text-xs text-gray-500 md:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Your style journey starts here
                </p>
              </div>
            </motion.div>

            {/* Hero */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="group relative mt-9 min-h-[360px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#151322] sm:min-h-[410px] lg:min-h-[430px]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(7,8,17,0.97) 0%, rgba(7,8,17,0.88) 38%, rgba(7,8,17,0.25) 100%), linear-gradient(0deg, rgba(7,8,17,0.5), transparent 60%), url('/images/fashion-hero.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center 35%",
              }}
            >
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-purple-600/15 blur-[100px] transition duration-700 group-hover:bg-purple-500/25" />
              <div className="relative flex min-h-[360px] max-w-2xl flex-col items-start justify-center p-7 sm:min-h-[410px] sm:p-10 lg:min-h-[430px] lg:p-14">
                <div className="mb-6 flex items-center gap-2 rounded-full border border-purple-300/20 bg-purple-400/[0.08] px-3 py-1.5 text-xs font-medium text-purple-200">
                  <Sparkles size={14} />
                  YOUR STYLE. YOUR RULES.
                </div>

                <h2 className="max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px]">
                  Discover a look that&apos;s{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                    uniquely you.
                  </span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
                  Explore new styles, find pieces you&apos;ll love, and create
                  outfits that express who you are.
                </p>

                <Link
                  href="/dashboard/discover"
                  className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-indigo-950/50 transition hover:-translate-y-0.5 hover:shadow-indigo-500/20"
                >
                  Start Exploring
                  <ArrowRight size={17} />
                </Link>

                <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex -space-x-2">
                    <span className="h-6 w-6 rounded-full border-2 border-[#141321] bg-gradient-to-br from-pink-400 to-orange-300" />
                    <span className="h-6 w-6 rounded-full border-2 border-[#141321] bg-gradient-to-br from-indigo-400 to-cyan-300" />
                    <span className="h-6 w-6 rounded-full border-2 border-[#141321] bg-gradient-to-br from-purple-400 to-pink-300" />
                  </span>
                  <span>Made for your personal style</span>
                </div>
              </div>
            </motion.section>

            {/* Feature cards */}
            <section className="mt-11">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                    MADE FOR YOU
                  </p>
                  <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                    Explore your tools
                  </h2>
                </div>
                <span className="hidden text-xs text-gray-500 sm:block">
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
                        className="group flex h-full min-h-[190px] items-start gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-500/[0.045] sm:p-6"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 text-indigo-300 transition group-hover:border-indigo-400/30 group-hover:from-indigo-500/25 group-hover:to-purple-500/20">
                          <Icon size={22} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs tracking-widest text-gray-600">
                              {feature.number}
                            </span>
                            <ArrowDownRight
                              size={19}
                              className="text-gray-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-300"
                            />
                          </div>
                          <h3 className="mt-3 text-lg font-semibold">
                            {feature.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-gray-400">
                            {feature.description}
                          </p>
                          <p className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-indigo-300">
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

            <footer className="mt-12 border-t border-white/[0.06] py-5 text-center text-xs text-gray-600">
              VestIQ · Discover your personal style.
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
