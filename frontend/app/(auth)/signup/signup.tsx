// "use client";

// import { useState, type FormEvent } from "react";
// import Link from "next/link";
// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   LockKeyhole,
//   Mail,
//   Sparkles,
//   UserRound,
//   CheckCircle2,
// } from "lucide-react";
// import { motion } from "motion/react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import {
//   clearAuthError,
//   clearAuthMessage,
//   signupUser,
// } from "@/store/authSlice";

// type FormValues = {
//   name: string;
//   email: string;
//   password: string;
// };

// type FormErrors = Partial<Record<keyof FormValues, string>>;

// const initialValues: FormValues = {
//   name: "",
//   email: "",
//   password: "",
// };

// export default function Signup() {
//   const [values, setValues] = useState<FormValues>(initialValues);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);

//   const dispatch = useAppDispatch();

//   const {
//     status,
//     error: authError,
//     message: authMessage,
//   } = useAppSelector((state) => state.auth);

//   const isLoading = status === "loading";

//   function validate(): FormErrors {
//     const nextErrors: FormErrors = {};

//     if (values.name.trim().length < 2) {
//       nextErrors.name = "Please enter your full name.";
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
//       nextErrors.email = "Please enter a valid email address.";
//     }

//     if (values.password.length < 8) {
//       nextErrors.password = "Use at least 8 characters.";
//     }

//     return nextErrors;
//   }

//   function updateField(field: keyof FormValues, value: string) {
//     setValues((current) => ({ ...current, [field]: value }));
//     setErrors((current) => ({ ...current, [field]: undefined }));
//     dispatch(clearAuthError());
//     dispatch(clearAuthMessage());
//   }

//   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const nextErrors = validate();
//     setErrors(nextErrors);
//     dispatch(clearAuthError());
//     dispatch(clearAuthMessage());

//     if (Object.keys(nextErrors).length > 0) {
//       return;
//     }

//     const nameParts = values.name.trim().split(/\s+/);
//     const first_name = nameParts[0];
//     const last_name = nameParts.slice(1).join(" ") || undefined;

//     try {
//       await dispatch(
//         signupUser({
//           first_name,
//           last_name,
//           email: values.email.trim(),
//           password: values.password,
//         }),
//       ).unwrap();
//     } catch {
//       // Redux stores the readable error in auth.error.
//     }
//   }

//   return (
//     <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080914] px-4 py-8 text-white sm:px-6 lg:py-12">
//       {/* Ambient background */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 overflow-hidden"
//       >
//         <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[130px]" />
//         <div className="absolute -bottom-48 -right-32 h-[480px] w-[480px] rounded-full bg-blue-600/20 blur-[140px]" />
//         <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.07] blur-[120px]" />
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 22 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.65, ease: "easeOut" }}
//         className="relative z-10 w-full max-w-5xl"
//       >
//         {/* Brand */}
//         <Link
//           href="/signup"
//           className="mb-7 inline-flex items-center gap-3 sm:mb-9"
//           aria-label="VestIQ home"
//         >
//           <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] shadow-lg shadow-violet-950/30">
//             <Sparkles className="h-5 w-5 text-violet-300" />
//           </span>
//           <span className="text-xl font-semibold tracking-tight">
//             Vest<span className="text-violet-300">IQ</span>
//           </span>
//         </Link>

//         <section className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#11121f]/85 shadow-2xl shadow-black/40 backdrop-blur-2xl md:grid-cols-2">
//           {/* Fashion image panel */}
//           <div className="relative hidden min-h-[620px] overflow-hidden md:block">
//             <div
//               className="absolute inset-0 bg-cover bg-center"
//               style={{
//                 backgroundImage:
//                   "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85')",
//               }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-[#080914]/35 to-black/10" />
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#11121f]/35" />

//             <div className="absolute left-8 right-8 top-8">
//               <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
//                 <Sparkles className="h-3.5 w-3.5 text-violet-300" />
//                 Your personal style assistant
//               </span>
//             </div>

//             <div className="absolute bottom-9 left-8 right-8">
//               <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
//                 Style starts here
//               </p>
//               <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight lg:text-4xl">
//                 Wear what feels like{" "}
//                 <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
//                   you.
//                 </span>
//               </h2>
//               <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
//                 Discover outfits, explore your personal style, and make more
//                 confident fashion choices.
//               </p>

//               <div className="mt-7 flex items-center gap-2">
//                 <span className="h-1.5 w-8 rounded-full bg-violet-300" />
//                 <span className="h-1.5 w-3 rounded-full bg-white/35" />
//                 <span className="h-1.5 w-3 rounded-full bg-white/35" />
//               </div>
//             </div>
//           </div>

