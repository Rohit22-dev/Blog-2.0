import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    user: null,
    userBlog: [],
    allBlog: [],
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.userBlog = [];
      state.allBlog = [];
    },
    setUserBlog: (state, action) => {
      state.userBlog = action.payload;
    },
    setAllBlog: (state, action) => {
      state.allBlog = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLogin, setLogout, setUserBlog, setAllBlog } =
  counterSlice.actions;

// Selector to compute whether the user is logged in
export const isLoggedIn = (state) => state.counter.user !== null;

export default counterSlice.reducer;
