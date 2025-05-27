import { useState } from "react";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import logo from "../images/logo.png";
import background from "../images/background.jpg";
import { LOGIN_URL, COOKIE_TIME } from "../utils/globalConstants";
import useVerifyLogin from "../hooks/useVerifyLogin";
import { addUser } from "../redux/loginSlice";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useVerifyLogin(location.pathname);

  const formValidation = async () => {
    if (userName === "") {
      setErrorMessage("Enter Username");
    } else if (password === "") {
      setErrorMessage("Enter Password");
    } else {
      try {
        const response = await fetch(LOGIN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            USERNAME: userName,
            PASSWORD: password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage(null);
          const data = await response.json();
          Cookies.set("userCookie", JSON.stringify(data), {
            expires: COOKIE_TIME,
          });
          dispatch(addUser(data));
          navigate("/allJobs", { replace: true });
        }
      } catch (error) {
        setErrorMessage(error.message || "An unexpected error occurred");
      }
    }
  };

  return (
    <div
      className="flex h-screen flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <img src={logo} alt="logo" className="relative w-64" />

      {errorMessage && (
        <p className="relative mt-6 w-5/6 rounded-lg border border-red-500 bg-white p-1 text-center font-bold text-red-500 lg:w-1/3">
          Error : {errorMessage}
        </p>
      )}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative flex w-5/6 flex-col justify-center lg:w-1/3"
      >
        <input
          type="text"
          placeholder="Enter Username"
          className="mt-6 w-full rounded-full border-0 bg-black/75 px-4 py-2 text-white selection:border-0"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          autoFocus
        />
        <div className="relative mt-6 w-full">
          <input
            type={hidePassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full rounded-full border-0 bg-black/75 px-4 py-2 text-white selection:border-0"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-white"
            onClick={() => setHidePassword((prev) => !prev)}
          >
            {hidePassword ? (
              <BiSolidHide size={24} />
            ) : (
              <BiSolidShow size={24} />
            )}
          </span>
        </div>

        <button
          className="mx-auto mt-6 block w-32 rounded-full border border-black bg-black px-4 py-2 text-white"
          onClick={formValidation}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
