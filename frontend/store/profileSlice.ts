
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, ApiError } from "@/lib/api";
import type { RootState } from "./store";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export type ProfileUpdatePayload = Partial<
  Pick<Profile, "first_name" | "last_name" | "avatar_url">
>;

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ProfileState {
  profile: Profile | null;
  fetchStatus: RequestStatus;
  updateStatus: RequestStatus;
  fetchError: string | null;
  updateError: string | null;
  message: string | null;
}

const initialState: ProfileState = {
  profile: null,
  fetchStatus: "idle",
  updateStatus: "idle",
  fetchError: null,
  updateError: null,
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

function getAccessToken(state: RootState): string {
  const token = state.auth.accessToken;

  if (!token) {
    throw new Error("Please log in to access your profile.");
  }

  return token;
}

export const fetchProfile = createAsyncThunk<
  Profile,
  void,
  { state: RootState; rejectValue: string }
>("profile/fetchProfile", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getAccessToken(getState());

    return await apiRequest<Profile>("/profile/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk<
  Profile,
  ProfileUpdatePayload,
  { state: RootState; rejectValue: string }
>(
  "profile/updateProfile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getAccessToken(getState());

      return await apiRequest<Profile>("/profile/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileErrors(state) {
      state.fetchError = null;
      state.updateError = null;
    },
    clearProfileMessage(state) {
      state.message = null;
    },
    resetProfile(state) {
      state.profile = null;
      state.fetchStatus = "idle";
      state.updateStatus = "idle";
      state.fetchError = null;
      state.updateError = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          action.payload ?? action.error.message ?? "Could not load profile.";
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
        state.message = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.profile = action.payload;
        state.message = "Profile updated successfully.";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          action.payload ?? action.error.message ?? "Could not update profile.";
      });
  },
});

export const {
  clearProfileErrors,
  clearProfileMessage,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
