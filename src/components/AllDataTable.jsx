import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  BUTTON_BASE_STYLE,
  BUTTON_COLORS,
  BUTTON_SIZES,
  TABLE_HEADERS,
} from "../utils/globalConstants";
import JobDetailPopUp from "./JobDetailPopUp";

const AllDataTable = ({ allData, openPopup, openDeletePopup }) => {
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState(allData);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();

  const { position, jwtToken } = useSelector((store) => store.loginSlice);

  const handleView = (jobID) => {
    setSelectedJobID(jobID);
    openPopup(jobID);
  };

  const handleEdit = (jobID) => {
    navigate(`/editJob?jobID=${jobID}`);
  };

  const handleDelete = (jobID) => {
    openDeletePopup(jobID);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedJobID(null);
  };

  const handleFilterDataInput = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const filtered = allData.filter(
      (row) =>
        row.JOB_ID.toLowerCase().includes(search.toLowerCase()) ||
        row.NAME.toLowerCase().includes(search.toLowerCase()) ||
        row.MOBILE.includes(search),
    );
    setFilterData(filtered);
  }, [search, allData]);

  return (
    <div className="mt-3 overflow-x-auto">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleFilterDataInput}
        className="mb-2 w-full rounded-lg border-2 border-slate-400 p-2 focus:outline-0 lg:w-1/3"
      />
      <table className="w-full border-collapse overflow-auto border-2 border-[#ddd]">
        <thead>
          <tr className="bg-[#1a365d] text-white">
            {TABLE_HEADERS.ALL_DATA_TABLE.map((header) => (
              <th
                key={header}
                className="border border-gray-300 px-2 py-1 text-center whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterData.length > 0 ? (
            filterData.map((row, index) => (
              <tr
                key={row.newID}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.newID}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.JOB_ID}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.NAME}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.MOBILE}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.IN_DATE}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.OUT_DATE}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.ASSETS}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.JOB_STATUS}
                </td>
                <td className="flex-wrap border border-gray-300 px-2 py-1">
                  {row.SOLUTION_PROVIDED}
                </td>
                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">
                  {row.AMOUNT}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center whitespace-nowrap">
                  <div className="flex justify-center gap-4">
                    <button
                      className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.SMALL} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
                      onClick={() => handleView(row.JOB_ID)}
                    >
                      View
                    </button>
                    <button
                      className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.SMALL} ${BUTTON_COLORS.SUCCESS.base} ${BUTTON_COLORS.SUCCESS.hover}`}
                      onClick={() => handleEdit(row.JOB_ID)}
                    >
                      Edit
                    </button>
                    {position === "ADMIN" && (
                      <button
                        className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.SMALL} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
                        onClick={() => handleDelete(row.JOB_ID)}
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
              <td
                colSpan={TABLE_HEADERS.ALL_DATA_TABLE.length}
                className="p-4 text-center"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isPopupOpen && (
        <JobDetailPopUp
          selectedJobID={selectedJobID}
          closePopup={closePopup}
          isPopupOpen={isPopupOpen}
        />
      )}
    </div>
  );
};

AllDataTable.propTypes = {
  allData: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.number,
      JOB_ID: PropTypes.string,
      NAME: PropTypes.string,
      MOBILE: PropTypes.string,
      IN_DATE: PropTypes.string,
      OUT_DATE: PropTypes.string,
      ASSETS: PropTypes.string,
      JOB_STATUS: PropTypes.string,
      AMOUNT: PropTypes.number,
      PURCHASE_AMOUNT: PropTypes.number,
    }),
  ).isRequired,
  openPopup: PropTypes.func.isRequired,
  openDeletePopup: PropTypes.func.isRequired,
};

export default AllDataTable;
