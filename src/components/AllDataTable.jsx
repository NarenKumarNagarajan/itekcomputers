import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  BUTTON_BASE_STYLE,
  BUTTON_COLORS,
  BUTTON_SIZES,
  TABLE_HEADERS,
  JOB_STATUS_COLORS,
  EDIT_JOB_URL,
  PICKERS_URL,
} from "../utils/globalConstants";
import JobDetailPopUp from "./JobDetailPopUp";

const AllDataTable = ({ allData, openPopup, openDeletePopup }) => {
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState(allData);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Status editing state
  const [editingStatus, setEditingStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);

  const navigate = useNavigate();

  const { position, jwtToken } = useSelector((store) => store.loginSlice);
  const { isSidebarOpen } = useSelector((store) => store.sidebarSlice);

  // Calculate pagination values
  const totalRows = filterData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filterData.slice(startIndex, endIndex);

  // Fetch status options
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch(PICKERS_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStatusOptions([
            "All",
            "Un Purchased",
            "Purchased",
            ...data.job_status,
          ]);
        }
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    };

    fetchStatusOptions();
  }, [jwtToken]);

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
    setCurrentPage(1); // Reset to first page when searching
  };

  const getStatusColor = (status) => {
    return JOB_STATUS_COLORS[status] || JOB_STATUS_COLORS.default;
  };

  // Status editing handlers
  const handleStatusEdit = (jobID, currentStatus) => {
    setEditingStatus(jobID);
  };

  const handleStatusChange = async (jobID, newStatus) => {
    // Remove automatic save - just update the local state for display
    setFilterData((prevData) =>
      prevData.map((item) =>
        item.JOB_ID === jobID ? { ...item, JOB_STATUS: newStatus } : item,
      ),
    );
  };

  const handleStatusSave = async (jobID) => {
    const currentItem = filterData.find((item) => item.JOB_ID === jobID);
    if (!currentItem) return;

    setUpdatingStatus(jobID);

    try {
      const response = await fetch(EDIT_JOB_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          JobID: jobID,
          JOB_STATUS: currentItem.JOB_STATUS,
        }),
      });

      if (response.ok) {
        setEditingStatus(null);
      } else {
        console.error("Failed to update status");
        alert("Failed to update job status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating job status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleStatusCancel = () => {
    // Revert changes by refetching original data
    setFilterData(allData);
    setEditingStatus(null);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    const filtered = allData.filter(
      (row) =>
        row.JOB_ID.toLowerCase().includes(search.toLowerCase()) ||
        row.NAME.toLowerCase().includes(search.toLowerCase()) ||
        row.MOBILE.includes(search),
    );
    setFilterData(filtered);
    setCurrentPage(1); // Reset to first page when data changes
  }, [search, allData]);

  return (
    <div className={`p-4 ${isSidebarOpen ? "" : "w-full"}`}>
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleFilterDataInput}
          className="w-full rounded-lg border-2 border-slate-400 p-2 focus:outline-0 lg:w-1/3"
        />
        <div className="flex items-center gap-2">
          <label
            htmlFor="rowsPerPage"
            className="text-sm font-medium text-gray-700"
          >
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="rounded-lg border-2 border-slate-400 p-2 focus:outline-0"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-white">
          <thead>
            <tr className="bg-[#1a365d] text-white">
              {TABLE_HEADERS.ALL_DATA_TABLE.map((header) => (
                <th
                  key={header}
                  className="border border-white px-2 py-1 text-center whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr
                  key={row.newID}
                  className={`border border-white ${getStatusColor(row.JOB_STATUS)}`}
                >
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.newID}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.JOB_ID}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.NAME}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.MOBILE}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.IN_DATE}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.OUT_DATE}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.ASSETS}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {editingStatus === row.JOB_ID ? (
                      <div className="flex items-center gap-1">
                        <select
                          defaultValue={row.JOB_STATUS}
                          onChange={(e) =>
                            handleStatusChange(row.JOB_ID, e.target.value)
                          }
                          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          disabled={updatingStatus === row.JOB_ID}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        {updatingStatus === row.JOB_ID ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStatusSave(row.JOB_ID)}
                              className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                              title="Save changes"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleStatusCancel}
                              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                              title="Cancel changes"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer rounded px-1 py-1 transition-colors hover:bg-gray-100"
                        onClick={() =>
                          handleStatusEdit(row.JOB_ID, row.JOB_STATUS)
                        }
                        title="Click to edit status"
                      >
                        {row.JOB_STATUS}
                      </div>
                    )}
                  </td>
                  <td className="border border-white px-2 py-1">
                    {row.SOLUTION_PROVIDED && row.SOLUTION_PROVIDED.length > 5
                      ? `${row.SOLUTION_PROVIDED.substring(0, 5)}...`
                      : row.SOLUTION_PROVIDED}
                  </td>
                  <td className="border border-white px-2 py-1 whitespace-nowrap">
                    {row.AMOUNT}
                  </td>
                  <td className="border border-white px-2 py-1 text-center whitespace-nowrap">
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, totalRows)} of{" "}
            {totalRows} entries
          </div>

          <div className="flex items-center gap-2">
            {/* Previous Page Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`${BUTTON_BASE_STYLE} ${
                currentPage === 1
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : `${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`
              } h-8 w-8 px-1 py-1`}
            >
              &lt;
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`${BUTTON_BASE_STYLE} ${
                    page === "..."
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : page === currentPage
                        ? "!border-[#1a365d] bg-white !text-[#1a365d]"
                        : `${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`
                  } h-8 w-8 px-1 py-1`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Page Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`${BUTTON_BASE_STYLE} ${
                currentPage === totalPages
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : `${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`
              } h-8 w-8 px-1 py-1`}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

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
