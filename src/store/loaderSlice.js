import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loader: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    changeLoaderState(state) {
      state.loader = !state.loader;
    },
  },
});

export const { changeLoaderState } = loaderSlice.actions;

export default loaderSlice.reducer;
