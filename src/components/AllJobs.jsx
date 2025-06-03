import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { debounce } from "lodash";
import { useSelector } from "react-redux";

import {
  ALL_DATA_URL,
  DELETE_JOB_URL,
  PICKERS_URL,
} from "../utils/globalConstants";
import { getDateRange } from "../utils/helperFunc";
import JobDetailPopUp from "./JobDetailPopUp";
import AllDataTable from "./AllDataTable";

const currentYear = new Date().getFullYear();

const dateFilters = [
  "This Financial Year",
  "Last Financial Year",
  "This Year",
  "Last Year",
  "This Month",
  "Last Month",
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
];

const AllJobs = () => {
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState({
    inDateFrom: format(new Date(currentYear, 3, 1), "dd/MM/yyyy"),
    inDateTo: format(new Date(currentYear + 1, 2, 31), "dd/MM/yyyy"),
    rangeSelected: "This Financial Year",
    status: "All",
  });
  const [statusPicker, setStatusPicker] = useState(["All"]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

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
    setSelectedJobID(jobID);
    setIsDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setSelectedJobID(null);
  };

  const handleDelete = async (JobID) => {
    setIsDeletePopupOpen(false);

    try {
      const response = await fetch(DELETE_JOB_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ JobID, position }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({ errorMsg: "", successMsg: `${result.message}` });
        fetchJobDetails();
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
      <div className="flex w-full justify-center">
        <div className="flex w-full flex-col items-center lg:w-2/3">
          <form
            className="w-full rounded-lg bg-[#1a365d] p-4 font-bold text-white"
            onSubmit={handleSubmit}
          >
            {/* From Date */}
            <div className="mb-4 flex w-full items-center">
              <label className="w-[100px] text-left text-xl font-bold text-white">
                From:
              </label>
              <DatePicker
                selected={parse(filters.inDateFrom, "dd/MM/yyyy", new Date())}
                onChange={handleDateChange("inDateFrom")}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                className="w-full flex-1 rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                placeholderText="Select From Date"
              />
            </div>

            {/* To Date */}
            <div className="mb-4 flex w-full items-center">
              <label className="w-[100px] text-left text-xl font-bold text-white">
                To:
              </label>
              <DatePicker
                selected={parse(filters.inDateTo, "dd/MM/yyyy", new Date())}
                onChange={handleDateChange("inDateTo")}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                className="w-full flex-1 rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                placeholderText="Select To Date"
              />
            </div>

            {/* Range */}
            <div className="mb-4 flex w-full items-center">
              <label className="w-[100px] text-left text-xl font-bold text-white">
                Range:
              </label>
              <select
                name="rangeSelected"
                value={filters.rangeSelected}
                onChange={(e) => handleRangeChange(e.target.value)}
                className="w-full flex-1 rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
              >
                {dateFilters.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="mb-4 flex w-full items-center">
              <label className="w-[100px] text-left text-xl font-bold text-white">
                Status:
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full flex-1 rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
              >
                {statusPicker.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Count */}
            <div className="mb-4 flex w-full items-center font-bold">
              <label className="w-[100px] text-left text-xl text-white">
                Jobs:
              </label>
              <p className="w-full flex-1 text-xl text-white">
                {allData.length}
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex items-center justify-center">
              <button className="rounded bg-amber-400 px-2 py-1 hover:bg-amber-500">
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
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <div>
              Do you want to delete user -{" "}
              <span className="font-bold">{selectedJobID}</span> ?
            </div>
            <div className="mt-4 flex justify-center space-x-10">
              <button
                className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                onClick={() => handleDelete(selectedJobID)}
              >
                Delete
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
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
