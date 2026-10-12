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
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "SM";

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
    <main className="min-h-screen bg-[#070811] text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-9 lg:px-10">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              aria-label="Back to dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 transition hover:bg-white/[0.09] hover:text-white"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-violet-300">
                <Sparkles size={13} />
                StyleMirror
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Settings
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-300 sm:flex">
            <ShieldCheck size={15} className="text-emerald-400" />
            Account settings
          </div>
        </header>

        <section className="mb-8">
          <p className="max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Manage your profile and account details in one place.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#0b0c17] p-4">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-semibold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {[firstName, lastName].filter(Boolean).join(" ") ||
                    "Your profile"}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {email || "Account"}
                </p>
              </div>
            </div>

            <div className="my-4 h-px bg-white/[0.07]" />

            <div className="space-y-1">
              <div className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-3 text-sm text-violet-200">
                <UserRound size={17} />
                <span className="flex-1">Personal information</span>
                <ChevronRight size={15} />
              </div>

              <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500">
                <LockKeyhole size={17} />
                <span>Security</span>
                <span className="ml-auto text-[10px] uppercase tracking-wide">
                  Later
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <ShieldCheck size={15} className="text-violet-300" />
                Your account
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Profile changes are saved to your StyleMirror account.
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0c17]">
              <div className="border-b border-white/[0.07] px-5 py-5 sm:px-7">
                <h2 className="text-base font-semibold">Personal information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the name associated with your account.
                </p>
              </div>

              <div className="p-5 sm:p-7">
                <div className="mb-7 flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-xl font-semibold text-violet-200">
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
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Avatar uploads will be available when image storage is
                      configured.
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 px-3 py-1.5 text-xs text-gray-400">
                    Coming soon
                  </span>
                </div>

                {isLoading ? (
                  <div className="space-y-4 py-3" aria-live="polite">
                    <div className="h-11 animate-pulse rounded-xl bg-white/[0.05]" />
                    <div className="h-11 animate-pulse rounded-xl bg-white/[0.05]" />
                    <p className="text-sm text-gray-500">Loading profile…</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm text-gray-300">
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
                          className="w-full rounded-xl border border-white/10 bg-[#070811] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm text-gray-300">
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
                          className="w-full rounded-xl border border-white/10 bg-[#070811] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/10"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm text-gray-300">
                        Email address
                      </span>
                      <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                        <Mail size={17} className="shrink-0 text-gray-500" />
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-400">
                          {email || "No email available"}
                        </span>
                        <span className="shrink-0 text-xs text-gray-600">
                          Read-only
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-600">
                        Email changes are not supported on this page yet.
                      </p>
                    </label>

                    {fetchError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-rose-500/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-300"
                      >
                        {fetchError}
                      </div>
                    )}

                    {updateError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-rose-500/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-300"
                      >
                        {updateError}
                      </div>
                    )}

                    {message && updateStatus === "succeeded" && (
                      <div
                        role="status"
                        className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-300"
                      >
                        <Check size={16} />
                        {message}
                      </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-gray-600">
                        Changes are saved to your profile.
                      </p>
                      <button
                        type="submit"
                        disabled={isSaving || !initialized}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
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

            <section className="rounded-2xl border border-white/[0.08] bg-[#0b0c17] p-5 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <LockKeyhole size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold">Account security</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Password management and additional security controls will
                    be added in a later step.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-gray-500">
                  Planned
                </span>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.07] pt-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <span>StyleMirror · Profile settings</span>
          <Link
            href="/dashboard"
            className="w-fit text-gray-400 transition hover:text-violet-300"
          >
            Back to dashboard
          </Link>
        </footer>
      </div>
    </main>
  );
}