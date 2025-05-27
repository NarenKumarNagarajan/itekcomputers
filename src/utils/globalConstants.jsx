export const COOKIE_TIME = 1.5 / 24;

/* ================ Global Links are below ================ */

export const LOGIN_URL = "http://localhost:7000/login";

export const LOGOUT_URL = "http://localhost:7000/logout";

export const ALL_DATA_URL = "http://localhost:7000/allData";

export const DATA_BY_JOB_ID_URL = "http://localhost:7000/printData";

export const FETCH_JOB_ID_URL = "http://localhost:7000/jobID";

export const INSERT_URL = "http://localhost:7000/insert";

export const EDIT_JOB_URL = "http://localhost:7000/editJob";

export const CHANGE_PWD_URL = "http://localhost:7000/changePassword";

export const CHANGE_TPWD_URL = "http://localhost:7000/changeTPassword";

export const CREATE_USER_URL = "http://localhost:7000/createUser";

export const USER_LIST_URL = "http://localhost:7000/userList";

export const RESET_PASSWORD_URL = "http://localhost:7000/resetPassword";

export const DELETE_USER_URL = "http://localhost:7000/deleteUser";

export const DELETE_JOB_URL = "http://localhost:7000/deleteJob";

export const INSIGHT_URL = "http://localhost:7000/insight";

export const PICKERS_URL = "http://localhost:7000/jobSheetPickers";

export const PICKERS_LIST_URL = "http://localhost:7000/pickersList";

export const INSERT_PICKERS_URL = "http://localhost:7000/insertPicker";

export const DELETE_PICKERS_URL = "http://localhost:7000/deletePicker";

export const UPDATE_PICKERS_URL = "http://localhost:7000/editPicker";

/* ================= Menu Items =============== */

export const ADMIN_MENU_ITEMS = [
  {
    title: "ALL JOBS",
    link: "/allJobs",
  },
  {
    title: "JOB SHEET",
    link: "/jobSheet",
  },
  {
    title: "CHANGE PASSWORD",
    link: "/changePassword",
  },
  {
    title: "MODIFY OPTIONS",
    link: "/modifyOptions",
  },
  {
    title: "CUSTOMER DETAIL",
    link: "/customerDetail",
  },
  {
    title: "CREATE USER",
    link: "/createUser",
  },
  {
    title: "USER LIST",
    link: "/userList",
  },
  {
    title: "INSIGHTS OVERVIEW",
    link: "/insightsOverview",
  },
];

export const USER_MENU_ITEMS = [
  {
    title: "ALL JOBS",
    link: "/allJobs",
  },
  {
    title: "JOB SHEET",
    link: "/jobSheet",
  },
  {
    title: "CHANGE PASSWORD",
    link: "/changePassword",
  },
  {
    title: "INSIGHTS OVERVIEW",
    link: "/insightsOverview",
  },
];
