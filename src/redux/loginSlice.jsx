import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const hasCookie = Cookies.get("userCookie");
const parsedCookie = hasCookie ? JSON.parse(hasCookie) : {};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: parsedCookie,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: () => {
      return {};
    },
  },
});

export const { addUser, removeUser } = loginSlice.actions;

export default loginSlice.reducer;
