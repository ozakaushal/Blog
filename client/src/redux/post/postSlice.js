import { createSlice, combineReducers } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    imageUploadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    imageUploadEnd: (state) => {
      state.loading = false;
      state.error = null;
    },
    newPostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    newPostSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    newPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  imageUploadStart,
  imageUploadEnd,
  newPostStart,
  newPostSuccess,
  newPostFailure,
} = postSlice.actions;
export default postSlice.reducer;
