// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";

// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { clearAuthError, clearAuthMessage, loginUser } from "@/store/authSlice";

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const dispatch = useAppDispatch();

//   const {
//     status,
//     error: authError,
//     message: authMessage,
//   } = useAppSelector((state) => state.auth);

//   const isLoading = status === "loading";

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     dispatch(clearAuthError());
//     dispatch(clearAuthMessage());

//     try {
//       await dispatch(
//         loginUser({
//           email: email.trim(),
//           password,
//         }),
//       ).unwrap();
//     } catch {
//       // Redux stores the readable error in auth.error.
//     }
//   }

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#030817] text-white">
//       {/* Background effects */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden">
//         <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
//         <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
//         <div className="absolute bottom-[-250px] left-1/3 h-[500px] w-[600px] rounded-full bg-pink-600/10 blur-[150px]" />

//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030817_100%)]" />
//       </div>

//       {/* Brand */}
//       <header className="absolute left-6 top-6 z-20 sm:left-10 sm:top-8">
//         <Link href="/login" className="flex items-center gap-2">
//           <Sparkles className="h-7 w-7 text-blue-400" />

//           <span className="text-2xl font-semibold tracking-tight">
//             Vest<span className="text-blue-400">IQ</span>
//           </span>
//         </Link>

//         <p className="ml-9 mt-0.5 text-[10px] tracking-wide text-slate-400">
//           AI Fashion Assistant
//         </p>
//       </header>

//       {/* Login layout */}
//       <section className="relative z-10 flex min-h-screen items-center justify-center px-4 pb-8 pt-28 sm:px-8 sm:pt-24">
//         <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-blue-400/30 bg-[#061329]/80 shadow-[0_0_70px_rgba(37,99,235,0.12)] backdrop-blur-xl md:grid-cols-2">
//           {/* Left promotional panel */}
//           <div className="relative hidden min-h-[590px] overflow-hidden md:block">
//             <img
//               src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
//               alt="Fashion inspiration"
//               className="absolute inset-0 h-full w-full object-cover"
//             />

//             <div className="absolute inset-0 bg-gradient-to-t from-[#030817] via-[#030817]/45 to-blue-950/20" />

//             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/30" />

//             <div className="absolute left-8 top-1/3 max-w-sm">
//               <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-blue-300">
//                 Your personal style assistant
//               </p>

//               <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
//                 Your Style.
//                 <br />
//                 Smarter.
//                 <br />
//                 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   With AI.
//                 </span>
//               </h1>

//               <p className="mt-5 max-w-xs text-sm leading-6 text-slate-200/80">
//                 Try on. Get styled. Discover better options. Your fashion
//                 journey starts here.
//               </p>
//             </div>

//             <div className="absolute bottom-7 left-7 right-7 flex flex-wrap gap-2">
//               {["Virtual Try-On", "AI Stylist", "Smart Discovery"].map(
//                 (feature) => (
//                   <span
//                     key={feature}
//                     className="rounded-full border border-white/20 bg-black/25 px-3 py-2 text-xs text-white/90 backdrop-blur-md"
//                   >
//                     {feature}
//                   </span>
//                 ),
//               )}
//             </div>
//           </div>

//           {/* Right login panel */}
//           <div className="flex min-h-[590px] items-center justify-center px-6 py-10 sm:px-10">
//             <div className="w-full max-w-sm">
//               <div className="mb-8">
//                 <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
//                   Welcome back
//                 </p>

//                 <h2 className="text-3xl font-semibold tracking-tight">
//                   Welcome Back 👋
//                 </h2>

//                 <p className="mt-3 text-sm leading-6 text-slate-400">
//                   Sign in to continue your style journey.
//                 </p>
//               </div>

//               {/* Google button — integration comes later */}
//               <button
//                 type="button"
//                 onClick={() => alert("Google sign-in will be connected later.")}
//                 className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-blue-400/30 bg-white/[0.03] text-sm transition hover:border-blue-400/70 hover:bg-blue-500/10"
//               >
//                 <span className="text-lg font-bold text-blue-400">G</span>
//                 Continue with Google
//               </button>

