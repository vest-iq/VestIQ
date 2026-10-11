"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthError,
  clearAuthMessage,
  signupUser,
} from "@/store/authSlice";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
};

export default function Signup() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  const {
    status,
    error: authError,
    message: authMessage,
  } = useAppSelector((state) => state.auth);

  const isLoading = status === "loading";

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (values.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (values.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    return nextErrors;
  }

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nameParts = values.name.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || undefined;

    try {
      await dispatch(
        signupUser({
          first_name,
          last_name,
          email: values.email.trim(),
          password: values.password,
        }),
      ).unwrap();
    } catch {
      // Redux stores the readable error in auth.error.
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080914] px-4 py-8 text-white sm:px-6 lg:py-12">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute -bottom-48 -right-32 h-[480px] w-[480px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.07] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl"
      >
        {/* Brand */}
        <Link
          href="/signup"
          className="mb-7 inline-flex items-center gap-3 sm:mb-9"
          aria-label="VestIQ home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] shadow-lg shadow-violet-950/30">
            <Sparkles className="h-5 w-5 text-violet-300" />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            Vest<span className="text-violet-300">IQ</span>
          </span>
        </Link>

        <section className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#11121f]/85 shadow-2xl shadow-black/40 backdrop-blur-2xl md:grid-cols-2">
          {/* Fashion image panel */}
          <div className="relative hidden min-h-[620px] overflow-hidden md:block">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-[#080914]/35 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#11121f]/35" />

            <div className="absolute left-8 right-8 top-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                Your personal style assistant
              </span>
            </div>

            <div className="absolute bottom-9 left-8 right-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
                Style starts here
              </p>
              <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
                Wear what feels like{" "}
                <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                  you.
                </span>
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
                Discover outfits, explore your personal style, and make more
                confident fashion choices.
              </p>

              <div className="mt-7 flex items-center gap-2">
                <span className="h-1.5 w-8 rounded-full bg-violet-300" />
                <span className="h-1.5 w-3 rounded-full bg-white/35" />
                <span className="h-1.5 w-3 rounded-full bg-white/35" />
              </div>
            </div>
          </div>

          {/* Signup form */}
          <div className="flex items-center px-5 py-9 sm:px-9 sm:py-11 lg:px-11">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-violet-300">
                  YOUR NEXT CHAPTER
                </p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Create your account
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  Build your profile and start discovering your style.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-white/80">
                    Full name
                  </Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={values.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-white/30 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-xs text-rose-300">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-white/80">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-white/30 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-xs text-rose-300">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-white/80">
                    Password
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={values.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-white/30 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/45 transition-colors hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-xs text-rose-300">
                      {errors.password}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group h-12 w-full rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Creating account..." : "Create account"}
                  {!isLoading && (
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Button>

                {authError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm text-rose-200"
                  >
                    {authError}
                  </p>
                )}

                {authMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3 text-sm text-emerald-100"
                    role="status"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{authMessage} You can now try signing in.</span>
                  </motion.div>
                )}
              </form>

              <div className="my-7 h-px bg-white/[0.08]" />

              <p className="text-center text-sm text-white/55">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-300 transition-colors hover:text-violet-200"
                >
                  Sign in
                </Link>
              </p>

              <p className="mt-7 text-center text-xs leading-5 text-white/35">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-white/30">
          Made for your style. Powered by VestIQ.
        </p>
      </motion.div>
    </main>
  );
}
