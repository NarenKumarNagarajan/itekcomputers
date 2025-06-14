/* ================ API Base URL ================ */
const BASE_URL = "http://localhost:7000";

/* ================ Cookie Constants ================ */
export const COOKIE_TIME = 1.5 / 24; // 1.5 hours in days

/* ================ Status Colors ================ */
export const JOB_STATUS_COLORS = {
  "Service Pending": "bg-orange-300",
  "Approval Pending": "bg-yellow-300",
  "Chiplevel Pending": "bg-purple-300",
  "Delivery Pending": "bg-indigo-300",
  "Cash Pending": "bg-pink-300",
  "Return Pending": "bg-red-300",
  "Warranty Service": "bg-blue-300",
  Returned: "bg-red-300",
  Completed: "bg-green-300",
  "In Progress": "bg-blue-300",
  Default: "bg-gray-300",
};

/* ================ Authentication URLs ================ */
export const LOGIN_URL = `${BASE_URL}/login`;
export const LOGOUT_URL = `${BASE_URL}/logout`;
export const CHANGE_PWD_URL = `${BASE_URL}/changePassword`;
export const CHANGE_TPWD_URL = `${BASE_URL}/changeTPassword`;
export const CREATE_USER_URL = `${BASE_URL}/createUser`;
export const USER_LIST_URL = `${BASE_URL}/userList`;
export const RESET_PASSWORD_URL = `${BASE_URL}/resetPassword`;
export const DELETE_USER_URL = `${BASE_URL}/deleteUser`;

/* ================ Job Related URLs ================ */
export const ALL_DATA_URL = `${BASE_URL}/allData`;
export const DATA_BY_JOB_ID_URL = `${BASE_URL}/printData`;
export const FETCH_JOB_ID_URL = `${BASE_URL}/jobID`;
export const FETCH_ALL_JOBS_URL = `${BASE_URL}/allJobs`;
export const INSERT_URL = `${BASE_URL}/insert`;
export const EDIT_JOB_URL = `${BASE_URL}/editJob`;
export const DELETE_JOB_URL = `${BASE_URL}/deleteJob`;
export const INSIGHT_URL = `${BASE_URL}/insight`;

/* ================ Picker Related URLs ================ */
export const PICKERS_URL = `${BASE_URL}/jobSheetPickers`;
export const PICKERS_LIST_URL = `${BASE_URL}/pickersList`;
export const INSERT_PICKERS_URL = `${BASE_URL}/insertPicker`;
export const DELETE_PICKERS_URL = `${BASE_URL}/deletePicker`;
export const UPDATE_PICKERS_URL = `${BASE_URL}/editPicker`;

/* ================ Form Constants ================ */
export const DATE_FILTERS = [
  "This Financial Year",
  "Last Financial Year",
  "This Year",
  "Last Year",
  "This Month",
  "Last Month",
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
];

export const DEFAULT_STATUS = "All";
export const DEFAULT_DATE_FILTER = "This Financial Year";

/* ================ Menu Items ================ */
export const ADMIN_MENU_ITEMS = [
  { title: "ALL JOBS", link: "/allJobs" },
  { title: "JOB SHEET", link: "/jobSheet" },
  { title: "CHANGE PASSWORD", link: "/changePassword" },
  { title: "MODIFY OPTIONS", link: "/modifyOptions" },
  { title: "CUSTOMER DETAIL", link: "/customerDetail" },
  { title: "CREATE USER", link: "/createUser" },
  { title: "USER LIST", link: "/userList" },
  { title: "INSIGHTS OVERVIEW", link: "/insightsOverview" },
];

export const USER_MENU_ITEMS = [
  { title: "ALL JOBS", link: "/allJobs" },
  { title: "JOB SHEET", link: "/jobSheet" },
  { title: "CHANGE PASSWORD", link: "/changePassword" },
  { title: "INSIGHTS OVERVIEW", link: "/insightsOverview" },
];

/* ================ UI Constants ================ */
export const BUTTON_BASE_STYLE =
  "flex items-center justify-center gap-2 self-center rounded-full border-2 border-white px-3 py-2 text-sm font-bold text-white transition-colors";

export const BUTTON_COLORS = {
  PRIMARY: {
    base: "bg-[#1a365d]",
    hover: "hover:border-[#1a365d] hover:bg-white hover:text-[#1a365d]",
  },
  SUCCESS: {
    base: "bg-[#16a34a]",
    hover: "hover:border-[#16a34a] hover:bg-white hover:text-[#16a34a]",
  },
  DANGER: {
    base: "bg-[#dc2626]",
    hover: "hover:border-[#dc2626] hover:bg-white hover:text-[#dc2626]",
  },
};

export const BUTTON_SIZES = {
  SMALL: "w-[100px]",
  MEDIUM: "w-[150px]",
  LARGE: "w-[200px]",
};

/* ================ Table Headers ================ */
export const TABLE_HEADERS = {
  ALL_DATA_TABLE: [
    "ID",
    "JOB ID",
    "NAME",
    "MOBILE",
    "IN",
    "OUT",
    "ASSETS",
    "JOB STATUS",
    "SOLUTION",
    "AMOUNT",
    "ACTION",
  ],
};
