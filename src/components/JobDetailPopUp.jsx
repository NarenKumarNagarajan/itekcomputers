import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { DATA_BY_JOB_ID_URL } from "../utils/globalConstants";

const JobDetailPopUp = ({ selectedJobID, closePopup, isPopupOpen }) => {
  const [dataByJobID, setDataByJobID] = useState([]);

  const navigate = useNavigate();

  const { jwtToken } = useSelector((store) => store.loginSlice);

  const handlePrint = () => {
    navigate(`/printPage?jobID=${selectedJobID}`);
  };

  const fetchDataByJobID = async (jobID) => {
    try {
      const response = await fetch(`${DATA_BY_JOB_ID_URL}?jobID=${jobID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`Failed to fetch job details: ${response.statusText}`);

      const data = await response.json();
      setDataByJobID(data[0]);
    } catch (error) {
      console.error("Error fetching job details:", error.message);
    }
  };

  useEffect(() => {
    // Fetch data by jobID when popup opens
    if (isPopupOpen && selectedJobID) {
      fetchDataByJobID(selectedJobID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupOpen, selectedJobID]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="h-[90vh] w-[80%] overflow-auto rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Job Details</h2>

        {/* Flex container to hold two tables side by side */}
        <div className="flex w-full">
          {/* Left table */}
          <table className="mr-1 w-[50%] border-collapse border border-gray-400">
            <tbody>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  JOB ID
                </td>
                <td className="border p-2">{selectedJobID}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  NAME
                </td>
                <td className="border p-2">{dataByJobID.NAME}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  MOBILE
                </td>
                <td className="border p-2">{dataByJobID.MOBILE}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  EMAIL
                </td>
                <td className="border p-2">{dataByJobID.EMAIL}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  ADDRESS
                </td>
                <td className="border p-2">{dataByJobID.ADDRESS}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  ENGINEER
                </td>
                <td className="border p-2">{dataByJobID.ENGINEER}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  MOC
                </td>
                <td className="border p-2">{dataByJobID.MOC}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  IN DATE
                </td>
                <td className="border p-2">{dataByJobID.IN_DATE}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  OUT DATE
                </td>
                <td className="border p-2">{dataByJobID.OUT_DATE}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  ASSETS
                </td>
                <td className="border p-2">{dataByJobID.ASSETS}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  CREATED BY
                </td>
                <td className="border p-2">{dataByJobID.CREATED}</td>
              </tr>
            </tbody>
          </table>

          {/* Right table */}
          <table className="w-[50%] border-collapse border border-gray-400">
            <tbody>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  PRODUCT MAKE
                </td>
                <td className="border p-2">{dataByJobID.PRODUCT_MAKE}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  DESCRIPTION
                </td>
                <td className="border p-2">{dataByJobID.DESCRIPTION}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  SERIAL NO
                </td>
                <td className="border p-2">{dataByJobID.SERIAL_NO}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  FAULT TYPE
                </td>
                <td className="border p-2">{dataByJobID.FAULT_TYPE}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  FAULT DESC
                </td>
                <td className="border p-2">{dataByJobID.FAULT_DESC}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  JOB STATUS
                </td>
                <td className="border p-2">{dataByJobID.JOB_STATUS}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  AMOUNT
                </td>
                <td className="border p-2">{dataByJobID.AMOUNT}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  SOLUTION PROVIDED
                </td>
                <td className="border p-2">{dataByJobID.SOLUTION_PROVIDED}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  EXPENSE
                </td>
                <td className="border p-2">{dataByJobID.PURCHASE_AMOUNT}</td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  PROFIT
                </td>
                <td className="border p-2">
                  {typeof dataByJobID.AMOUNT === "number" &&
                  typeof dataByJobID.PURCHASE_AMOUNT === "number"
                    ? dataByJobID.AMOUNT - dataByJobID.PURCHASE_AMOUNT
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border bg-red-600 p-2 font-bold text-white">
                  LAST MODIFIED BY
                </td>
                <td className="border p-2">{dataByJobID.LAST_MODIFIED}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center space-x-10">
          <button
            className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
            onClick={handlePrint}
          >
            Print
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
  );
};

JobDetailPopUp.propTypes = {
  selectedJobID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired, // Modify based on the actual type
  closePopup: PropTypes.func.isRequired, // function for closing popup
  isPopupOpen: PropTypes.bool.isRequired,
};

export default JobDetailPopUp;
