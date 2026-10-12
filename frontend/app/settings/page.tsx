"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearProfileErrors,
  fetchProfile,
  updateProfile,
} from "@/store/profileSlice";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleUserRound,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SettingsPage() {
  const dispatch = useAppDispatch();

  const { user, accessToken } = useAppSelector((state) => state.auth);
  const {
    profile,
    fetchStatus,
    updateStatus,
    fetchError,
    updateError,
    message,
  } = useAppSelector((state) => state.profile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (accessToken) {
      void dispatch(fetchProfile());
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (!profile) return;

    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setInitialized(true);
  }, [profile]);

  const email = user?.email ?? "";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "VI";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(clearProfileErrors());

    void dispatch(
      updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }),
    );
  }

  const isSaving = updateStatus === "loading";
  const isLoading = fetchStatus === "loading" && !profile;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#060613] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-9 lg:px-10">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/dashboard"
                aria-label="Back to dashboard"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-[#8f96b2] transition hover:bg-white/[0.05] hover:text-white"
              >
                <ArrowLeft size={18} />
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d2a2ff]">
                  <Sparkles size={13} />
                  VestIQ
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Settings
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-[#a8adc5] sm:flex">
              <ShieldCheck size={15} className="text-[#d7a1ff]" />
              Account settings
            </div>
          </header>

          <section className="mb-8">
            <p className="max-w-2xl text-sm leading-6 text-[#a8adc5] sm:text-base">
              Manage your profile and account details in one place.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            {/* Sidebar / Profile Summary */}
            <aside className="h-fit rounded-2xl border border-white/[0.05] bg-[#080914] p-4">
              <div className="flex items-center gap-3 px-2 py-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d64ce9] to-[#563cff] text-sm font-semibold shadow-lg shadow-violet-900/20">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {[firstName, lastName].filter(Boolean).join(" ") ||
                      "Your profile"}
                  </p>
                  <p className="truncate text-xs text-[#777d99]">
                    {email || "Account"}
                  </p>
                </div>
              </div>

              <div className="my-4 h-px bg-white/[0.04]" />

              <div className="space-y-1">
                <div className="flex items-center gap-3 rounded-xl border border-violet-400/15 bg-violet-500/[0.08] px-3 py-3 text-sm text-[#e5bdff]">
                  <UserRound size={17} />
                  <span className="flex-1">Personal information</span>
                  <ChevronRight size={15} />
                </div>

                <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#8f96b2]">
                  <LockKeyhole size={17} />
                  <span>Security</span>
                  <span className="ml-auto text-[10px] uppercase tracking-wide">
                    Later
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                <div className="flex items-center gap-2 text-xs font-medium text-[#d9dbea]">
                  <ShieldCheck size={15} className="text-[#d7a1ff]" />
                  Your account
                </div>
                <p className="mt-2 text-xs leading-5 text-[#777d99]">
                  Profile changes are saved to your VestIQ account.
                </p>
              </div>
            </aside>

            {/* Main Form Section */}
            <div className="min-w-0 space-y-6">
              <section className="overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0b0c1c]">
                <div className="border-b border-white/[0.04] px-5 py-5 sm:px-7">
                  <h2 className="text-base font-semibold">Personal information</h2>
                  <p className="mt-1 text-sm text-[#8f96b2]">
                    Update the name associated with your account.
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="mb-7 flex flex-col gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 text-xl font-semibold text-[#d7a1ff]">
                      {profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatar_url}
                          alt="Profile avatar"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        initials || <CircleUserRound size={26} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Profile picture</p>
                      <p className="mt-1 text-xs leading-5 text-[#777d99]">
                        Avatar uploads will be available when image storage is
                        configured.
                      </p>
                    </div>
                    <span className="w-fit rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#8f96b2]">
                      Coming soon
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="space-y-4 py-3" aria-live="polite">
                      <div className="h-11 animate-pulse rounded-xl bg-white/[0.03]" />
                      <div className="h-11 animate-pulse rounded-xl bg-white/[0.03]" />
                      <p className="text-sm text-[#777d99]">Loading profile…</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm text-[#d9dbea]">
                            First name
                          </span>
                          <input
                            value={firstName}
                            onChange={(event) =>
                              setFirstName(event.target.value)
                            }
                            maxLength={100}
                            autoComplete="given-name"
                            placeholder="Enter your first name"
                            className="w-full rounded-xl border border-white/10 bg-[#060613] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#6d7697] focus:border-[#d7a1ff]/50 focus:ring-1 focus:ring-violet-400/20"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm text-[#d9dbea]">
                            Last name
                          </span>
                          <input
                            value={lastName}
                            onChange={(event) =>
                              setLastName(event.target.value)
                            }
                            maxLength={100}
                            autoComplete="family-name"
                            placeholder="Enter your last name"
                            className="w-full rounded-xl border border-white/10 bg-[#060613] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#6d7697] focus:border-[#d7a1ff]/50 focus:ring-1 focus:ring-violet-400/20"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <span className="mb-2 block text-sm text-[#d9dbea]">
                          Email address
                        </span>
                        <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3">
                          <Mail size={17} className="shrink-0 text-[#777d99]" />
                          <span className="min-w-0 flex-1 truncate text-sm text-[#8f96b2]">
                            {email || "No email available"}
                          </span>
                          <span className="shrink-0 text-xs text-[#6d7697]">
                            Read-only
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[#6d7697]">
                          Email changes are not supported on this page yet.
                        </p>
                      </label>

                      {fetchError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-rose-500/20 bg-rose-500/[0.05] px-4 py-3 text-sm text-rose-300"
                        >
                          {fetchError}
                        </div>
                      )}

                      {updateError && (
                        <div
                          role="alert"
                          className="rounded-xl border border-rose-500/20 bg-rose-500/[0.05] px-4 py-3 text-sm text-rose-300"
                        >
                          {updateError}
                        </div>
                      )}

                      {message && updateStatus === "succeeded" && (
                        <div
                          role="status"
                          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-300"
                        >
                          <Check size={16} />
                          {message}
                        </div>
                      )}

                      <div className="flex flex-col-reverse gap-3 border-t border-white/[0.04] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-[#777d99]">
                          Changes are saved to your profile.
                        </p>
                        <button
                          type="submit"
                          disabled={isSaving || !initialized}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d64ce9] via-[#9745f5] to-[#563cff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:shadow-violet-600/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Saving…
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Save changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </section>

              {/* Security Placeholder */}
              <section className="rounded-2xl border border-white/[0.05] bg-[#0b0c1c] p-5 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-[#d7a1ff]">
                    <LockKeyhole size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold">Account security</h2>
                    <p className="mt-1 text-sm leading-6 text-[#8f96b2]">
                      Password management and additional security controls will
                      be added in a later step.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-[#777d99]">
                    Planned
                  </span>
                </div>
              </section>
            </div>
          </div>

          <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.04] pt-5 text-xs text-[#777d99] sm:flex-row sm:items-center sm:justify-between">
            <span>VestIQ · Profile settings</span>
            <Link
              href="/dashboard"
              className="w-fit text-[#8f96b2] transition hover:text-[#d7a1ff]"
            >
              Back to dashboard
            </Link>
          </footer>
        </div>
      </main>
    </ProtectedRoute>
  );
}