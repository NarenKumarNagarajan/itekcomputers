import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";
import PropTypes from "prop-types";

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
    <>
      <Header />
      <div className="relative flex">
        <Sidebar />
        {children}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/allJobs"
          element={
            <Layout>
              <AllJobs />
            </Layout>
          }
        />
        <Route
          path="/jobSheet"
          element={
            <Layout>
              <JobSheet />
            </Layout>
          }
        />
        <Route
          path="/editPage"
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
              <PrintPage />
            </Layout>
          }
        />
        <Route
          path="/changePassword"
          element={
            <Layout>
              <ChangePassword />
            </Layout>
          }
        />
        <Route
          path="/modifyOptions"
          element={
            <Layout>
              <ModifyOptions />
            </Layout>
          }
        />
        <Route
          path="/customerDetails"
          element={
            <Layout>
              <CustomerDetails />
            </Layout>
          }
        />
        <Route
          path="/createUser"
          element={
            <Layout>
              <CreateUser />
            </Layout>
          }
        />
        <Route
          path="/userList"
          element={
            <Layout>
              <UserList />
            </Layout>
          }
        />
        <Route
          path="/insightsOverview"
          element={
            <Layout>
              <Insights />
            </Layout>
          }
        />

        <Route
          path="*"
          element={
            <Layout>
              <ErrorPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
