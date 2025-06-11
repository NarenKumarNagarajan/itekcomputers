import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useApiData } from "../hooks/useApiData";
import {
  DATA_BY_JOB_ID_URL,
  EDIT_JOB_URL,
  PICKERS_URL,
} from "../utils/globalConstants";
import {
  BUTTON_BASE_STYLE,
  BUTTON_SIZES,
  BUTTON_COLORS,
} from "../utils/globalConstants";

const EditPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editJobID = queryParams.get("jobID");
  const navigate = useNavigate();
  const { jwtToken } = useSelector((store) => store.loginSlice);
  const { fetchData, postData } = useApiData();
  const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });
  const [formData, setFormData] = useState({
    oldJobID: "",
    jobID: "",
    customerName: "",
    mobileNo: "",
    email: "",
    address: "",
    engineer: "",
    moc: "",
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
    inDate: format(new Date(), "dd/MM/yyyy"),
    outDate: format(new Date(), "dd/MM/yyyy"),
    engineerPicker: [],
    mocPicker: [],
    assetsPicker: [],
    productPicker: [],
    faultPicker: [],
    jobStatusPicker: [],
  });

  useEffect(() => {
    if (editJobID) {
      getJobDetails(editJobID);
    }
    getPickers();
  }, [editJobID]);

  const getJobDetails = async (jobID) => {
    try {
      const data = await fetchData(
        `${DATA_BY_JOB_ID_URL}?jobID=${jobID}`,
        jwtToken,
      );
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
      setMessage({ errorMsg: error.message, successMsg: "" });
    }
  };

  const getPickers = async () => {
    try {
      const data = await fetchData(PICKERS_URL, jwtToken);
      setFormData((prev) => ({
        ...prev,
        engineerPicker: data.engineers,
        mocPicker: data.moc,
        assetsPicker: data.assets_type,
        productPicker: data.products,
        faultPicker: data.faults,
        jobStatusPicker: data.job_status,
      }));
    } catch (error) {
      setMessage({ errorMsg: error.message, successMsg: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: format(date, "dd/MM/yyyy"),
    }));
  };

  const onFormSubmit = async (action) => {
    setMessage({ errorMsg: "", successMsg: "" });
    try {
      const response = await postData(EDIT_JOB_URL, formData, jwtToken);
      setMessage({ errorMsg: "", successMsg: response.message });

      if (action === "saveAndPdf") {
        const trimmedJobID = formData.jobID.trim();
        navigate(`/printPage?jobID=${trimmedJobID}`);
      } else {
        navigate("/allJobs");
      }
    } catch (error) {
      setMessage({ errorMsg: error.message, successMsg: "" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {message.errorMsg && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {message.errorMsg}
        </div>
      )}
      {message.successMsg && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
          {message.successMsg}
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full rounded-lg border-2 border-[#1a365d] p-4 lg:w-1/2">
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
              <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
                In Date
              </label>
              <div className="w-2/3">
                <DatePicker
                  selected={parse(formData.inDate, "dd/MM/yyyy", new Date())}
                  onChange={(date) => handleDateChange(date, "inDate")}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                  placeholderText="Select In Date"
                />
              </div>
            </div>

            <div className="my-3 flex w-full items-center">
              <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
                Out Date
              </label>
              <div className="w-2/3">
                <DatePicker
                  selected={parse(formData.outDate, "dd/MM/yyyy", new Date())}
                  onChange={(date) => handleDateChange(date, "outDate")}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  className="w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
                  placeholderText="Select Out Date"
                />
              </div>
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

          <div className="mt-8 w-full rounded-lg border-2 border-[#1a365d] p-4 lg:mt-0 lg:w-1/2">
            <SectionHeader title="PRODUCT DETAILS" />
            <SelectField
              labelName="Assets"
              name="assets"
              value={formData.assets}
              handleChange={handleChange}
              options={formData.assetsPicker}
            />
            <SelectField
              labelName="Product Make"
              name="productMake"
              value={formData.productMake}
              handleChange={handleChange}
              options={formData.productPicker}
            />
            <InputField
              labelName="Serial Number"
              name="serialNo"
              value={formData.serialNo}
              handleChange={handleChange}
              placeholder="Serial Number"
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
              maxLength={500}
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
              options={["YES", "NO"]}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            type="submit"
            className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.MEDIUM} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
            onClick={() => onFormSubmit("save")}
          >
            Save
          </button>
          <button
            type="submit"
            className={`${BUTTON_BASE_STYLE} ${BUTTON_SIZES.MEDIUM} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
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
  <h1 className="w-full border-2 border-[#1a365d] bg-[#1a365d] p-2 text-xl font-bold text-white">
    {title}
  </h1>
);

const InputField = ({ labelName, name, value, handleChange, placeholder }) => (
  <div className="my-3 flex w-full items-center">
    <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
      {labelName}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      className="w-2/3 rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
      placeholder={placeholder}
    />
  </div>
);

const TextareaField = ({
  labelName,
  name,
  value,
  handleChange,
  placeholder,
  maxLength,
}) => (
  <div className="my-3 flex w-full items-center">
    <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
      {labelName}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={handleChange}
      className="h-20 w-2/3 resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
      placeholder={placeholder}
      maxLength={maxLength}
    />
  </div>
);

const SelectField = ({
  labelName,
  name,
  value,
  handleChange,
  options = [],
}) => (
  <div className="my-3 flex w-full items-center">
    <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
      {labelName}
    </label>
    <select
      name={name}
      value={value}
      onChange={handleChange}
      className="w-2/3 rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0"
    >
      {options.length > 0 ? (
        options.map((option) => (
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

export default EditPage;
