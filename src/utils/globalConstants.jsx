/* ================ API Base URL ================ */
const BASE_URL = "http://65.0.242.84:7000";

/* ================ Cookie Constants ================ */
export const COOKIE_TIME = 3 / 24; // 3 hours in days

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
export const INSIGHTS_URL = `${BASE_URL}/insight`;

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
  { title: "BUSINESS INSIGHTS", link: "/insights" },
];

export const USER_MENU_ITEMS = [
  { title: "ALL JOBS", link: "/allJobs" },
  { title: "JOB SHEET", link: "/jobSheet" },
  { title: "CHANGE PASSWORD", link: "/changePassword" },
];

/* ================ UI Constants ================ */
export const BUTTON_BASE_STYLE =
  "flex items-center justify-center gap-2 self-center rounded-full border-2 border-white px-3 py-2 text-white transition-colors";

export const BUTTON_COLORS = {
  PRIMARY: {
    base: "bg-[#1a365d]",
    hover: "hover:border-[#1a365d] hover:bg-white hover:text-[#1a365d]",
  },
  SUCCESS: {
    base: "bg-orange-500",
    hover: "hover:border-orange-500 hover:bg-white hover:text-orange-500",
  },
  DANGER: {
    base: "bg-[#dc2626]",
    hover: "hover:border-[#dc2626] hover:bg-white hover:text-[#dc2626]",
  },
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

// Password Validation Constants
export const PASSWORD_VALIDATIONS = {
  MIN_LENGTH: 6,
  HAS_UPPERCASE: /[A-Z]/,
  HAS_LOWERCASE: /[a-z]/,
  HAS_NUMBERS: /\d/,
  HAS_SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
};

export const PASSWORD_REQUIREMENTS = [
  "Minimum 6 characters long",
  "At least one uppercase letter (A-Z)",
  "At least one lowercase letter (a-z)",
  "At least one number (0-9)",
  'At least one special character (!@#$%^&*(),.?":{}|<>)',
];
