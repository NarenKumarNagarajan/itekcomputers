import { createSlice } from "@reduxjs/toolkit";

const isSmallScreen = () => {
  return window.matchMedia("(max-width: 1024px)").matches;
};

const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState: {
    isSidebarOpen: !isSmallScreen(),
    activeMenu: "alljobs",
  },
  reducers: {
    toggleSidebar: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.isSidebarOpen = action.payload;
      } else {
        state.isSidebarOpen = !state.isSidebarOpen;
      }
    },
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveMenu } = sidebarSlice.actions;

export default sidebarSlice.reducer;
