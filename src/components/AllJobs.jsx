import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { FETCH_ALL_JOBS_URL } from "../utils/globalConstants";

import {
  ALL_DATA_URL,
  DELETE_JOB_URL,
  PICKERS_URL,
  DATE_FILTERS,
  DEFAULT_STATUS,
  DEFAULT_DATE_FILTER,
  BUTTON_BASE_STYLE,
  BUTTON_SIZES,
  BUTTON_COLORS,
} from "../utils/globalConstants";
import { getDateRange } from "../utils/helperFunc";
import JobDetailPopUp from "./JobDetailPopUp";
import AllDataTable from "./AllDataTable";

const currentYear = new Date().getFullYear();

const AllJobs = () => {
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState({
    inDateFrom: format(new Date(currentYear, 3, 1), "dd/MM/yyyy"),
    inDateTo: format(new Date(currentYear + 1, 2, 31), "dd/MM/yyyy"),
    rangeSelected: DEFAULT_DATE_FILTER,
    status: DEFAULT_STATUS,
  });
  const [statusPicker, setStatusPicker] = useState([DEFAULT_STATUS]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
  const [jobToDelete, setJobToDelete] = useState(null);

  const { jwtToken, position } = useSelector((store) => store.loginSlice);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(
        `${ALL_DATA_URL}?inDateFrom=${filters.inDateFrom}&inDateTo=${filters.inDateTo}&status=${filters.status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok)
        throw new Error(`Failed to fetch job details: ${response.statusText}`);

      const data = await response.json();
      setAllData(data);
    } catch (error) {
      console.error("Error fetching job details:", error.message);
    }
  };

  // Debounce the fetchJobDetails function to prevent excessive calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchJobDetails = useCallback(debounce(fetchJobDetails, 300), [
    filters,
  ]);

  useEffect(() => {
    // Fetch current date data on component mount
    fetchJobDetails();
    getPickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  const getPickers = async () => {
    try {
      const response = await fetch(PICKERS_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setStatusPicker(["All", "Un Purchased", "Purchased", ...data.job_status]);
    } catch (error) {
      console.error("Error fetching job ID:", error);
    }
  };

  const handleDateChange = (type) => (date) => {
    setFilters((prev) => ({ ...prev, [type]: format(date, "dd/MM/yyyy") }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedFetchJobDetails();
  };

  const handleRangeChange = (range) => {
    const dateRange = getDateRange(range);

    setFilters((prev) => ({
      ...prev,
      inDateFrom: dateRange.inDateFrom,
      inDateTo: dateRange.inDateTo,
      rangeSelected: range,
    }));
  };

  const openPopup = (jobID) => {
    setSelectedJobID(jobID);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedJobID(null);
  };

  const openDeletePopup = (jobID) => {
    setJobToDelete(jobID);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setJobToDelete(null);
  };

  const handleDelete = async (jobID) => {
    try {
      const response = await fetch(DELETE_JOB_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ JobID: jobID, position }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setAllData((prevData) =>
          prevData.filter((item) => item.JOB_ID !== jobID),
        );
        setMessage({ errorMsg: "", successMsg: "Job deleted successfully" });
        closeDeletePopup();
        // Refresh data after successful deletion
        fetchJobDetails();
      } else {
        setMessage({
          errorMsg: data.message || "Failed to delete job",
          successMsg: "",
        });
        closeDeletePopup();
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      setMessage({
        errorMsg: "Error deleting job: " + error.message,
        successMsg: "",
      });
      closeDeletePopup();
    }
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      await handleDelete(jobToDelete);
    }
  };

  return (
    <div className="container mx-auto py-4">
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
            onSubmit={handleSubmit}
          >
            {/* From Date */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                From:
              </label>
              <DatePicker
                selected={parse(filters.inDateFrom, "dd/MM/yyyy", new Date())}
                onChange={handleDateChange("inDateFrom")}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                placeholderText="Select From Date"
              />
            </div>

            {/* To Date */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                To:
              </label>
              <DatePicker
                selected={parse(filters.inDateTo, "dd/MM/yyyy", new Date())}
                onChange={handleDateChange("inDateTo")}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                placeholderText="Select To Date"
              />
            </div>

            {/* Range */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                Range:
              </label>
              <select
                name="rangeSelected"
                value={filters.rangeSelected}
                onChange={(e) => handleRangeChange(e.target.value)}
                className="w-full flex-1 rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
              >
                {DATE_FILTERS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                Status:
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
              >
                {statusPicker.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Count */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-xl text-white">Jobs:</label>
              <p className="text-xl text-white">{allData.length}</p>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex items-center justify-center">
              <button className="flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a365d]">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <AllDataTable
        allData={allData}
        openPopup={openPopup}
        openDeletePopup={openDeletePopup}
      />

      {isPopupOpen && (
        <JobDetailPopUp
          selectedJobID={selectedJobID}
          closePopup={closePopup}
          isPopupOpen={isPopupOpen}
        />
      )}

      {isDeletePopupOpen && (
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
            <h2 className="mb-4 text-center text-xl font-bold">Delete Job</h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete this job?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.MEDIUM} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.MEDIUM} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
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

export default AllJobs;
