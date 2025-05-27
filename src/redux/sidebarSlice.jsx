import { createSlice } from "@reduxjs/toolkit";

const isSmallScreen = () => {
  return window.matchMedia("(max-width: 767px)").matches;
};

const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState: {
    isSidebarOpen: !isSmallScreen(),
    activeMenu: null,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setActiveMenu: (state, action) => {
      state.activeMenu =
        state.activeMenu === action.payload ? null : action.payload;
    },
  },
});

export const { toggleSidebar, setActiveMenu } = sidebarSlice.actions;

export default sidebarSlice.reducer;
