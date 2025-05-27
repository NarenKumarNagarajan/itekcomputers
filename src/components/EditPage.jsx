import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addDays, format, parse } from "date-fns";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DATA_BY_JOB_ID_URL,
  EDIT_JOB_URL,
  PICKERS_URL,
} from "../utils/globalConstants";

const EditPage = () => {
  const [formData, setFormData] = useState({
    oldJobID: "",
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
    purchaseAmount: "",
    purchasedStatus: "",
    engineerPicker: [],
    mocPicker: [],
    assetsPicker: [],
    productPicker: [],
    faultPicker: [],
    jobStatusPicker: [],
    purchasedStatusPicker: [],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const editJobID = new URLSearchParams(location.search).get("jobID");
  const { name, jwtToken } = useSelector((store) => store.loginSlice);

  useEffect(() => {
    if (editJobID) {
      setFormData((prev) => ({ ...prev, jobID: editJobID }));
      getJobDetails(editJobID);
      getPickers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editJobID]);

  const getJobDetails = async (jobID) => {
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

      const [inDay, inMonth, inYear] = data[0].IN_DATE.split("-").map(Number);
      const inDate = new Date(inYear, inMonth - 1, inDay);

      const [outDay, outMonth, outYear] =
        data[0].OUT_DATE.split("-").map(Number);
      const outDate = new Date(outYear, outMonth - 1, outDay);

      setFormData({
        oldJobID: data[0].JOB_ID,
        jobID: data[0].JOB_ID,
        customerName: data[0].NAME,
        mobileNo: data[0].MOBILE,
        email: data[0].EMAIL,
        address: data[0].ADDRESS,
        engineer: data[0].ENGINEER,
        moc: data[0].MOC,
        assets: data[0].ASSETS,
        productMake: data[0].PRODUCT_MAKE,
        description: data[0].DESCRIPTION,
        serialNo: data[0].SERIAL_NO,
        faultType: data[0].FAULT_TYPE,
        faultDesc: data[0].FAULT_DESC,
        jobStatus: data[0].JOB_STATUS,
        amount: data[0].AMOUNT,
        solutionProvided: data[0].SOLUTION_PROVIDED,
        purchaseAmount: data[0].PURCHASE_AMOUNT,
        purchasedStatus: data[0].PURCHASED,
        inDate: format(inDate, "dd/MM/yyyy"),
        outDate: format(outDate, "dd/MM/yyyy"),
      });
    } catch (error) {
      console.error("Error fetching job details:", error.message);
    }
  };

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

      setFormData((prevData) => ({
        ...prevData,
        engineerPicker: data.engineers,
        mocPicker: data.moc,
        assetsPicker: data.assets_type,
        productPicker: data.products,
        faultPicker: data.faults,
        jobStatusPicker: data.job_status,
        purchasedStatusPicker: ["YES", "NO"],
      }));
    } catch (error) {
      console.error("Error fetching job ID:", error);
    }
  };

  const handleDateChange = useCallback((date, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: format(date, "dd/MM/yyyy"),
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onFormSubmit = async (actionType) => {
    setErrorMsg("");
    setSuccessMsg("");
    let timeoutId;

    try {
      const sendData = {
        ...formData,
        name,
      };
      const response = await fetch(EDIT_JOB_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(data.message);

        timeoutId = setTimeout(() => {
          if (actionType === "saveAndPdf") {
            navigate(`/printPage?jobID=${formData.jobID}`);
          } else if (actionType !== "saveAndPdf") {
            navigate(`/allJobs`);
          }
        }, 2000); // 2 seconds
      } else {
        setErrorMsg(data.error);
      }
    } catch (error) {
      setErrorMsg(`Error submitting data: ${error.message}`);
    }

    // Clear any previous timeout when the component unmounts or a new submission occurs
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      {errorMsg && (
        <p className="mb-1 text-lg font-bold text-red-600">{errorMsg}</p>
      )}
      {successMsg && (
        <p className="mb-1 text-lg font-bold text-green-600">{successMsg}</p>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <SectionHeader title="CUSTOMER DETAILS" />
            <InputField
              labelName="Job ID"
              name="jobID"
              value={formData.jobID}
              handleChange={handleChange}
              placeholder="Job ID"
            />
            <InputField
              labelName="Customer Name"
              name="customerName"
              value={formData.customerName}
              handleChange={handleChange}
              placeholder="Customer Name"
            />
            <InputField
              labelName="Mobile Number"
              name="mobileNo"
              value={formData.mobileNo}
              handleChange={handleChange}
              placeholder="Customer Mobile No"
            />
            <InputField
              labelName="Email Address"
              name="email"
              value={formData.email}
              handleChange={handleChange}
              placeholder="Customer Email"
            />
            <TextareaField
              labelName="Customer Address"
              name="address"
              value={formData.address}
              handleChange={handleChange}
              placeholder="Customer Address"
              maxLength={500}
            />
            <SelectField
              labelName="Assigned Engineer"
              name="engineer"
              value={formData.engineer}
              handleChange={handleChange}
              options={formData.engineerPicker}
            />
            <SelectField
              labelName="Mode of Customers"
              name="moc"
              value={formData.moc}
              handleChange={handleChange}
              options={formData.mocPicker}
            />

            <div className="my-3 flex w-full items-center">
              <label className="mr-2 w-4/12 text-xl font-bold">In Date</label>
              <DatePicker
                selected={parse(formData.inDate, "dd/MM/yyyy", new Date())}
                onChange={(date) => handleDateChange(date, "inDate")}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                className="flex-1 rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                placeholderText="Select In Date"
              />
            </div>

            <div className="my-3 flex w-full items-center">
              <label className="mr-2 w-4/12 text-xl font-bold">Out Date</label>
              <DatePicker
                selected={parse(formData.outDate, "dd/MM/yyyy", new Date())}
                onChange={(date) => handleDateChange(date, "outDate")}
                dateFormat="dd/MM/yyyy"
                showYearDropdown
                className="flex-1 rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                placeholderText="Select Out Date"
              />
            </div>

            <TextareaField
              labelName="Provided Solution"
              name="solutionProvided"
              value={formData.solutionProvided}
              handleChange={handleChange}
              placeholder="Provided Solution"
              maxLength={1500}
            />
          </div>
          <div className="w-full lg:ml-2 lg:w-1/2">
            <SectionHeader title="PRODUCT DETAILS" />
            <SelectField
              labelName="Asset Type"
              name="assets"
              value={formData.assets}
              handleChange={handleChange}
              options={formData.assetsPicker}
            />
            <SelectField
              labelName="Product Type"
              name="productMake"
              value={formData.productMake}
              handleChange={handleChange}
              options={formData.productPicker}
            />
            <InputField
              labelName="Serial No"
              name="serialNo"
              value={formData.serialNo}
              handleChange={handleChange}
              placeholder="Serial No"
            />
            <TextareaField
              labelName="Description"
              name="description"
              value={formData.description}
              handleChange={handleChange}
              placeholder="Description"
              maxLength={500}
            />
            <SelectField
              labelName="Fault Type"
              name="faultType"
              value={formData.faultType}
              handleChange={handleChange}
              options={formData.faultPicker}
            />
            <TextareaField
              labelName="Fault Description"
              name="faultDesc"
              value={formData.faultDesc}
              handleChange={handleChange}
              placeholder="Fault Description"
              maxLength={1500}
            />
            <SelectField
              labelName="Job Status"
              name="jobStatus"
              value={formData.jobStatus}
              handleChange={handleChange}
              options={formData.jobStatusPicker}
            />

            <InputField
              labelName="Amount"
              name="amount"
              value={formData.amount.toString()}
              handleChange={handleChange}
              placeholder="Enter Amount"
            />
            <InputField
              labelName="Expense"
              name="purchaseAmount"
              value={formData.purchaseAmount.toString()}
              handleChange={handleChange}
              placeholder="Enter Purchase Amount"
            />

            <SelectField
              labelName="Expense Status"
              name="purchasedStatus"
              value={formData.purchasedStatus}
              handleChange={handleChange}
              options={formData.purchasedStatusPicker}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mr-8 w-[150px] rounded-lg bg-black py-2 font-bold text-white"
            onClick={() => onFormSubmit("save")}
          >
            Save
          </button>

          <button
            type="submit"
            className="w-[150px] rounded-lg bg-red-600 py-2 font-bold text-white"
            onClick={() => onFormSubmit("saveAndPdf")}
          >
            Save & Print
          </button>
        </div>
      </form>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <h1 className="w-full bg-black p-2 text-xl font-bold text-white">{title}</h1>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

const InputField = ({ labelName, name, value, handleChange, placeholder }) => (
  <div className="my-3 flex w-full items-center">
    <label className="mr-2 w-4/12 text-xl font-bold">{labelName}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      className="flex-1 rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
      placeholder={placeholder}
    />
  </div>
);

InputField.propTypes = {
  labelName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

const TextareaField = ({
  labelName,
  name,
  value,
  handleChange,
  placeholder,
  maxLength,
}) => (
  <div className="my-3 flex w-full items-center">
    <label className="mr-2 w-4/12 text-xl font-bold">{labelName}</label>
    <textarea
      name={name}
      value={value}
      onChange={handleChange}
      className="h-20 flex-1 resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
      placeholder={placeholder}
      maxLength={maxLength}
    />
  </div>
);

TextareaField.propTypes = {
  labelName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

const SelectField = ({
  labelName,
  name,
  value,
  handleChange,
  options = [], // Default to an empty array if `options` is not provided
}) => {
  // Ensure options is always an array
  const validOptions = Array.isArray(options) ? options : [];

  return (
    <div className="my-3 flex w-full items-center">
      <label className="mr-2 w-4/12 text-xl font-bold">{labelName}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="flex-1 rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
      >
        {validOptions.length > 0 ? (
          validOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No options available
          </option>
        )}
      </select>
    </div>
  );
};

SelectField.propTypes = {
  labelName: PropTypes.string.isRequired, // Label for the field
  name: PropTypes.string.isRequired, // Name of the select input
  value: PropTypes.string.isRequired, // Selected value
  handleChange: PropTypes.func.isRequired, // Change handler for select input
  options: PropTypes.arrayOf(PropTypes.string), // List of options (array of strings)
};

export default EditPage;
