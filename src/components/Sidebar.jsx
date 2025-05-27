import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveMenu, toggleSidebar } from "../redux/sidebarSlice";
import { ADMIN_MENU_ITEMS, USER_MENU_ITEMS } from "../utils/globalConstants";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isSidebarOpen, activeMenu } = useSelector(
    (state) => state.sidebarSlice,
  );
  const { position } = useSelector((store) => store.loginSlice);

  const handleMenuClick = (menuItem) => {
    const menuKey = menuItem.title.toLowerCase().replace(" ", "");
    dispatch(setActiveMenu(menuKey));

    // Close sidebar for mobile view
    if (window.innerWidth < 1024) {
      dispatch(toggleSidebar(false)); // Dispatch action to close the sidebar
    }
  };

  const renderMenuItem = (menuItem) => {
    const isActive =
      activeMenu === menuItem.title.toLowerCase().replace(" ", "");
    return (
      <div key={menuItem.title} className="bg-[#1a365d]">
        <Link to={menuItem.link}>
          <li
            className={`p-3 hover:bg-[#ffffff] hover:text-[#1a365d] ${
              isActive
                ? "bg-[#ffffff] text-[#1a365d]"
                : "bg-[#1a365d] text-[#ffffff]"
            }`}
            onClick={() => handleMenuClick(menuItem)}
          >
            {menuItem.title}
          </li>
        </Link>
      </div>
    );
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <>
      <div className="z-10 hidden h-auto min-h-screen w-[230px] flex-col justify-between overflow-y-auto bg-[#1a365d] text-[#ffffff] lg:flex">
        <ul className="bg-[#1a365d]">
          {position === "ADMIN"
            ? ADMIN_MENU_ITEMS.map(renderMenuItem)
            : USER_MENU_ITEMS.map(renderMenuItem)}
        </ul>
      </div>
      <div className="fixed top-[66px] right-0 bottom-0 left-0 z-50 flex h-[calc(100vh-66px)] w-full flex-col justify-between overflow-y-auto bg-[#1a365d] text-[#ffffff] lg:hidden">
        <ul className="bg-[#1a365d]">
          {position === "ADMIN"
            ? ADMIN_MENU_ITEMS.map(renderMenuItem)
            : USER_MENU_ITEMS.map(renderMenuItem)}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
