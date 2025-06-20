import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import {
  CREATE_USER_URL,
  PASSWORD_VALIDATIONS,
  PASSWORD_REQUIREMENTS,
} from "../utils/globalConstants";

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
  const [isLoading, setIsLoading] = useState(false);

  const { position, userName, userId, jwtToken } = useSelector(
    (store) => store.loginSlice,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityToggle = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    if (!credentials.newUserName.trim()) {
      setMessage({ errorMsg: "Username is required", successMsg: "" });
      return false;
    }
    if (!credentials.newName.trim()) {
      setMessage({ errorMsg: "Name is required", successMsg: "" });
      return false;
    }
    if (!credentials.newPassword.trim()) {
      setMessage({ errorMsg: "Password is required", successMsg: "" });
      return false;
    }
    if (!credentials.admintPassword.trim()) {
      setMessage({
        errorMsg: "Transaction password is required",
        successMsg: "",
      });
      return false;
    }
    // Password validation
    const password = credentials.newPassword;
    const hasUpperCase = PASSWORD_VALIDATIONS.HAS_UPPERCASE.test(password);
    const hasLowerCase = PASSWORD_VALIDATIONS.HAS_LOWERCASE.test(password);
    const hasNumbers = PASSWORD_VALIDATIONS.HAS_NUMBERS.test(password);
    const hasSpecialChar = PASSWORD_VALIDATIONS.HAS_SPECIAL_CHAR.test(password);
    const isLongEnough = password.length >= PASSWORD_VALIDATIONS.MIN_LENGTH;
    if (!isLongEnough) {
      setMessage({
        errorMsg: "Password must be at least 6 characters long",
        successMsg: "",
      });
      return false;
    }
    if (!hasUpperCase) {
      setMessage({
        errorMsg: "Password must contain at least one uppercase letter",
        successMsg: "",
      });
      return false;
    }
    if (!hasLowerCase) {
      setMessage({
        errorMsg: "Password must contain at least one lowercase letter",
        successMsg: "",
      });
      return false;
    }
    if (!hasNumbers) {
      setMessage({
        errorMsg: "Password must contain at least one number",
        successMsg: "",
      });
      return false;
    }
    if (!hasSpecialChar) {
      setMessage({
        errorMsg:
          'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)',
        successMsg: "",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (position !== "ADMIN") {
      setMessage({ errorMsg: "Unauthorized access", successMsg: "" });
      return;
    }
    setIsLoading(true);
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
        setMessage({ errorMsg: "", successMsg: result.message });
        setCredentials({
          newUserName: "",
          newName: "",
          newPassword: "",
          admintPassword: "",
        });
      } else {
        setMessage({
          errorMsg: result.message || "Failed to create user",
          successMsg: "",
        });
      }
    } catch (error) {
      setMessage({
        errorMsg: "Failed to create user. Please try again.",
        successMsg: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      {message.errorMsg && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-center text-red-700">
          <p className="">{message.errorMsg}</p>
        </div>
      )}
      {message.successMsg && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-green-700">
          <p className="">{message.successMsg}</p>
        </div>
      )}
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center lg:w-2/3">
          <form
            className="w-full rounded-lg bg-[#1a365d] p-4 text-white"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* User Name */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-white">User Name</label>
              <input
                type="text"
                name="newUserName"
                value={credentials.newUserName}
                onChange={handleInputChange}
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                placeholder="User Name"
              />
            </div>
            {/* Name */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-white">Name</label>
              <input
                type="text"
                name="newName"
                value={credentials.newName}
                onChange={handleInputChange}
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                placeholder="Name"
              />
            </div>
            {/* Password */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-white">Password</label>
              <div className="relative w-full">
                <input
                  type={visibility.password ? "text" : "password"}
                  name="newPassword"
                  value={credentials.newPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder="Password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                  onClick={() => handleVisibilityToggle("password")}
                >
                  {visibility.password ? (
                    <BiSolidHide size={24} color="#1a365d" />
                  ) : (
                    <BiSolidShow size={24} color="#1a365d" />
                  )}
                </span>
              </div>
            </div>
            {/* Transaction Password */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-white">T. Password</label>
              <div className="relative w-full">
                <input
                  type={visibility.tPassword ? "text" : "password"}
                  name="admintPassword"
                  value={credentials.admintPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder="Transaction Password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                  onClick={() => handleVisibilityToggle("tPassword")}
                >
                  {visibility.tPassword ? (
                    <BiSolidHide size={24} color="#1a365d" />
                  ) : (
                    <BiSolidShow size={24} color="#1a365d" />
                  )}
                </span>
              </div>
            </div>
            {/* Password Requirements */}
            <div className="mt-6 text-white">
              <p className="mb-2">Password Requirements:</p>
              <ul className="list-inside list-disc space-y-1">
                {PASSWORD_REQUIREMENTS.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
            {/* Submit Button */}
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-white transition-colors hover:bg-white hover:text-[#1a365d] disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