//               <div className="my-6 flex items-center gap-4">
//                 <div className="h-px flex-1 bg-white/10" />
//                 <span className="text-xs text-slate-500">or</span>
//                 <div className="h-px flex-1 bg-white/10" />
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Email */}
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="mb-2 block text-xs font-medium text-slate-300"
//                   >
//                     Email address
//                   </label>

//                   <div className="relative">
//                     <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                     <input
//                       id="email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         dispatch(clearAuthError());
//                         dispatch(clearAuthMessage());
//                       }}
//                       required
//                       className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/10"
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="mb-2 block text-xs font-medium text-slate-300"
//                   >
//                     Password
//                   </label>

//                   <div className="relative">
//                     <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//                     <input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="current-password"
//                       placeholder="Enter your password"
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                         dispatch(clearAuthError());
//                         dispatch(clearAuthMessage());
//                       }}
//                       required
//                       className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/10"
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((value) => !value)}
//                       aria-label={
//                         showPassword ? "Hide password" : "Show password"
//                       }
//                       className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
//                     >
//                       {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Remember me */}
//                 <div className="flex items-center justify-between gap-3 text-xs">
//                   <label className="flex cursor-pointer items-center gap-2 text-slate-400">
//                     <input
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                       className="accent-blue-500"
//                     />
//                     Remember me
//                   </label>

//                   <Link
//                     href="/forgot-password"
//                     className="text-blue-400 transition hover:text-blue-300"
//                   >
//                     Forgot password?
//                   </Link>
//                 </div>

//                 {/* Submit */}

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-sm font-medium shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {isLoading ? "Signing in..." : "Sign In"}
//                   {!isLoading && (
//                     <ArrowRight
//                       size={16}
//                       className="transition-transform group-hover:translate-x-1"
//                     />
//                   )}
//                 </button>

//                 {authError && (
//                   <p
//                     role="alert"
//                     className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200"
//                   >
//                     {authError}
//                   </p>
//                 )}

//                 {authMessage && status === "succeeded" && (
//                   <p
//                     role="status"
//                     className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200"
//                   >
//                     {authMessage}
//                   </p>
//                 )}
//               </form>

//               <p className="mt-7 text-center text-xs text-slate-400">
//                 Don&apos;t have an account?{" "}
//                 <Link
//                   href="/signup"
//                   className="font-medium text-blue-400 transition hover:text-purple-300"
//                 >
//                   Create account
//                 </Link>
//               </p>

//               <div className="my-6 h-px bg-white/[0.07]" />

//               <p className="text-center text-xs text-slate-500">
//                 Your style journey starts here.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added router import
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthError,
  clearAuthMessage,
  loginUser,
} from "@/store/authSlice";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const fashionSlides = [
  {
     image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90",
    eyebrow: "YOUR STYLE, REIMAGINED",
    title: "Fashion that",
    highlight: "feels like you.",
    description:
      "Discover a more personal way to explore fashion, express yourself, and find your next favourite look.",
    position: "center 35%",
  },
  {
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=90",
    eyebrow: "MADE FOR YOUR STYLE",
    title: "Every look,",
    highlight: "more you.",
    description:
      "Explore styles that complement your preferences and bring your fashion ideas to life.",
    position: "center 35%",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=90",
    eyebrow: "A SMARTER WARDROBE",
    title: "Find your",
    highlight: "next favourite.",
    description:
      "Move beyond endless scrolling and make discovering your next outfit feel effortless.",
    position: "center 35%",
  },
  {
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1400&q=90",
    eyebrow: "THE FUTURE OF FASHION",
    title: "Your style.",
    highlight: "Powered by AI.",
    description:
      "Step into a more intelligent fashion experience designed around you and your choices.",
    position: "center 30%",
  },
];

