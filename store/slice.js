import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    user: { name: "Rohit" },
  },
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLogin } = counterSlice.actions;

export default counterSlice.reducer;
