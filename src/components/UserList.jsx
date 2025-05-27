import { useEffect, useState } from "react";
import {
  DELETE_USER_URL,
  RESET_PASSWORD_URL,
  USER_LIST_URL,
} from "../utils/globalConstants";
import { useSelector } from "react-redux";

const UserList = () => {
  const [allData, setAllData] = useState({});
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
      setAllData(data);
    } catch (error) {
      console.error("Error fetching job details:", error.message);
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
      setMessage({ errorMsg: `Error: ${error.message}`, successMsg: "" });
    }
  };

  const openPopup = (userName) => {
    setSelectedUsername(userName);
    setIsDeletePopupOpen(true);
  };

  const closePopup = () => {
    setSelectedUsername("");
    setIsDeletePopupOpen(false);
  };

  const handleDelete = async (userName) => {
    setIsDeletePopupOpen(false);

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
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse overflow-auto border-2 border-[#ddd]">
          <thead>
            <tr className="bg-black text-white">
              {tableHead.map((heading, index) => (
                <th
                  key={index}
                  className="whitespace-nowrap border border-gray-300 px-2 py-1 text-center"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.length > 0 ? (
              allData.map((row, index) => (
                <tr
                  key={row.ID}
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                >
                  <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                    {row.ID}
                  </td>
                  <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                    {row.USERNAME}
                  </td>
                  <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                    {row.NAME}
                  </td>
                  <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                    {row.LAST_LOGIN}
                  </td>

                  <td className="whitespace-nowrap border border-gray-300 px-2 py-1 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
                        onClick={() => handleResetPassword(row.USERNAME)}
                      >
                        Reset Password
                      </button>
                      <button
                        className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                        onClick={() => openPopup(row.USERNAME)}
                      >
                        Delete
                      </button>
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
      {isDeletePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <div>
              Dp you want to delete user -{" "}
              <span className="font-bold">{selectedUsername}</span> ?
            </div>
            <div className="mt-4 flex justify-center space-x-10">
              <button
                className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                onClick={() => handleDelete(selectedUsername)}
              >
                Delete
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                onClick={closePopup}
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
