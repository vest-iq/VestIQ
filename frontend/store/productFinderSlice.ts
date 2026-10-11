
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  ApiError,
  searchProductsByImage,
  type ProductFinderResponse,
} from "@/lib/api";

type ProductFinderState = {
  data: ProductFinderResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ProductFinderState = {
  data: null,
  status: "idle",
  error: null,
};

export const searchProducts = createAsyncThunk<
  ProductFinderResponse,
  File,
  { rejectValue: string }
>(
  "productFinder/searchProducts",
  async (file, { rejectWithValue }) => {
    try {
      return await searchProductsByImage(file);
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        "Something went wrong while searching for products.",
      );
    }
  },
);

const productFinderSlice = createSlice({
  name: "productFinder",
  initialState,
  reducers: {
    clearProductSearch(state) {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ??
          action.error.message ??
          "Product search failed.";
      });
  },
});

export const { clearProductSearch } = productFinderSlice.actions;

export default productFinderSlice.reducer;
