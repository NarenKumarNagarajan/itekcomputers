import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../images/logo.png";
import { COOKIE_TIME, LOGIN_URL } from "../utils/globalConstants";
import useVerifyLogin from "../hooks/useVerifyLogin";
import { addUser } from "../redux/loginSlice";
import { useApi } from "../hooks/useApi";
import LoadingSpinner from "./common/LoadingSpinner";
import { FaSignInAlt } from "react-icons/fa";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { postData, loading: isLoading, error: apiError } = useApi();

  useVerifyLogin(location.pathname);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
      general: "",
    };

    if (!userName.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [userName, password]);

  const formValidation = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const data = await postData(LOGIN_URL, {
        USERNAME: userName,
        PASSWORD: password,
      });

      setErrors({
        username: "",
        password: "",
        general: "",
      });

      Cookies.set("userCookie", JSON.stringify(data), {
        expires: COOKIE_TIME,
      });
      dispatch(addUser(data));
      navigate("/allJobs", { replace: true });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || "An unexpected error occurred",
      }));
    }
  }, [userName, password, validateForm, postData, dispatch, navigate]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formValidation();
    }
  };

  return (
    <div
      className="flex h-screen flex-col items-center justify-center"
      style={{
        backgroundColor: "#1a365d",
      }}
    >
      <img
        src={logo}
        alt="logo"
        className="relative mb-8 w-64 rounded-lg bg-white p-4"
      />

      {(errors.general || apiError) && (
        <div className="relative mt-6 mb-3 w-5/6 rounded-lg border-2 border-red-500 bg-red-50 p-3 text-center text-red-600 lg:w-1/3">
          <p className="">{errors.general || apiError}</p>
        </div>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={handleKeyPress}
        className="relative flex w-full flex-col justify-center px-4 md:w-2/3 lg:w-1/3"
      >
        <div className="relative mb-6 flex flex-col">
          <input
            type="text"
            name="username"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
            placeholder="Enter Username"
            autoFocus
            className="w-full rounded-lg border-2 border-white bg-white px-4 py-2 text-gray-700 focus:border-white focus:outline-none"
          />
          {errors.username && (
            <p className="mt-1 text-red-500">{errors.username}</p>
          )}
        </div>
        <div className="relative mb-6 flex flex-col">
          <div className="relative flex-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Enter Password"
              className="w-full rounded-lg border-2 border-white bg-white px-4 py-2 text-gray-700 focus:border-white focus:outline-none"
            />
            <span
              className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <BiSolidHide size={22} color="#1a365d" />
              ) : (
                <BiSolidShow size={22} color="#1a365d" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="mt-1 text-red-500">{errors.password}</p>
          )}
        </div>
        <button
          onClick={formValidation}
          disabled={isLoading}
          className="mt-2 flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-white transition-colors hover:bg-white hover:text-[#1a365d] disabled:opacity-50"
        >
          {isLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <FaSignInAlt size={20} />
          )}
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
