import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  personalPhotoUpload: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    getProfile(state, action) {
      state.profile = action.payload;
    },
    setPersonalPhotoUpload(state, action) {
      state.personalPhotoUpload = action.payload;
    },
    removePersonalPhotoUpload(state) {
      state.personalPhotoUpload = null;
    },
  },
});

export const { getProfile, setPersonalPhotoUpload, removePersonalPhotoUpload } =
  profileSlice.actions;

export default profileSlice.reducer;
