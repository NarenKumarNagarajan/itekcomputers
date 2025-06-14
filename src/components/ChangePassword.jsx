import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useApi } from "../hooks/useApi";
import { CHANGE_PWD_URL } from "../utils/globalConstants";

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
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name.replace(/([A-Z])/g, " $1").trim()} is required`;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {
      oldPassword: validateField("oldPassword", formData.oldPassword),
      newPassword: validateField("newPassword", formData.newPassword),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword,
      ),
    };

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setMessage({ errorMsg: "", successMsg: "" });

    if (!validateForm()) {
      return;
    }

    try {
      const response = await execute(() =>
        fetch(CHANGE_PWD_URL, {
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
        setErrors({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
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
    <div className="container mx-auto p-4">
      {message.errorMsg && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-center">
          <p className="font-bold text-red-700">{message.errorMsg}</p>
        </div>
      )}
      {message.successMsg && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-center">
          <p className="font-bold text-green-700">{message.successMsg}</p>
        </div>
      )}
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center lg:w-2/3">
          <form
            className="w-full rounded-lg bg-[#1a365d] p-4 font-bold text-white"
            onSubmit={onFormSubmit}
          >
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2 md:grid-cols-[180px_1fr]">
              <label className="text-left text-xl font-bold text-white">
                Old Password:
              </label>
              <div className="flex flex-col">
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder="Enter Old Password"
                />
                {errors.oldPassword && (
                  <span className="mt-1 text-sm text-red-300">
                    {errors.oldPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2 md:grid-cols-[180px_1fr]">
              <label className="text-left text-xl font-bold text-white">
                New Password:
              </label>
              <div className="flex flex-col">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder="Enter New Password"
                />
                {errors.newPassword && (
                  <span className="mt-1 text-sm text-red-300">
                    {errors.newPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2 md:grid-cols-[180px_1fr]">
              <label className="text-left text-xl font-bold text-white">
                Confirm Password:
              </label>
              <div className="flex flex-col">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder="Confirm New Password"
                />
                {errors.confirmPassword && (
                  <span className="mt-1 text-sm text-red-300">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a365d] disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