//           {/* Signup form */}
//           <div className="flex items-center px-5 py-9 sm:px-9 sm:py-11 lg:px-11">
//             <div className="mx-auto w-full max-w-md">
//               <div className="mb-8">
//                 <p className="mb-3 text-sm font-medium text-violet-300">
//                   YOUR NEXT CHAPTER
//                 </p>
//                 <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
//                   Create your account
//                 </h1>
//                 <p className="mt-3 text-sm leading-6 text-white/55">
//                   Build your profile and start discovering your style.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} noValidate className="space-y-5">
//                 {/* Name */}
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-sm text-white/80">
//                     Full name
//                   </Label>
//                   <div className="relative">
//                     <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
//                     <Input
//                       id="name"
//                       name="name"
//                       type="text"
//                       autoComplete="name"
//                       placeholder="Your name"
//                       value={values.name}
//                       onChange={(event) =>
//                         updateField("name", event.target.value)
//                       }
//                       aria-invalid={Boolean(errors.name)}
//                       aria-describedby={errors.name ? "name-error" : undefined}
//                       className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-white/30 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
//                     />
//                   </div>
//                   {errors.name && (
//                     <p id="name-error" className="text-xs text-rose-300">
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm text-white/80">
//                     Email address
//                   </Label>
//                   <div className="relative">
//                     <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       placeholder="you@example.com"
//                       value={values.email}
//                       onChange={(event) =>
//                         updateField("email", event.target.value)
//                       }
//                       aria-invalid={Boolean(errors.email)}
//                       aria-describedby={
//                         errors.email ? "email-error" : undefined
//                       }
//                       className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-white placeholder:text-white/30 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
//                     />
//                   </div>
//                   {errors.email && (
//                     <p id="email-error" className="text-xs text-rose-300">
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div className="space-y-2">
//                   <Label htmlFor="password" className="text-sm text-white/80">
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       autoComplete="new-password"
//                       placeholder="At least 8 characters"
//                       value={values.password}
//                       onChange={(event) =>
//                         updateField("password", event.target.value)
//                       }
//                       aria-invalid={Boolean(errors.password)}
//                       aria-describedby={
//                         errors.password ? "password-error" : undefined
//                       }
//                       className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 pr-12 text-white placeholder:text-white/30 focus-visible:border-violet-400 focus-visible:ring-violet-400/20"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((current) => !current)}
//                       aria-label={
//                         showPassword ? "Hide password" : "Show password"
//                       }
//                       className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/45 transition-colors hover:text-white"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-[18px] w-[18px]" />
//                       ) : (
//                         <Eye className="h-[18px] w-[18px]" />
//                       )}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p id="password-error" className="text-xs text-rose-300">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="group h-12 w-full rounded-xl border-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {isLoading ? "Creating account..." : "Create account"}
//                   {!isLoading && (
//                     <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                   )}
//                 </Button>

//                 {authError && (
//                   <p
//                     role="alert"
//                     className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm text-rose-200"
//                   >
//                     {authError}
//                   </p>
//                 )}

//                 {authMessage && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="flex items-start gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3 text-sm text-emerald-100"
//                     role="status"
//                   >
//                     <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
//                     <span>{authMessage} You can now try signing in.</span>
//                   </motion.div>
//                 )}
//               </form>

//               <div className="my-7 h-px bg-white/[0.08]" />

//               <p className="text-center text-sm text-white/55">
//                 Already have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="font-semibold text-violet-300 transition-colors hover:text-violet-200"
//                 >
//                   Sign in
//                 </Link>
//               </p>

//               <p className="mt-7 text-center text-xs leading-5 text-white/35">
//                 By continuing, you agree to our Terms of Service and Privacy
//                 Policy.
//               </p>
//             </div>
//           </div>
//         </section>

//         <p className="mt-6 text-center text-xs text-white/30">
//           Made for your style. Powered by VestIQ.
//         </p>
//       </motion.div>
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
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=85",
    eyebrow: "STYLE STARTS HERE",
    first: "Wear what feels like",
    highlight: "you.",
    description:
      "Discover outfits, explore your personal style, and make more confident fashion choices.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85",
    eyebrow: "YOUR STYLE, YOUR RULES",
    first: "Make every outfit",
    highlight: countWord("iconic"),
    description:
      "Find inspiration, experiment with new looks, and express your individuality.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85",
    eyebrow: "DISCOVER YOUR LOOK",
    first: "Confidence looks",
    highlight: "good on you.",
    description:
      "Explore fashion that reflects your personality and makes getting dressed effortless.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=85",
    eyebrow: "FASHION WITHOUT LIMITS",
    first: "Your next favorite",
    highlight: "look awaits.",
    description:
      "Discover fresh combinations and create a wardrobe that feels uniquely yours.",
  },
];

