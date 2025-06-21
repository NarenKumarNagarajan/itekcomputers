import { useEffect, useState } from "react";
import { format, addDays, parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "../hooks/useForm";
import { useFormValidation } from "../hooks/useFormValidation";
import { useApi } from "../hooks/useApi";
import {
  FETCH_JOB_ID_URL,
  INSERT_URL,
  PICKERS_URL,
  BUTTON_BASE_STYLE,
  BUTTON_COLORS,
} from "../utils/globalConstants";

const initialFormState = {
  jobID: "",
  customerName: "",
  mobileNo: "",
  email: "",
  address: "",
  engineer: "",
  moc: "",
  inDate: format(new Date(), "dd/MM/yyyy"),
  outDate: format(addDays(new Date(), 2), "dd/MM/yyyy"),
  assets: "",
  productMake: "",
  serialNo: "",
  description: "",
  faultType: "",
  faultDesc: "",
  jobStatus: "",
  solutionProvided: "",
  amount: "",
  engineerPicker: [],
  mocPicker: [],
  assetsPicker: [],
  productPicker: [],
  faultPicker: [],
  jobStatusPicker: [],
};

const SectionHeader = ({ title }) => (
  <h1 className="w-full border-2 border-[#1a365d] bg-[#1a365d] p-2 text-white">
    {title}
  </h1>
);

const CustomerDetails = ({ formData, errors, handleChange }) => (
  <div className="w-full rounded-lg border-2 border-[#1a365d] p-4 lg:w-1/2">
    <SectionHeader title="Customer Details" />
    <div className="mt-4 space-y-4">
      {/* Job ID */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Job ID</label>
        <div className="w-2/3">
          <input
            type="text"
            name="jobID"
            value={formData.jobID}
            onChange={handleChange}
            placeholder="Job ID"
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.jobID ? "border-red-500" : ""}`}
          />
          {errors.jobID && <p className="mt-1 text-red-500">{errors.jobID}</p>}
        </div>
      </div>
      {/* Customer Name */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Customer Name</label>
        <div className="w-2/3">
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter customer name"
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.customerName ? "border-red-500" : ""}`}
          />
          {errors.customerName && (
            <p className="mt-1 text-red-500">{errors.customerName}</p>
          )}
        </div>
      </div>
      {/* Mobile Number */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Mobile Number</label>
        <div className="w-2/3">
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.mobileNo ? "border-red-500" : ""}`}
          />
          {errors.mobileNo && (
            <p className="mt-1 text-red-500">{errors.mobileNo}</p>
          )}
        </div>
      </div>
      {/* Email Address */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Email Address</label>
        <div className="w-2/3">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="mt-1 text-red-500">{errors.email}</p>}
        </div>
      </div>
      {/* Address */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Address</label>
        <div className="w-2/3">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            maxLength={500}
            className={`h-20 w-full resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && (
            <p className="mt-1 text-red-500">{errors.address}</p>
          )}
        </div>
      </div>
      {/* Assigned Engineer */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Assigned Engineer</label>
        <div className="w-2/3">
          <select
            name="engineer"
            value={formData.engineer}
            onChange={handleChange}
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.engineer ? "border-red-500" : ""}`}
          >
            {formData.engineerPicker.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.engineer && (
            <p className="mt-1 text-red-500">{errors.engineer}</p>
          )}
        </div>
      </div>
      {/* Mode of Contact */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Mode of Contact</label>
        <div className="w-2/3">
          <select
            name="moc"
            value={formData.moc}
            onChange={handleChange}
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.moc ? "border-red-500" : ""}`}
          >
            {formData.mocPicker.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.moc && <p className="mt-1 text-red-500">{errors.moc}</p>}
        </div>
      </div>
      {/* In Date */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">In Date</label>
        <div className="w-2/3">
          <DatePicker
            selected={parse(formData.inDate, "dd/MM/yyyy", new Date())}
            onChange={(date) =>
              handleChange({
                target: { name: "inDate", value: format(date, "dd/MM/yyyy") },
              })
            }
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
            placeholderText="Select in date"
          />
          {errors.inDate && (
            <p className="mt-1 text-red-500">{errors.inDate}</p>
          )}
        </div>
      </div>
      {/* Out Date */}
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Out Date</label>
        <div className="w-2/3">
          <DatePicker
            selected={parse(formData.outDate, "dd/MM/yyyy", new Date())}
            onChange={(date) =>
              handleChange({
                target: { name: "outDate", value: format(date, "dd/MM/yyyy") },
              })
            }
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
            placeholderText="Select out date"
          />
          {errors.outDate && (
            <p className="mt-1 text-red-500">{errors.outDate}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ProductDetails = ({ formData, errors, handleChange }) => (
  <div className="w-full rounded-lg border-2 border-[#1a365d] p-4 lg:w-1/2">
    <SectionHeader title="Product Details" />
    <div className="mt-4 space-y-4">
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Asset Type</label>
        <div className="w-2/3">
          <select
            name="assets"
            value={formData.assets}
            onChange={handleChange}
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.assets ? "border-red-500" : ""}`}
          >
            {formData.assetsPicker.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.assets && (
            <p className="mt-1 text-red-500">{errors.assets}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Product Make</label>
        <div className="w-2/3">
          <select
            name="productMake"
            value={formData.productMake}
            onChange={handleChange}
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.productMake ? "border-red-500" : ""}`}
          >
            {formData.productPicker.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.productMake && (
            <p className="mt-1 text-red-500">{errors.productMake}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Serial Number</label>
        <div className="w-2/3">
          <input
            type="text"
            name="serialNo"
            value={formData.serialNo}
            onChange={handleChange}
            placeholder="Enter serial number"
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.serialNo ? "border-red-500" : ""}`}
          />
          {errors.serialNo && (
            <p className="mt-1 text-red-500">{errors.serialNo}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Description</label>
        <div className="w-2/3">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            maxLength={500}
            className={`h-20 w-full resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="mt-1 text-red-500">{errors.description}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Fault Type</label>
        <div className="w-2/3">
          <select
            name="faultType"
            value={formData.faultType}
            onChange={handleChange}
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.faultType ? "border-red-500" : ""}`}
          >
            {formData.faultPicker.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.faultType && (
            <p className="mt-1 text-red-500">{errors.faultType}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Fault Description</label>
        <div className="w-2/3">
          <textarea
            name="faultDesc"
            value={formData.faultDesc}
            onChange={handleChange}
            placeholder="Enter fault description"
            maxLength={1500}
            className={`h-20 w-full resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.faultDesc ? "border-red-500" : ""}`}
          />
          {errors.faultDesc && (
            <p className="mt-1 text-red-500">{errors.faultDesc}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Job Status</label>
        <div className="w-2/3">
          <select
            name="jobStatus"
            value={formData.jobStatus}
            onChange={handleChange}
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.jobStatus ? "border-red-500" : ""}`}
          >
            {formData.jobStatusPicker.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.jobStatus && (
            <p className="mt-1 text-red-500">{errors.jobStatus}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Solution Provided</label>
        <div className="w-2/3">
          <textarea
            name="solutionProvided"
            value={formData.solutionProvided}
            onChange={handleChange}
            placeholder="Enter solution provided"
            maxLength={1500}
            className={`h-20 w-full resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.solutionProvided ? "border-red-500" : ""}`}
          />
          {errors.solutionProvided && (
            <p className="mt-1 text-red-500">{errors.solutionProvided}</p>
          )}
        </div>
      </div>
      <div className="my-3 flex w-full items-center">
        <label className="mr-2 w-1/3 text-[#1a365d]">Amount</label>
        <div className="w-2/3">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${errors.amount ? "border-red-500" : ""}`}
          />
          {errors.amount && (
            <p className="mt-1 text-red-500">{errors.amount}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const JobSheet = () => {
  const navigate = useNavigate();
  const { jwtToken, name } = useSelector((store) => store.loginSlice);

  const { formData, errors, handleChange, setErrors, resetForm, setFormData } =
    useForm(initialFormState);

  const { loading, error: apiError, fetchData, postData } = useApi();
  const { validateJobSheet } = useFormValidation();
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchInitialData();
  }, [jwtToken, fetchData, setFormData, setErrors]);

  const fetchInitialData = async () => {
    try {
      const [jobIdData, pickersData] = await Promise.all([
        fetchData(FETCH_JOB_ID_URL, jwtToken),
        fetchData(PICKERS_URL, jwtToken),
      ]);

      if (!jobIdData || !pickersData) {
        throw new Error("Failed to fetch initial data");
      }

      const currentYear = format(new Date(), "yy");
      const currentMonth = format(new Date(), "MM");
      const lastJobNumber =
        jobIdData.JOB_ID?.length > 0
          ? parseInt(jobIdData.JOB_ID.slice(-3), 10)
          : 0;
      const newJobNumber = (lastJobNumber + 1).toString().padStart(3, "0");
      const newJobID = `iTek${currentYear}${currentMonth}${newJobNumber}`;

      // First set the picker arrays
      setFormData((prev) => ({
        ...prev,
        engineerPicker: pickersData.engineers || [],
        mocPicker: pickersData.moc || [],
        assetsPicker: pickersData.assets_type || [],
        productPicker: pickersData.products || [],
        faultPicker: pickersData.faults || [],
        jobStatusPicker: pickersData.job_status || [],
      }));

      // Then set the initial values
      setFormData((prev) => ({
        ...prev,
        jobID: newJobID,
        engineer: pickersData.engineers?.[0] || "",
        moc: pickersData.moc?.[0] || "",
        assets: pickersData.assets_type?.[0] || "",
        productMake: pickersData.products?.[0] || "",
        faultType: pickersData.faults?.[0] || "",
        jobStatus: pickersData.job_status?.[0] || "",
      }));
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setErrors({ fetch: "Failed to load initial data" });
    }
  };

  const handleSubmit = async (e, actionType) => {
    e.preventDefault(); // Prevent default form submission

    const validationErrors = validateJobSheet(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Prepare the data in the format expected by the server
      const jobData = {
        jobID: formData.jobID,
        customerName: formData.customerName,
        mobileNo: formData.mobileNo,
        email: formData.email || "",
        address: formData.address || "",
        engineer: formData.engineer,
        moc: formData.moc,
        inDate: formData.inDate,
        outDate: formData.outDate,
        assets: formData.assets,
        productMake: formData.productMake,
        serialNo: formData.serialNo,
        description: formData.description || "",
        faultType: formData.faultType,
        faultDesc: formData.faultDesc || "",
        jobStatus: formData.jobStatus,
        solutionProvided: formData.solutionProvided || "",
        amount: formData.amount || "0",
        name: name,
      };

      const response = await postData(INSERT_URL, jobData, jwtToken);

      if (response.message) {
        setMessage({ type: "success", text: response.message });
        setTimeout(() => {
          if (actionType === "saveAndPdf") {
            navigate(`/printPage?jobID=${formData.jobID}`);
          }
          resetForm();
          // Fetch updated data after successful insertion
          fetchInitialData();
          setMessage({ type: "", text: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to submit job",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {message.text && (
        <div
          className={`mb-4 rounded p-4 text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {apiError && (
        <div className="mb-4 rounded bg-red-100 p-4 text-center text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, "save")} className="space-y-4">
        <div className="flex flex-col gap-0 lg:flex-row">
          <CustomerDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
          <ProductDetails
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            type="submit"
            className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
            onClick={(e) => handleSubmit(e, "saveAndPdf")}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Print"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobSheet;
