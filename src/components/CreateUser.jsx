import { useState } from "react";
import { useSelector } from "react-redux";

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { CREATE_USER_URL } from "../utils/globalConstants";

const CreateUser = () => {
  const [credentials, setCredentials] = useState({
    newUserName: "",
    newName: "",
    newPassword: "",
    admintPassword: "",
  });
  const [visibility, setVisibility] = useState({
    password: false,
    tPassword: false,
  });
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

  const { position, userName, userId, jwtToken } = useSelector(
    (store) => store.loginSlice,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleVisibilityToggle = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswords = () => {
    if (!credentials.newUserName) return "Enter User Name";
    if (!credentials.newName) return "Enter Name";
    if (!credentials.newPassword) return "Enter Password";
    if (!credentials.admintPassword) return "Enter Transaction Password";
  };

  const handleSubmit = async () => {
    const validationError = validatePasswords();

    if (validationError) {
      setMessage({ errorMsg: validationError, successMsg: "" });
      return;
    }

    setMessage({ errorMsg: "", successMsg: "" });

    try {
      const response = await fetch(CREATE_USER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...credentials,
          position,
          userName,
          userId,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ errorMsg: "", successMsg: "User Created Successfully" });
        setCredentials({
          newUserName: "",
          newName: "",
          newPassword: "",
          admintPassword: "",
        });
      } else {
        setMessage({ errorMsg: `Error: ${result.message}`, successMsg: "" });
      }
    } catch (error) {
      setMessage({ errorMsg: `Error: ${error.message}`, successMsg: "" });
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      {message.errorMsg && (
        <p className="my-1 text-center text-lg font-bold text-red-600">
          {message.errorMsg}
        </p>
      )}
      {message.successMsg && (
        <p className="my-1 text-center text-lg font-bold text-green-700">
          {message.successMsg}
        </p>
      )}
      <div className="flex items-start justify-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full rounded-xl bg-gray-800 p-6 lg:w-1/2"
        >
          <div className="my-3 w-full">
            <label className="mb-2 block w-full text-xl font-bold text-white">
              User Name
            </label>
            <div className="w-full">
              <input
                type="text"
                name="newUserName"
                value={credentials.newUserName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                placeholder="User Name"
              />
            </div>
          </div>
          <div className="my-3 w-full">
            <label className="mb-2 block w-full text-xl font-bold text-white">
              Name
            </label>
            <div className="w-full">
              <input
                type="text"
                name="newName"
                value={credentials.newName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                placeholder="Name"
              />
            </div>
          </div>
          <div className="relative my-3 w-full">
            <label className="mb-2 block w-full text-xl font-bold text-white">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={visibility.password ? "text" : "password"}
                name="newPassword"
                value={credentials.newPassword}
                onChange={handleInputChange}
                className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                placeholder="Password"
              />
              <span
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                onClick={() => handleVisibilityToggle("password")}
              >
                {visibility.password ? (
                  <BiSolidHide size={24} />
                ) : (
                  <BiSolidShow size={24} />
                )}
              </span>
            </div>
          </div>

          <div className="relative my-3 w-full">
            <label className="mb-2 block w-full text-xl font-bold text-white">
              Transaction Password
            </label>
            <div className="relative w-full">
              <input
                type={visibility.tPassword ? "text" : "password"}
                name="admintPassword"
                value={credentials.admintPassword}
                onChange={handleInputChange}
                className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                placeholder="Transaction Password"
              />
              <span
                className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                onClick={() => handleVisibilityToggle("tPassword")}
              >
                {visibility.tPassword ? (
                  <BiSolidHide size={24} />
                ) : (
                  <BiSolidShow size={24} />
                )}
              </span>
            </div>
          </div>
          <div className="mt-5 text-center">
            <button
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
