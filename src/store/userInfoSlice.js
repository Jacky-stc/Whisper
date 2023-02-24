import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    getuserInfo(state, action) {
      state.profile = action.payload;
    },
  },
});

export const { getUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
