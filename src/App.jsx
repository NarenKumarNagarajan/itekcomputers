import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { Suspense, lazy } from "react";
import { Provider, useSelector } from "react-redux";
import appStore from "./redux/appStore";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { TbLoader3 } from "react-icons/tb";
import Login from "./components/Login";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ErrorPage from "./components/ErrorPage";
import JobSheet from "./components/JobSheet";
import AllJobs from "./components/AllJobs";
import EditPage from "./components/EditPage";
import PrintPage from "./components/PrintPage";
import ChangePassword from "./components/ChangePassword";
import CreateUser from "./components/CreateUser";
import UserList from "./components/UserList";
import Insights from "./components/Insights";
import ModifyOptions from "./components/ModifyOptions";
import CustomerDetails from "./components/CustomerDetails";
import useVerifyLogin from "./hooks/useVerifyLogin";
import { LOGIN_URL } from "./utils/globalConstants";

const Layout = ({ children }) => {
  const hasCookie = Cookies.get("userCookie");
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasCookie) {
      navigate("/");
    }
  }, [hasCookie, navigate]);

  if (!hasCookie) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black text-[100px] text-white">
        <TbLoader3 />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

// Lazy load components
const LoginComponent = lazy(() => import("./components/Login"));
const AllJobsComponent = lazy(() => import("./components/AllJobs"));
const JobSheetComponent = lazy(() => import("./components/JobSheet"));
const ChangePasswordComponent = lazy(
  () => import("./components/ChangePassword"),
);
const ModifyOptionsComponent = lazy(() => import("./components/ModifyOptions"));
const CustomerDetailsComponent = lazy(
  () => import("./components/CustomerDetails"),
);
const CreateUserComponent = lazy(() => import("./components/CreateUser"));
const UserListComponent = lazy(() => import("./components/UserList"));
const InsightsComponent = lazy(() => import("./components/Insights"));
const PrintPageComponent = lazy(() => import("./components/PrintPage"));

const App = () => {
  const { isLoggedIn } = useSelector((store) => store.loginSlice);

  return (
    <Provider store={appStore}>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </Provider>
  );
};

const AppContent = () => {
  const { isLoggedIn } = useSelector((store) => store.loginSlice);
  useVerifyLogin("/allJobs");

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#1a365d]">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route
          path="/allJobs"
          element={
            <Layout>
              <AllJobsComponent />
            </Layout>
          }
        />
        <Route
          path="/jobSheet"
          element={
            <Layout>
              <JobSheetComponent />
            </Layout>
          }
        />
        <Route
          path="/changePassword"
          element={
            <Layout>
              <ChangePasswordComponent />
            </Layout>
          }
        />
        <Route
          path="/modifyOptions"
          element={
            <Layout>
              <ModifyOptionsComponent />
            </Layout>
          }
        />
        <Route
          path="/customerDetail"
          element={
            <Layout>
              <CustomerDetailsComponent />
            </Layout>
          }
        />
        <Route
          path="/createUser"
          element={
            <Layout>
              <CreateUserComponent />
            </Layout>
          }
        />
        <Route
          path="/userList"
          element={
            <Layout>
              <UserListComponent />
            </Layout>
          }
        />
        <Route
          path="/insightsOverview"
          element={
            <Layout>
              <InsightsComponent />
            </Layout>
          }
        />
        <Route
          path="/editJob"
          element={
            <Layout>
              <EditPage />
            </Layout>
          }
        />
        <Route
          path="/printPage"
          element={
            <Layout>
              <PrintPageComponent />
            </Layout>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
