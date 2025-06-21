import { useEffect, useState } from "react";
import {
  DELETE_USER_URL,
  RESET_PASSWORD_URL,
  USER_LIST_URL,
  BUTTON_BASE_STYLE,
  BUTTON_COLORS,
} from "../utils/globalConstants";
import { useSelector } from "react-redux";

const UserList = () => {
  const [allData, setAllData] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

  const tableHead = ["ID", "USERNAME", "NAME", "LAST LOGIN", "ACTION"];

  const { jwtToken, position } = useSelector((store) => store.loginSlice);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(USER_LIST_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`Failed to fetch job details: ${response.statusText}`);

      const data = await response.json();
      setAllData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching job details:", error.message);
      setMessage({ errorMsg: "Failed to fetch user details", successMsg: "" });
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetPassword = async (userName) => {
    try {
      const response = await fetch(RESET_PASSWORD_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, position }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ errorMsg: "", successMsg: `${result.message}` });
      } else {
        setMessage({ errorMsg: `Error: ${result.message}`, successMsg: "" });
      }
    } catch (error) {
      setMessage({
        errorMsg: "An error occurred while resetting password",
        successMsg: "",
      });
    }
  };

  const handleDeleteUser = async (userName) => {
    try {
      const response = await fetch(DELETE_USER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, position }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ errorMsg: "", successMsg: `${result.message}` });
        fetchUserDetails();
      } else {
        setMessage({ errorMsg: `Error: ${result.message}`, successMsg: "" });
      }
    } catch (error) {
      setMessage({
        errorMsg: "An error occurred while deleting user",
        successMsg: "",
      });
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
      <div className="mt-4 overflow-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-[#1a365d] text-center text-white">
              {tableHead.map((head, index) => (
                <th key={index} className="border border-gray-300 px-2 py-1">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.length > 0 ? (
              allData.map((user, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                >
                  <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                    {user.ID}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                    {user.USERNAME}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                    {user.NAME}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                    {user.LAST_LOGIN === "NONE" ? "Never" : user.LAST_LOGIN}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleResetPassword(user.USERNAME)}
                        className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.SUCCESS.base} ${BUTTON_COLORS.SUCCESS.hover}`}
                      >
                        Reset Pwd
                      </button>
                      {position === "ADMIN" && (
                        <button
                          onClick={() => {
                            setSelectedUsername(user.USERNAME);
                            setIsDeletePopupOpen(true);
                          }}
                          className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHead.length} className="p-4 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a365d]/50">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-center">Delete User</h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete user &quot;{selectedUsername}
              &quot;?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
                onClick={() => {
                  handleDeleteUser(selectedUsername);
                  setIsDeletePopupOpen(false);
                }}
              >
                Delete
              </button>
              <button
                className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
                onClick={() => setIsDeletePopupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
