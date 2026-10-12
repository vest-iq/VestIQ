
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store/store";
import { restoreSession, logoutLocal } from "@/store/authSlice";

const SESSION_KEY = "vestiq_auth_session";

interface SavedSession {
  user: {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    role?: string;
  };
  accessToken: string;
  refreshToken: string;
}

function isSavedSession(value: unknown): value is SavedSession {
  if (typeof value !== "object" || value === null) return false;

  const session = value as Partial<SavedSession>;

  return (
    typeof session.accessToken === "string" &&
    session.accessToken.length > 0 &&
    typeof session.refreshToken === "string" &&
    typeof session.user === "object" &&
    session.user !== null &&
    typeof session.user.id === "string" &&
    typeof session.user.email === "string"
  );
}

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const [ready, setReady] = useState(false);

  if (storeRef.current === null) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    try {
      const saved = sessionStorage.getItem(SESSION_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (isSavedSession(parsed)) {
          store.dispatch(restoreSession(parsed));
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }

    // Save authentication changes and remove the session on logout.
    let previousAccessToken = store.getState().auth.accessToken;

    const unsubscribe = store.subscribe(() => {
      const auth = store.getState().auth;

      if (auth.accessToken && auth.user && auth.refreshToken) {
        try {
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
              user: auth.user,
              accessToken: auth.accessToken,
              refreshToken: auth.refreshToken,
            } satisfies SavedSession),
          );
        } catch {
          // Storage may be unavailable or full.
        }
      } else if (previousAccessToken !== auth.accessToken) {
        sessionStorage.removeItem(SESSION_KEY);
      }

      previousAccessToken = auth.accessToken;
    });

    setReady(true);

    return unsubscribe;
  }, []);

  return (
    <Provider store={storeRef.current}>
      {ready ? children : null}
    </Provider>
  );
}