// Keeps the slide text simple and consistent.
function countWord(word: string) {
  return word;
}

export default function Signup() {
  const router = useRouter(); // Initialized the router

  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [buttonPressed, setButtonPressed] = useState(false);

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

  // Rotate the four fashion images automatically.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);



  // Brief shine when the submit button is clicked.
  useEffect(() => {
    if (!buttonPressed) return;

    const timer = window.setTimeout(() => {
      setButtonPressed(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [buttonPressed]);

  if (user && accessToken) {
    return null; 
  }

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

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    dispatch(clearAuthError());
    dispatch(clearAuthMessage());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setButtonPressed(true);

    const nextErrors = validate();
    setErrors(nextErrors);

    dispatch(clearAuthError());
    dispatch(clearAuthMessage());

    if (Object.keys(nextErrors).length > 0) return;

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

      // Redirect to dashboard on successful signup
      router.push("/dashboard");
    } catch {
      // The Redux slice supplies the readable error.
    }
  }

  return (
    <main className="signup-background relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-12 text-white sm:px-8 lg:px-12">
      {/* Ambient glow; the decorative flowers remain in the background image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[130px]" />
      </div>

      {/* Brand stays outside the signup container. */}
      <Link
        href="/signup"
        aria-label="VestIQ home"
        className="brand-logo absolute left-5 top-5 z-20 text-3xl font-semibold tracking-tight sm:left-8 sm:top-7 sm:text-[34px]"
      >
        Vest<span className="brand-iq">IQ</span>
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="signup-frame relative z-10 w-full max-w-[1000px]"
      >
        <div className="signup-card grid h-[590px] w-full overflow-hidden md:grid-cols-[1fr_1fr]">
          {/* LEFT: Four-image fashion slideshow */}
          <section className="fashion-panel relative hidden min-h-0 overflow-hidden md:block">
            <AnimatePresence mode="sync">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.025 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("${slides[activeSlide].image}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#070713] via-[#070713]/40 to-[#080817]/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a19]/35" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-7 lg:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="mb-3 text-[11px] font-semibold tracking-[0.24em] text-[#d5a7ff]">
                    {slides[activeSlide].eyebrow}
                  </p>

                  <h2 className="max-w-[360px] text-[30px] font-semibold leading-[1.15] tracking-tight lg:text-[36px]">
                    {slides[activeSlide].first}{" "}
                    <span className="bg-gradient-to-r from-[#f2b3ff] to-[#a998ff] bg-clip-text text-transparent">
                      {slides[activeSlide].highlight}
                    </span>
                  </h2>

                  <p className="mt-4 max-w-[340px] text-[13px] leading-6 text-white/75">
                    {slides[activeSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Four manually selectable slides */}
              <div className="mt-6 flex h-3 items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.eyebrow}
                    type="button"
                    aria-label={`Show fashion slide ${index + 1}`}
                    aria-pressed={activeSlide === index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-[5px] rounded-full transition-all duration-300 ${
                      activeSlide === index
                        ? "w-9 bg-[#d7a1ff] shadow-[0_0_12px_rgba(205,126,255,0.6)]"
                        : "w-3 bg-white/35 hover:bg-white/65"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: Signup form */}
          <section className="signup-form-panel flex min-h-0 flex-col justify-center px-6 py-7 sm:px-9 lg:px-10">
            <div className="mx-auto flex w-full max-w-[390px] flex-col">
              <header className="mb-5">
                <p className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-[#d2a2ff]">
                  YOUR NEXT CHAPTER
                </p>

                <h1 className="text-[29px] font-semibold leading-tight tracking-tight sm:text-[32px]">
                  Create your account
                </h1>

                <p className="mt-2 text-[13px] leading-5 text-[#a8adc5]">
                  Build your profile and start discovering your style.
                </p>
              </header>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-3"
              >
                {/* Full name */}
                <div className="field-group">
                  <Label
                    htmlFor="name"
                    className="mb-1.5 block text-[12px] font-medium text-[#d9dbea]"
                  >
                    Full name
                  </Label>

                  <div className="input-shell">
                    <UserRound aria-hidden="true" className="input-icon ml-3" />
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
                      aria-describedby="name-error"
                      className="auth-input"
                    />
                  </div>

                  <p id="name-error" className="field-error">
                    {errors.name || "\u00a0"}
                  </p>
                </div>

                {/* Email */}
                <div className="field-group">
                  <Label
                    htmlFor="email"
                    className="mb-1.5 block text-[12px] font-medium text-[#d9dbea]"
                  >
                    Email address
                  </Label>

                  <div className="input-shell">
                    <Mail aria-hidden="true" className="input-icon ml-3" />
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
                      aria-describedby="email-error"
                      className="auth-input"
                    />
                  </div>

                  <p id="email-error" className="field-error">
                    {errors.email || "\u00a0"}
                  </p>
                </div>

                {/* Password */}
                <div className="field-group">
                  <Label
                    htmlFor="password"
                    className="mb-1.5 block text-[12px] font-medium text-[#d9dbea]"
                  >
                    Password
                  </Label>

                  <div className="input-shell">
                    <LockKeyhole
                      aria-hidden="true"
                      className="input-icon ml-3"
                    />

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
                      aria-describedby="password-error"
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

                  <p id="password-error" className="field-error">
                    {errors.password || "\u00a0"}
                  </p>
                </div>

                {/* Fixed-height feedback prevents layout shifts */}
                <div className="feedback-slot" aria-live="polite">
                  {authError ? (
                    <p role="alert" className="feedback-message error-message">
                      {authError}
                    </p>
                  ) : authMessage ? (
                    <p
                      role="status"
                      className="feedback-message success-message"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-2">{authMessage}</span>
                    </p>
                  ) : null}
                </div>

                {/* Shiny gradient button */}
                <motion.div
                  whileTap={{ scale: 0.985 }}
                  className="relative mt-0"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    onClick={() => setButtonPressed(true)}
                    className={`signup-submit group relative h-[48px] w-full overflow-hidden rounded-full border-0 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${
                      buttonPressed ? "button-click-shine" : ""
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? "Creating account..." : "Create account"}
                      {!isLoading && (
                        <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="button-gloss pointer-events-none absolute inset-0"
                    />
                  </Button>
                </motion.div>
              </form>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.09]" />
                <p className="whitespace-nowrap text-[12px] text-[#8f96b2]">
                  Already have an account?
                  <Link
                    href="/login"
                    className="ml-1.5 font-semibold text-[#e2a6ff] transition-colors hover:text-white"
                  >
                    Sign in
                  </Link>
                </p>
                <span className="h-px flex-1 bg-white/[0.09]" />
              </div>

              <p className="mt-4 text-center text-[10px] leading-4 text-[#777d99]">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </section>
        </div>
      </motion.section>

      <style jsx>{`
        .signup-background {
          background-color: #060613;
          background-image:
            linear-gradient(180deg, rgba(5, 5, 18, 0.08), rgba(5, 5, 18, 0.12)),
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

        .signup-frame {
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

        .signup-card {
          border-radius: 24px;
          background: rgba(8, 9, 24, 0.97);
        }

        .fashion-panel {
          background-color: #111023;
        }

        .signup-form-panel {
          background:
            radial-gradient(
              ellipse at 100% 0%,
              rgba(136, 74, 204, 0.09),
              transparent 48%
            ),
            linear-gradient(145deg, #0b0c1c, #090a18 75%);
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

        :global(.auth-input) {
          height: 100%;
          width: 100%;
          border: 0 !important;
          border-radius: 999px !important;
          background: transparent !important;
          padding: 0 10px 0 10px !important;
          color: #f7f5ff !important;
          font-size: 12px !important;
          box-shadow: none !important;
          outline: none !important;
        }

        :global(.auth-input::placeholder) {
          color: #6d7697 !important;
          opacity: 1;
        }

        :global(.auth-input:focus-visible) {
          outline: none !important;
          box-shadow: none !important;
          ring: none !important;
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
          padding-left: 12px;
          padding-top: 2px;
          overflow: hidden;
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

        :global(.signup-submit) {
          background: linear-gradient(
            105deg,
            #d64ce9 0%,
            #9745f5 44%,
            #563cff 100%
          ) !important;
          box-shadow:
            0 5px 18px rgba(119, 55, 255, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transition:
            box-shadow 220ms ease,
            filter 220ms ease;
        }

        :global(.signup-submit:hover:not(:disabled)) {
          filter: brightness(1.1);
          box-shadow:
            0 5px 24px rgba(190, 79, 255, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.52);
        }

        .button-gloss {
          transform: translateX(-130%) skewX(-18deg);
          width: 48%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transition: transform 550ms ease;
        }

        :global(.signup-submit:hover:not(:disabled)) .button-gloss,
        :global(.signup-submit.button-click-shine) .button-gloss {
          transform: translateX(280%) skewX(-18deg);
        }

        @media (max-width: 767px) {
          .signup-frame {
            max-width: 440px;
          }

          .signup-card {
            height: auto;
            min-height: 570px;
          }

          .signup-form-panel {
            min-height: 570px;
            padding: 32px 25px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .input-shell,
          .password-toggle,
          .button-gloss {
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
