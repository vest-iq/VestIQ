
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, accessToken } = useAppSelector(
    (state) => state.auth,
  );

  const isAuthenticated = Boolean(user && accessToken);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030817] px-6 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
            <ShieldCheck className="h-7 w-7 text-blue-400" />
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              Checking your session
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Please wait while we verify your sign-in.
            </p>
          </div>

          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
