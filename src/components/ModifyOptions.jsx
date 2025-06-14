import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useApi } from "../hooks/useApi";
import {
  DELETE_PICKERS_URL,
  INSERT_PICKERS_URL,
  PICKERS_LIST_URL,
  UPDATE_PICKERS_URL,
} from "../utils/globalConstants";

const menus = ["ENGINEER", "MOC", "ASSET", "PRODUCT", "FAULT", "STATUS"];
const tableHead = ["S. NO", "PICKERS", "ACTIONS"];

const ModifyOptions = () => {
  const [menuSelected, setMenuSelected] = useState(menus[0]);
  const [pickerData, setPickerData] = useState([]);
  const [inputOpen, setInputOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const [selectedPicker, setSelectedPicker] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [message, setMessage] = useState({ type: null, text: null });
  const [editingPicker, setEditingPicker] = useState(null);
  const [editValue, setEditValue] = useState("");

  const timeoutRef = useRef(null);
  const { jwtToken, position } = useSelector((store) => store.loginSlice);
  const { fetchData: useApiFetchData } = useApi();

  const resetInput = () => {
    setInputOpen(false);
    setInputData("");
    clearMessage();
  };

  const clearMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMessage({ type: null, text: null });
  };

  const showMessage = (type, text) => {
    clearMessage();
    setMessage({ type, text });
    timeoutRef.current = setTimeout(clearMessage, 3000);
  };

  useEffect(() => {
    fetchData();
    return () => clearMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuSelected]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${PICKERS_LIST_URL}?menuSelected=${menuSelected}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch picker details: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setPickerData(data);
    } catch (error) {
      console.error("Error fetching picker details:", error.message);
      showMessage("error", "Failed to fetch picker details.");
    }
  };

  const handlePickerAction = async (
    url,
    method,
    body,
    successMessage,
    callback,
  ) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("success", successMessage || data.message);
        callback && callback();
      } else {
        showMessage("error", data.error || "Action failed.");
      }
    } catch (error) {
      console.error("Error with picker action:", error.message);
      showMessage("error", "Action failed.");
    }
  };

  const insertPicker = () => {
    if (inputData.trim().length < 1) {
      showMessage("error", "Invalid data to insert.");
      return;
    }

    handlePickerAction(
      INSERT_PICKERS_URL,
      "POST",
      { menuSelected, pickerName: inputData },
      "Picker added successfully!",
      () => {
        resetInput();
        fetchData();
      },
    );
  };

  const deletePicker = () => {
    if (!selectedPicker) return;

    handlePickerAction(
      DELETE_PICKERS_URL,
      "POST",
      { menuSelected, pickerName: selectedPicker, position },
      "Picker deleted successfully!",
      () => {
        fetchData();
        closeDeletePopup();
      },
    );
  };

  const updatePicker = () => {
    if (!editValue.trim()) {
      showMessage("error", "Picker name cannot be empty.");
      return;
    }

    handlePickerAction(
      UPDATE_PICKERS_URL,
      "POST",
      {
        menuSelected,
        oldPicker: editingPicker,
        newPicker: editValue.trim(),
        position,
      },
      "Picker updated successfully!",
      () => {
        fetchData();
        handleEditCancel();
      },
    );
  };

  const handleEditCancel = () => {
    setEditingPicker(null);
    setEditValue("");
  };

  const openDeletePopup = (picker) => {
    setSelectedPicker(picker);
    setDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setDeletePopup(false);
    setSelectedPicker(null);
  };

  const renderMessage = () =>
    message.text && (
      <p
        className={`my-2 text-center text-lg font-bold ${
          message.type === "error" ? "text-red-600" : "text-green-700"
        }`}
      >
        {message.text}
      </p>
    );

  const renderTable = () =>
    pickerData.length > 0 ? (
      pickerData.map((row, index) => (
        <tr
          key={index}
          className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
        >
          <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
            {index + 1}
          </td>
          <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
            {editingPicker === row ? (
              <input
                type="text"
                className="w-full rounded-md border p-1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              row
            )}
          </td>
          <td className="border border-gray-300 px-2 py-1 text-center whitespace-nowrap">
            <div className="flex justify-center gap-4">
              {editingPicker === row ? (
                <>
                  <button
                    className="rounded bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
                    onClick={updatePicker}
                  >
                    SAVE
                  </button>
                  <button
                    className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                    onClick={handleEditCancel}
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
                    onClick={() => {
                      setEditingPicker(row);
                      setEditValue(row);
                    }}
                  >
                    EDIT
                  </button>
                  <button
                    className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                    onClick={() => openDeletePopup(row)}
                  >
                    DELETE
                  </button>
                </>
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
    );

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex w-full flex-row flex-wrap items-center justify-around">
        {menus.map((menu) => (
          <button
            key={menu}
            className={`m-2 w-1/3 border-2 border-black py-1 font-bold outline-0 lg:w-1/6 ${
              menuSelected === menu
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setMenuSelected(menu)}
          >
            {menu}
          </button>
        ))}
      </div>

      {!inputOpen ? (
        <div className="mt-1 flex justify-center">
          <button
            className="rounded bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
            onClick={() => setInputOpen(true)}
          >
            ADD NEW {menuSelected}
          </button>
        </div>
      ) : (
        <div className="my-2 flex items-center justify-center">
          <div className="flex w-full flex-row items-center justify-between lg:w-1/3">
            <input
              type="text"
              className="w-3/6 rounded-md border-2 border-black p-1 text-black outline-0"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
            />
            <button
              className="rounded bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
              onClick={insertPicker}
            >
              SAVE
            </button>
            <button
              className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
              onClick={resetInput}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {renderMessage()}

      <div className="mt-4 overflow-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-300 text-center font-bold">
              {tableHead.map((head, index) => (
                <th key={index} className="border border-gray-300 px-2 py-1">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </table>
      </div>

      {deletePopup && (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black">
          <div className="w-4/5 rounded-lg bg-white p-6 text-center lg:w-1/4">
            <p className="text-lg font-bold">
              Are you sure you want to delete &quot;{selectedPicker}&quot;?
            </p>
            <div className="mt-4 flex justify-around">
              <button
                className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                onClick={deletePicker}
              >
                YES
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                onClick={closeDeletePopup}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyOptions;
