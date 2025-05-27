import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import sidebarSlice from "./sidebarSlice";

const appStore = configureStore({
  reducer: {
    loginSlice: loginSlice,
    sidebarSlice: sidebarSlice,
  },
});

export default appStore;
