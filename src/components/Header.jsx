import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import Cookies from "js-cookie";

import { GiHamburgerMenu } from "react-icons/gi";
import { toggleSidebar } from "../redux/sidebarSlice";
import logo from "../images/logo.png";
import { removeUser } from "../redux/loginSlice";
import { LOGOUT_URL } from "../utils/globalConstants";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { position, userName, jwtToken, userId, name } = useSelector(
    (store) => store.loginSlice,
  );

  const handleLogout = useCallback(async () => {
    try {
      await fetch(LOGOUT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          USERID: userId,
          USERNAME: userName,
          POSITION: position,
        }),
      });

      Cookies.remove("userCookie");
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }, [jwtToken, userId, userName, position, dispatch, navigate]);

  const handleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return (
    <>
      <header className="flex w-full items-center justify-between bg-[#1a365d] px-3 py-2 shadow-lg">
        <div className="flex items-center">
          <GiHamburgerMenu
            className="mr-5 h-6 w-6 cursor-pointer text-[#ffffff]"
            onClick={handleSidebar}
          />
          <Link to="/allJobs">
            <div className="rounded-lg bg-[#ffffff] p-1">
              <img
                src={logo}
                alt="logo"
                className="h-12 w-24 cursor-pointer object-contain md:w-32"
              />
            </div>
          </Link>
        </div>

        <h1 className="hidden text-center font-bold text-[#ffffff] lg:block">
          {name} - {position}
        </h1>

        <h1 className="block text-center font-bold text-[#ffffff] lg:hidden">
          {name}
          <br />
          {position}
        </h1>

        <div className="text-right">
          <button
            className="text-md rounded-full border-2 border-[#ffffff] bg-[#ffffff] px-4 py-2 font-semibold text-[#1a365d] hover:bg-[#1a365d] hover:text-[#ffffff]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
