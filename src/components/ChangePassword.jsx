import { useState } from "react";
import { useSelector } from "react-redux";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import {
  CHANGE_PWD_URL,
  CHANGE_TPWD_URL,
  PASSWORD_VALIDATIONS,
  PASSWORD_REQUIREMENTS,
} from "../utils/globalConstants";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { jwtToken, userName, userId, position } = useSelector(
    (store) => store.loginSlice,
  );
  const { execute, loading } = useApi();
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visibility, setVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordType, setPasswordType] = useState("password"); // "password" or "transaction"

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisibilityToggle = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.oldPassword.trim()) {
      setMessage({ errorMsg: "Old password is required", successMsg: "" });
      return false;
    }
    if (!formData.newPassword.trim()) {
      setMessage({ errorMsg: "New password is required", successMsg: "" });
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      setMessage({ errorMsg: "Confirm password is required", successMsg: "" });
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ errorMsg: "Passwords do not match", successMsg: "" });
      return false;
    }

    // Password validation
    const password = formData.newPassword;
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

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setMessage({ errorMsg: "", successMsg: "" });

    if (!validateForm()) {
      return;
    }

    // Check if user is ADMIN for transaction password change
    if (passwordType === "transaction" && position !== "ADMIN") {
      setMessage({ errorMsg: "Unauthorized access", successMsg: "" });
      return;
    }

    try {
      const response = await execute(() =>
        fetch(passwordType === "password" ? CHANGE_PWD_URL : CHANGE_TPWD_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            userName,
            userId,
            position,
          }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to change password");
          }
          return data;
        }),
      );

      if (response.message === "Password updated successfully") {
        setMessage({ errorMsg: "", successMsg: response.message });
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setVisibility({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false,
        });
      } else {
        setMessage({
          errorMsg: response.message || "Failed to change password",
          successMsg: "",
        });
      }
    } catch (error) {
      setMessage({
        errorMsg: error.message || "Failed to change password",
        successMsg: "",
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      {message.errorMsg && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-center text-red-700">
          <p className="font-bold">{message.errorMsg}</p>
        </div>
      )}
      {message.successMsg && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-green-700">
          <p className="font-bold">{message.successMsg}</p>
        </div>
      )}
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center lg:w-2/3">
          <form
            className="w-full rounded-lg bg-[#1a365d] p-4 font-bold text-white"
            onSubmit={onFormSubmit}
          >
            {/* Password Type Selection */}
            <div className="mb-4 grid w-full grid-cols-[180px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                Change Type
              </label>
              <select
                value={passwordType}
                onChange={(e) => setPasswordType(e.target.value)}
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
              >
                <option value="password">Password</option>
                <option value="transaction">Transaction Password</option>
              </select>
            </div>

            {/* Old Password */}
            <div className="mb-4 grid w-full grid-cols-[180px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                Old {passwordType === "password" ? "Password" : "T. Password"}
              </label>
              <div className="relative w-full">
                <input
                  type={visibility.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder={`Old ${passwordType === "password" ? "Password" : "T. Password"}`}
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                  onClick={() => handleVisibilityToggle("oldPassword")}
                >
                  {visibility.oldPassword ? (
                    <BiSolidHide size={24} color="#1a365d" />
                  ) : (
                    <BiSolidShow size={24} color="#1a365d" />
                  )}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4 grid w-full grid-cols-[180px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                New {passwordType === "password" ? "Password" : "T. Password"}
              </label>
              <div className="relative w-full">
                <input
                  type={visibility.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder={`New ${passwordType === "password" ? "Password" : "T. Password"}`}
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                  onClick={() => handleVisibilityToggle("newPassword")}
                >
                  {visibility.newPassword ? (
                    <BiSolidHide size={24} color="#1a365d" />
                  ) : (
                    <BiSolidShow size={24} color="#1a365d" />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4 grid w-full grid-cols-[180px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                Confirm{" "}
                {passwordType === "password" ? "Password" : "T. Password"}
              </label>
              <div className="relative w-full">
                <input
                  type={visibility.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder={`Confirm ${passwordType === "password" ? "Pwd" : "T. Pwd"}`}
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center"
                  onClick={() => handleVisibilityToggle("confirmPassword")}
                >
                  {visibility.confirmPassword ? (
                    <BiSolidHide size={24} color="#1a365d" />
                  ) : (
                    <BiSolidShow size={24} color="#1a365d" />
                  )}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a365d] disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change"}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-6 text-sm text-white">
              <p className="mb-2 font-bold">Password Requirements:</p>
              <ul className="list-inside list-disc space-y-1">
                {PASSWORD_REQUIREMENTS.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
