import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logOutOpen: false,
};

export const portalSlice = createSlice({
  name: "portal",
  initialState,
  reducers: {
    showLogOut(state) {
      state.logOutOpen = true;
    },
    closeLogOut(state) {
      state.logOutOpen = false;
    },
  },
});

export const { showLogOut, closeLogOut } = portalSlice.actions;

export default portalSlice.reducer;
