import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const useVerifyLogin = (defaultPath = "/") => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasCookie = Cookies.get("userCookie");

    if (!hasCookie) {
      navigate("/");
    } else if (location.pathname === "/") {
      // Only redirect to default path if we're on the root path
      navigate(defaultPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useVerifyLogin;
