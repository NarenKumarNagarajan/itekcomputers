import { useState } from "react";
import { useSelector } from "react-redux";

import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { CHANGE_PWD_URL, CHANGE_TPWD_URL } from "../utils/globalConstants";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibility, setVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

  const { position, jwtToken, userName, userId } = useSelector(
    (store) => store.loginSlice,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleVisibilityToggle = (field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswords = () => {
    const { oldPassword, newPassword, confirmPassword } = passwords;
    if (!oldPassword) return "Enter Password";
    if (!newPassword) return "Enter New Password";
    if (!confirmPassword) return "Enter Confirm Password";
    if (newPassword !== confirmPassword)
      return "New Password And Confirm Password Mismatch";
    return "";
  };

  const handleSubmit = async (url, successMsg) => {
    const validationError = validatePasswords();
    if (validationError) {
      setMessage({ errorMsg: validationError, successMsg: "" });
      return;
    }
    setMessage({ errorMsg: "", successMsg: "" });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...passwords,
          userName,
          userId,
          position,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ errorMsg: "", successMsg });
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
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
          {["Old", "New", "Confirm"].map((field) => (
            <div key={field} className="relative my-3 w-full">
              <label className="mb-2 block w-full text-xl font-bold text-white">
                {`${field} Password`}
              </label>
              <div className="relative w-full">
                <input
                  type={
                    visibility[`${field.toLowerCase()}Password`]
                      ? "text"
                      : "password"
                  }
                  name={`${field.toLowerCase()}Password`}
                  value={passwords[`${field.toLowerCase()}Password`]}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                  placeholder={`${field} Password`}
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                  onClick={() =>
                    handleVisibilityToggle(`${field.toLowerCase()}Password`)
                  }
                >
                  {visibility[`${field.toLowerCase()}Password`] ? (
                    <BiSolidHide size={24} />
                  ) : (
                    <BiSolidShow size={24} />
                  )}
                </span>
              </div>
            </div>
          ))}
          <div className="mt-5 flex flex-col justify-center space-y-3">
            <button
              className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
              onClick={() =>
                handleSubmit(CHANGE_PWD_URL, "Password updated successfully!")
              }
            >
              Change Password
            </button>
            {position === "ADMIN" && (
              <button
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                onClick={() =>
                  handleSubmit(
                    CHANGE_TPWD_URL,
                    "Transaction Password updated successfully!",
                  )
                }
              >
                Change Transaction Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