export default function Login() {
  const router = useRouter(); // Initialized the router
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [buttonPressed, setButtonPressed] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const dispatch = useAppDispatch();

  const {
    status,
    error: authError,
    message: authMessage,
    user,
    accessToken
  } = useAppSelector((state) => state.auth);

  const isLoading = status === "loading";

  useEffect(() => {
    if (user && accessToken) {
      router.replace("/dashboard");
    }
  }, [user, accessToken, router]);

  useEffect(() => {
    if (isCarouselPaused) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % fashionSlides.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isCarouselPaused]);

  if (user && accessToken) {
    return null; 
  }

  function validate(): LoginErrors {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    }

    return nextErrors;
  }

  function updateEmail(value: string) {
    setEmail(value);
    setErrors((current) => ({ ...current, email: undefined }));
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }

  function updatePassword(value: string) {
    setPassword(value);
    setErrors((current) => ({ ...current, password: undefined }));
    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setButtonPressed(true);

    dispatch(clearAuthError());
    dispatch(clearAuthMessage());

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      await dispatch(
        loginUser({
          email: email.trim(),
          password,
        }),
      ).unwrap();

      // Remember-me persistence is not connected to token storage yet.
      void rememberMe;
      
      // Redirect to dashboard on successful login
      router.push("/dashboard");
      
    } catch {
      // Redux stores the readable API error in auth.error.
    }
  }

  const slide = fashionSlides[activeSlide];

  return (
    <main className="login-background relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-12 text-white sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[140px]" />
      </div>

      <Link
        href="/login"
        aria-label="VestIQ home"
        className="brand-logo absolute left-5 top-5 z-20 text-3xl font-semibold tracking-tight sm:left-8 sm:top-7"
      >
        Vest<span className="brand-iq">IQ</span>
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="login-frame relative z-10 w-full max-w-[1000px]"
      >
        <div className="login-card grid h-[590px] w-full overflow-hidden md:grid-cols-2">
          {/* LEFT: Animated fashion carousel */}
          <section
            className="fashion-panel relative hidden min-h-0 overflow-hidden md:block"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            aria-label="VestIQ fashion inspiration"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.image}
                src={slide.image}
                alt="Fashion inspiration"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: slide.position }}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.8 },
                  scale: { duration: 5, ease: "linear" },
                }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#070713] via-[#070713]/45 to-[#080817]/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a19]/25" />

            {/* Text changes with every image */}
            <div className="absolute bottom-[76px] left-8 right-8 lg:left-9 lg:right-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <p className="mb-4 text-[10px] font-semibold tracking-[0.24em] text-[#e0b4ff]">
                    {slide.eyebrow}
                  </p>

                  <h1 className="max-w-[390px] text-[36px] font-semibold leading-[1.15] tracking-tight lg:text-[42px]">
                    {slide.title}
                    <br />
                    <span className="bg-gradient-to-r from-[#f2b3ff] via-[#d0a6ff] to-[#a998ff] bg-clip-text text-transparent">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-[325px] text-[13px] leading-6 text-white/75">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Minimal slide indicators */}
              <div className="mt-7 flex items-center gap-2">
                {fashionSlides.map((item, index) => (
                  <button
                    key={item.eyebrow}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show fashion slide ${index + 1}`}
                    aria-current={activeSlide === index ? "true" : undefined}
                    className={`slide-indicator ${
                      activeSlide === index ? "slide-indicator-active" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: Login form */}
          <section className="login-form-panel flex min-h-0 flex-col justify-center px-6 py-7 sm:px-9 lg:px-10">
            <div className="mx-auto flex w-full max-w-[390px] flex-col">
              <header className="mb-6">
                <p className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-[#d2a2ff]">
                  WELCOME BACK
                </p>

                <h2 className="text-[30px] font-semibold leading-tight tracking-tight sm:text-[32px]">
                  Sign in to VestIQ
                </h2>

                <p className="mt-2 text-[13px] leading-5 text-[#a8adc5]">
                  Pick up where your style journey left off.
                </p>
              </header>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3"
              >
                {/* Email */}
                <div className="field-group">
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-[12px] font-medium text-[#d9dbea]"
                  >
                    Email address
                  </label>

                  <div className="input-shell">
                    <Mail aria-hidden="true" className="input-icon ml-3" />

                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => updateEmail(event.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby="login-email-error"
                      className="auth-input pr-0"
                    />
                  </div>

                  <p id="login-email-error" className="field-error">
                    {errors.email || "\u00a0"}
                  </p>
                </div>

                {/* Password */}
                <div className="field-group">
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-[12px] font-medium text-[#d9dbea]"
                  >
                    Password
                  </label>

                  <div className="input-shell">
                    <LockKeyhole
                      aria-hidden="true"
                      className="input-icon ml-3"
                    />

                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) =>
                        updatePassword(event.target.value)
                      }
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby="login-password-error"
                      className="auth-input password-input"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="password-toggle"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[17px] w-[17px]" />
                      ) : (
                        <Eye className="h-[17px] w-[17px]" />
                      )}
                    </button>
                  </div>

                  <p id="login-password-error" className="field-error">
                    {errors.password || "\u00a0"}
                  </p>
                </div>

                {/* Remember me and forgot password */}
                <div className="flex min-h-8 items-center justify-between gap-3 text-[11px]">
                  <label className="flex cursor-pointer items-center gap-2 text-[#a8adc5]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="h-3.5 w-3.5 accent-violet-500"
                    />
                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[#d2a2ff] transition-colors hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* API feedback */}
                <div className="feedback-slot" aria-live="polite">
                  {authError ? (
                    <p
                      role="alert"
                      className="feedback-message error-message"
                    >
                      {authError}
                    </p>
                  ) : authMessage && status === "succeeded" ? (
                    <p
                      role="status"
                      className="feedback-message success-message"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-2">{authMessage}</span>
                    </p>
                  ) : null}
                </div>

                {/* Sign-in button */}
                <motion.div whileTap={{ scale: 0.985 }} className="relative">
                  <button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setButtonPressed(true)}
                    className={`login-submit group relative flex h-[48px] w-full items-center justify-center overflow-hidden rounded-full text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                      buttonPressed ? "button-click-shine" : ""
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? "Signing in..." : "Sign In"}
                      {!isLoading && (
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </span>

                    <span
                      aria-hidden="true"
                      className="button-gloss pointer-events-none absolute inset-0"
                    />
                  </button>
                </motion.div>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.09]" />

                <p className="whitespace-nowrap text-[12px] text-[#8f96b2]">
                  New to VestIQ?
                  <Link
                    href="/signup"
                    className="ml-1.5 font-semibold text-[#e2a6ff] transition-colors hover:text-white"
                  >
                    Create account
                  </Link>
                </p>

                <span className="h-px flex-1 bg-white/[0.09]" />
              </div>

              <div className="my-5 h-px bg-white/[0.07]" />

              <p className="text-center text-[11px] text-[#777d99]">
                Your style journey starts here.
              </p>
            </div>
          </section>
        </div>
      </motion.section>

      <style jsx>{`
        .login-background {
          background-color: #060613;
          background-image:
            linear-gradient(
              180deg,
              rgba(5, 5, 18, 0.08),
              rgba(5, 5, 18, 0.12)
            ),
            url("/upload/background1.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .brand-logo {
          text-shadow: 0 0 22px rgba(182, 112, 255, 0.12);
        }

        .brand-iq {
          background: linear-gradient(
            115deg,
            #e7a5ff 10%,
            #ad79ff 70%,
            #f1b7ff
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .login-frame {
          padding: 1px;
          border-radius: 25px;
          background: linear-gradient(
            125deg,
            rgba(238, 170, 255, 0.7),
            rgba(132, 110, 255, 0.4) 30%,
            rgba(255, 255, 255, 0.13) 55%,
            rgba(180, 109, 255, 0.55) 82%,
            rgba(231, 166, 255, 0.7)
          );
          box-shadow:
            0 0 13px rgba(185, 101, 255, 0.12),
            0 0 35px rgba(127, 71, 255, 0.09),
            0 25px 75px rgba(0, 0, 0, 0.4);
          isolation: isolate;
        }

        .login-card {
          border-radius: 24px;
          background: rgba(8, 9, 24, 0.97);
        }

        .fashion-panel {
          background-color: #111023;
        }

        .login-form-panel {
          background:
            radial-gradient(
              ellipse at 100% 0%,
              rgba(136, 74, 204, 0.09),
              transparent 48%
            ),
            linear-gradient(145deg, #0b0c1c, #090a18 75%);
        }

        .slide-indicator {
          width: 20px;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.4);
          transition:
            width 250ms ease,
            background 250ms ease;
        }

        .slide-indicator:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .slide-indicator-active {
          width: 38px;
          background: #e1b0ff;
          box-shadow: 0 0 12px rgba(210, 155, 255, 0.4);
        }

        .field-group {
          min-width: 0;
        }

        .input-shell {
          position: relative;
          display: flex;
          height: 43px;
          align-items: center;
          border: 1px solid rgba(163, 151, 220, 0.2);
          border-radius: 999px;
          background: rgba(20, 22, 43, 0.8);
          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .input-shell:focus-within {
          border-color: rgba(205, 145, 255, 0.78);
          background: rgba(24, 22, 46, 0.98);
          box-shadow:
            0 0 0 2px rgba(173, 112, 255, 0.12),
            0 0 15px rgba(170, 95, 255, 0.09);
        }

        .input-icon {
          position: absolute;
          left: 17px;
          z-index: 1;
          width: 17px;
          height: 17px;
          color: #8490b7;
          pointer-events: none;
        }

        .auth-input {
          height: 100%;
          width: 100%;
          min-width: 0;
          border: 0;
          border-radius: 999px;
          background: transparent;
          padding: 0 10px 0 10px;
          color: #f7f5ff;
          font-size: 12px;
          outline: none;
          box-shadow: none;
        }

        .auth-input::placeholder {
          color: #6d7697;
          opacity: 1;
        }

        .auth-input:focus {
          outline: none;
          box-shadow: none;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8e98bb;
          transition: color 180ms ease;
        }

        .password-toggle:hover {
          color: #e5bdff;
        }

        .field-error {
          min-height: 14px;
          overflow: hidden;
          padding-top: 2px;
          padding-left: 12px;
          color: #ff9caf;
          font-size: 10px;
          line-height: 12px;
        }

        .feedback-slot {
          display: flex;
          height: 32px;
          min-height: 32px;
          align-items: center;
          overflow: hidden;
        }

        .feedback-message {
          display: flex;
          width: 100%;
          max-height: 32px;
          align-items: center;
          gap: 7px;
          overflow: hidden;
          border-radius: 9px;
          padding: 6px 10px;
          font-size: 10px;
          line-height: 14px;
        }

        .error-message {
          border: 1px solid rgba(255, 130, 161, 0.18);
          background: rgba(255, 111, 148, 0.07);
          color: #ffb4c5;
        }

        .success-message {
          border: 1px solid rgba(111, 230, 180, 0.2);
          background: rgba(111, 230, 180, 0.06);
          color: #b5f3d5;
        }

        .login-submit {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: linear-gradient(
            105deg,
            #d64ce9 0%,
            #9745f5 44%,
            #563cff 100%
          );
          box-shadow:
            0 5px 18px rgba(119, 55, 255, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition:
            box-shadow 220ms ease,
            filter 220ms ease;
        }

        .login-submit:hover:not(:disabled) {
          filter: brightness(1.1);
          box-shadow:
            0 5px 24px rgba(190, 79, 255, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.52);
        }

        .button-gloss {
          width: 48%;
          transform: translateX(-130%) skewX(-18deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transition: transform 550ms ease;
        }

        .login-submit:hover:not(:disabled) .button-gloss,
        .login-submit.button-click-shine .button-gloss {
          transform: translateX(280%) skewX(-18deg);
        }

        @media (max-width: 767px) {
          .login-frame {
            max-width: 440px;
          }

          .login-card {
            height: auto;
            min-height: 570px;
          }

          .login-form-panel {
            min-height: 570px;
            padding: 32px 25px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .input-shell,
          .password-toggle,
          .button-gloss,
          .slide-indicator {
            transition: none !important;
          }
        }

        :global(.auth-input:-webkit-autofill),
        :global(.auth-input:-webkit-autofill:hover),
        :global(.auth-input:-webkit-autofill:focus),
        :global(.auth-input:-webkit-autofill:active) {
          -webkit-text-fill-color: #f7f5ff !important;
          transition: background-color 9999s ease-in-out 0s !important;
          caret-color: #f7f5ff !important;
        }

        :global(.auth-input::placeholder) {
          color: #6d7697 !important;
          opacity: 1;
        }
      `}</style>
    </main>
  );
}