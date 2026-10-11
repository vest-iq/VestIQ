
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, ApiError } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string;
}

interface SignupRequest {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  user: AuthUser;
}

interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: RequestStatus;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
  message: null,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export const signupUser = createAsyncThunk<
  SignupResponse,
  SignupRequest,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest<SignupResponse>("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthMessage(state) {
      state.message = null;
    },
    logoutLocal(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Signup failed.";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Login failed.";
      });
  },
});

export const { clearAuthError, clearAuthMessage, logoutLocal } =
  authSlice.actions;

export default authSlice.reducer;
