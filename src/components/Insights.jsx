import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import {
  parse,
  isValid,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import { useApi } from "../hooks/useApi";
import { INSIGHTS_URL, DATE_FILTERS } from "../utils/globalConstants";
import { getDateRange } from "../utils/helperFunc";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const Insights = () => {
  const navigate = useNavigate();
  const { jwtToken, position } = useSelector((store) => store.loginSlice);
  const { execute, loading } = useApi();
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
  const [filters, setFilters] = useState({
    inDateFrom: "",
    inDateTo: "",
    rangeSelected: "This Financial Year",
    tPassword: "",
  });
  const [visibility, setVisibility] = useState({
    tPassword: false,
  });

  const handleDateChange = (field) => (date) => {
    setFilters((prev) => ({
      ...prev,
      [field]: date ? format(date, "dd/MM/yyyy") : "",
    }));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVisibilityToggle = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ errorMsg: "", successMsg: "" });

    try {
      const response = await execute(() =>
        fetch(INSIGHTS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ ...filters, position }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch insights");
          }
          return data;
        }),
      );

      if (response.message === "Success") {
        setMessage({ errorMsg: "", successMsg: response.message });
      } else {
        setMessage({
          errorMsg: response.message || "Failed to fetch insights",
          successMsg: "",
        });
      }
    } catch (error) {
      setMessage({
        errorMsg: error.message || "Failed to fetch insights",
        successMsg: "",
      });
    }
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return isValid(parsedDate) ? parsedDate : null;
  };

  // Set initial dates when component mounts
  useEffect(() => {
    handleRangeChange(filters.rangeSelected);
  }, []);

  return (
    <div className="flex-1 overflow-auto p-4">
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
                selected={parseDate(filters.inDateFrom)}
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
                selected={parseDate(filters.inDateTo)}
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
                className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
              >
                {DATE_FILTERS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Password */}
            <div className="mb-4 grid w-full grid-cols-[120px_1fr] items-center gap-2">
              <label className="text-left text-xl font-bold text-white">
                T. Password
              </label>
              <div className="relative w-full">
                <input
                  type={visibility.tPassword ? "text" : "password"}
                  name="tPassword"
                  value={filters.tPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-2 border-white bg-white px-2 py-1 text-black focus:border-white focus:outline-none"
                  placeholder="Transaction Password"
                />
                <span
                  className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-black"
                  onClick={() => handleVisibilityToggle("tPassword")}
                >
                  {visibility.tPassword ? (
                    <BiSolidHide size={24} color="#1a365d" />
                  ) : (
                    <BiSolidShow size={24} color="#1a365d" />
                  )}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a365d] disabled:opacity-50"
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Insights;
