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
      <div key={menuItem.title}>
        <Link to={menuItem.link}>
          <li
            className={`p-3 hover:bg-gray-700 ${isActive && "bg-slate-400"}`}
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
      <div className="z-10 hidden h-auto min-h-screen w-[230px] flex-col justify-between overflow-y-auto bg-gray-800 text-white lg:flex">
        <ul className="my-4">
          {position === "ADMIN"
            ? ADMIN_MENU_ITEMS.map(renderMenuItem)
            : USER_MENU_ITEMS.map(renderMenuItem)}
        </ul>
      </div>
      <div className="absolute z-10 flex w-[230px] flex-col justify-between overflow-y-auto bg-gray-800 text-white lg:hidden">
        <ul className="my-4">
          {position === "ADMIN"
            ? ADMIN_MENU_ITEMS.map(renderMenuItem)
            : USER_MENU_ITEMS.map(renderMenuItem)}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
