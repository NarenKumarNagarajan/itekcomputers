import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getDateRange } from "../utils/helperFunc";
import { INSIGHT_URL } from "../utils/globalConstants";

const currentYear = new Date().getFullYear();

const Insights = () => {
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState({
    inDateFrom: format(new Date(currentYear, 3, 1), "dd/MM/yyyy"),
    inDateTo: format(new Date(currentYear + 1, 2, 31), "dd/MM/yyyy"),
    rangeSelected: "This Financial Year",
    filter: "MOC",
  });

  const { jwtToken } = useSelector((store) => store.loginSlice);

  const fetchInsightDetails = async () => {
    try {
      const response = await fetch(
        `${INSIGHT_URL}?inDateFrom=${filters.inDateFrom}&inDateTo=${filters.inDateTo}&filter=${filters.filter}`,
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

  useEffect(() => {
    fetchInsightDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchInsightDetails();
  };

  const handleDateChange = (type) => (date) => {
    setFilters((prev) => ({ ...prev, [type]: format(date, "dd/MM/yyyy") }));
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

  const totalJobs = allData.reduce((acc, item) => acc + item.COUNT, 0);

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex items-start justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-xl bg-sky-700 p-4 font-bold text-white lg:w-1/2"
        >
          <div className="mb-4 flex w-full items-center">
            <label className="w-[100px] text-xl">From:</label>
            <DatePicker
              selected={parse(filters.inDateFrom, "dd/MM/yyyy", new Date())}
              onChange={handleDateChange("inDateFrom")}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              className="flex-1 rounded-md border border-slate-800 px-2 py-1 text-black"
              placeholderText="Select From Date"
            />
          </div>

          <div className="mb-4 flex w-full items-center">
            <label className="w-[100px] text-xl">To:</label>
            <DatePicker
              selected={parse(filters.inDateTo, "dd/MM/yyyy", new Date())}
              onChange={handleDateChange("inDateTo")}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              className="rounded-md border border-slate-800 px-2 py-1 text-black"
              placeholderText="Select To Date"
            />
          </div>

          <div className="mb-4 flex w-full items-center">
            <label className="w-[100px] text-xl">Range:</label>
            <select
              name="rangeSelected"
              value={filters.rangeSelected}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="rounded-md border border-slate-800 px-2 py-1 text-black focus:border-slate-800 focus:ring-0"
            >
              {[
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
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex w-full items-center">
            <label className="w-[100px] text-xl">Filter:</label>
            <select
              name="status"
              value={filters.filter}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, filter: e.target.value }))
              }
              className="rounded-md border border-slate-800 px-2 py-1 text-black focus:border-slate-800 focus:ring-0"
            >
              {["MOC"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <button className="rounded bg-amber-400 px-2 py-1 hover:bg-amber-500">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 flex items-start justify-center">
        <div className="w-full rounded-xl bg-slate-700 p-4 font-bold text-white lg:w-1/2">
          <h1 className="mb-2 flex w-full items-center">
            <span className="w-[150px] text-xl">TOTAL JOBS: </span>
            {totalJobs}
          </h1>
          {allData.map((mode) => (
            <h1 key={mode.MODE} className="mb-2 flex w-full items-center">
              <span className="w-[150px] text-xl">{mode.MODE}: </span>
              {mode.COUNT}
            </h1>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
