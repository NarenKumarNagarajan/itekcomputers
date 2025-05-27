import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useVerifyLogin = (navigateLink = "/") => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasCookie = Cookies.get("userCookie");

    if (!hasCookie) {
      navigate("/");
    } else {
      navigate(navigateLink === "/" ? "/allJobs" : navigateLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);
};

export default useVerifyLogin;
