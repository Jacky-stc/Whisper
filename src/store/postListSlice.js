import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  postList: [],
  likes: [],
  liked: false,
  comments: [],
};

export const postListSlice = createSlice({
  name: "postList",
  initialState,
  reducers: {
    getPostList(state, action) {
      state.postList = action.payload;
    },
    addPostList(state, action) {
      state.postList.unshift(action.payload);
    },
    deletePostList(state, action) {
      state.postList = state.postList.filter(
        (post) => post.id != action.payload
      );
    },
    getLikes(state, action) {
      state.likes = action.payload;
    },
    getComments(state, action) {
      state.comments = action.payload;
      console.log(action.payload);
    },
  },
});

export const {
  getPostList,
  addPostList,
  deletePostList,
  getLikes,
  getComments,
} = postListSlice.actions;

export default postListSlice.reducer;
