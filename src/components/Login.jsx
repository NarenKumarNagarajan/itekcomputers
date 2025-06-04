import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import logo from "../images/logo.png";
import { COOKIE_TIME } from "../utils/globalConstants";
import useVerifyLogin from "../hooks/useVerifyLogin";
import { addUser } from "../redux/loginSlice";
import { useApi } from "../hooks/useApi";
import { api } from "../services/api";
import Input from "./common/Input";
import Button from "./common/Button";
import ErrorMessage from "./common/ErrorMessage";
import LoadingSpinner from "./common/LoadingSpinner";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { execute: login, isLoading, error: apiError } = useApi();

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
      const data = await login(() =>
        api.login({ USERNAME: userName, PASSWORD: password }),
      );

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
  }, [userName, password, validateForm, login, dispatch, navigate]);

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

      <ErrorMessage
        message={errors.general || apiError}
        type={apiError ? "error" : "error"}
        className="mb-8"
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={handleKeyPress}
        className="relative flex w-full flex-col justify-center px-4 md:w-2/3 lg:w-1/3"
      >
        <Input
          type="text"
          name="username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            setErrors((prev) => ({ ...prev, username: "" }));
          }}
          error={errors.username}
          placeholder="Enter Username"
          autoFocus
        />

        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={errors.password}
          placeholder="Enter Password"
        />

        <Button
          onClick={formValidation}
          disabled={isLoading}
          className="mt-2"
          icon={
            isLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <FaSignInAlt size={20} />
            )
          }
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
