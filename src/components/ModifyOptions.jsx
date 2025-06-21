import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useApi } from "../hooks/useApi";
import {
  DELETE_PICKERS_URL,
  INSERT_PICKERS_URL,
  PICKERS_LIST_URL,
  UPDATE_PICKERS_URL,
  BUTTON_BASE_STYLE,
  BUTTON_COLORS,
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

  const handlePickerAction = async (url, method, body, successMessage) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      // Check if response is ok
      if (response.ok) {
        setMessage({ errorMsg: "", successMsg: data.message });
        await fetchData();
        return true;
      } else {
        // Handle error messages from the server
        setMessage({
          errorMsg: data.message || data.error || "Operation failed",
          successMsg: "",
        });
        return false;
      }
    } catch (error) {
      setMessage({
        errorMsg: error.message || "Operation failed",
        successMsg: "",
      });
      return false;
    }
  };

  const insertPicker = async () => {
    if (!inputData.trim()) {
      setMessage({ errorMsg: "Please enter a picker name", successMsg: "" });
      return;
    }

    const success = await handlePickerAction(
      INSERT_PICKERS_URL,
      "POST",
      { menuSelected, pickerName: inputData, position },
      "Picker added successfully!",
    );

    if (success) {
      setInputData("");
      setInputOpen(false);
    }
  };

  const deletePicker = async () => {
    if (!selectedPicker) return;

    const success = await handlePickerAction(
      DELETE_PICKERS_URL,
      "POST",
      {
        menuSelected: menuSelected,
        pickerName: selectedPicker,
        position,
      },
      `Picker '${selectedPicker}' deleted successfully.`,
    );

    if (success) {
      closeDeletePopup();
    }
  };

  const updatePicker = async (picker) => {
    if (!editValue.trim()) {
      showMessage("error", "Picker name cannot be empty.");
      return;
    }

    const success = await handlePickerAction(
      UPDATE_PICKERS_URL,
      "POST",
      {
        menuSelected,
        oldPicker: picker,
        newPicker: editValue.trim(),
        position,
      },
      "Picker updated successfully!",
    );

    if (success) {
      setEditingPicker(null);
      setEditValue("");
    }
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

  const renderMessage = () => {
    if (message.errorMsg) {
      return (
        <div className="my-4 rounded-lg bg-red-100 p-4 text-center">
          <p className="text-red-700">{message.errorMsg}</p>
        </div>
      );
    }
    if (message.successMsg) {
      return (
        <div className="my-4 rounded-lg bg-green-100 p-4 text-center">
          <p className="text-green-700">{message.successMsg}</p>
        </div>
      );
    }
    return null;
  };

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
                    className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.SUCCESS.base} ${BUTTON_COLORS.SUCCESS.hover}`}
                    onClick={() => updatePicker(row)}
                  >
                    SAVE
                  </button>
                  <button
                    className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
                    onClick={handleEditCancel}
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.SUCCESS.base} ${BUTTON_COLORS.SUCCESS.hover}`}
                    onClick={() => {
                      setEditingPicker(row);
                      setEditValue(row);
                    }}
                  >
                    EDIT
                  </button>
                  <button
                    className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
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
            onClick={() => setMenuSelected(menu)}
            className={`mb-2 w-[100px] rounded-full border-2 px-3 py-2 transition-colors ${
              menuSelected === menu
                ? "border-[#1a365d] bg-white text-[#1a365d]"
                : "border-[#1a365d] bg-[#1a365d] text-white hover:bg-white hover:text-[#1a365d]"
            }`}
          >
            {menu}
          </button>
        ))}
      </div>

      {!inputOpen ? (
        <div className="mt-5 flex justify-center">
          <button
            className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.SUCCESS.base} ${BUTTON_COLORS.SUCCESS.hover}`}
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
              className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.SUCCESS.base} ${BUTTON_COLORS.SUCCESS.hover}`}
              onClick={insertPicker}
            >
              SAVE
            </button>
            <button
              className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
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
            <tr className="bg-[#1a365d] text-center text-white">
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a365d]/50"
          onClick={(e) => {
            // Only close if clicking the overlay (not the popup content)
            if (e.target === e.currentTarget) {
              closeDeletePopup();
            }
          }}
        >
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-center">Delete Picker</h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete &quot;{selectedPicker}&quot;?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
                onClick={deletePicker}
              >
                Delete
              </button>
              <button
                className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
                onClick={closeDeletePopup}
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

export default ModifyOptions;
