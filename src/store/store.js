import { configureStore } from "@reduxjs/toolkit";
import postListReducer from "./postListSlice";
import profileReducer from "./profileSlice";
import userInfoReducer from "./userInfoSlice";
import loaderReducer from "./loaderSlice";

export const store = configureStore({
  reducer: {
    postList: postListReducer,
    profile: profileReducer,
    userInfo: userInfoReducer,
    loader: loaderReducer,
  },
});
