import { useEffect } from "react";
import { format, addDays, parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useForm } from "../hooks/useForm";
import { useApiData } from "../hooks/useApiData";
import { useFormValidation } from "../hooks/useFormValidation";
import { Input } from "./common/Input";
import {
  TextareaField,
  SelectField,
  DatePickerField,
} from "./common/FormFields";
import {
  FETCH_JOB_ID_URL,
  INSERT_URL,
  PICKERS_URL,
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

const CustomerDetails = ({ formData, errors, handleChange }) => (
  <div className="w-full lg:w-1/2">
    <h2 className="mb-4 text-xl font-bold">Customer Details</h2>
    <Input
      label="Job ID"
      name="jobID"
      value={formData.jobID}
      onChange={handleChange}
      error={errors.jobID}
      placeholder="Job ID"
      readOnly
    />
    <Input
      label="Customer Name"
      name="customerName"
      value={formData.customerName}
      onChange={handleChange}
      error={errors.customerName}
      placeholder="Enter customer name"
    />
    <Input
      label="Mobile Number"
      name="mobileNo"
      value={formData.mobileNo}
      onChange={handleChange}
      error={errors.mobileNo}
      type="tel"
      placeholder="Enter mobile number"
    />
    <Input
      label="Email Address"
      name="email"
      value={formData.email}
      onChange={handleChange}
      error={errors.email}
      type="email"
      placeholder="Enter email address"
    />
    <TextareaField
      label="Address"
      name="address"
      value={formData.address}
      onChange={handleChange}
      error={errors.address}
      placeholder="Enter address"
      maxLength={500}
    />
    <SelectField
      label="Assigned Engineer"
      name="engineer"
      value={formData.engineer}
      onChange={handleChange}
      options={formData.engineerPicker}
      error={errors.engineer}
    />
    <SelectField
      label="Mode of Contact"
      name="moc"
      value={formData.moc}
      onChange={handleChange}
      options={formData.mocPicker}
      error={errors.moc}
    />
    <DatePickerField
      label="In Date"
      selected={parse(formData.inDate, "dd/MM/yyyy", new Date())}
      onChange={(date) =>
        handleChange({
          target: { name: "inDate", value: format(date, "dd/MM/yyyy") },
        })
      }
      error={errors.inDate}
      placeholder="Select in date"
    />
    <DatePickerField
      label="Out Date"
      selected={parse(formData.outDate, "dd/MM/yyyy", new Date())}
      onChange={(date) =>
        handleChange({
          target: { name: "outDate", value: format(date, "dd/MM/yyyy") },
        })
      }
      error={errors.outDate}
      placeholder="Select out date"
    />
  </div>
);

const ProductDetails = ({ formData, errors, handleChange }) => (
  <div className="w-full lg:ml-4 lg:w-1/2">
    <h2 className="mb-4 text-xl font-bold">Product Details</h2>
    <SelectField
      label="Asset Type"
      name="assets"
      value={formData.assets}
      onChange={handleChange}
      options={formData.assetsPicker}
      error={errors.assets}
    />
    <SelectField
      label="Product Make"
      name="productMake"
      value={formData.productMake}
      onChange={handleChange}
      options={formData.productPicker}
      error={errors.productMake}
    />
    <Input
      label="Serial Number"
      name="serialNo"
      value={formData.serialNo}
      onChange={handleChange}
      error={errors.serialNo}
      placeholder="Enter serial number"
    />
    <TextareaField
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      error={errors.description}
      placeholder="Enter description"
      maxLength={500}
    />
    <SelectField
      label="Fault Type"
      name="faultType"
      value={formData.faultType}
      onChange={handleChange}
      options={formData.faultPicker}
      error={errors.faultType}
    />
    <TextareaField
      label="Fault Description"
      name="faultDesc"
      value={formData.faultDesc}
      onChange={handleChange}
      error={errors.faultDesc}
      placeholder="Enter fault description"
      maxLength={1500}
    />
    <SelectField
      label="Job Status"
      name="jobStatus"
      value={formData.jobStatus}
      onChange={handleChange}
      options={formData.jobStatusPicker}
      error={errors.jobStatus}
    />
    <TextareaField
      label="Solution Provided"
      name="solutionProvided"
      value={formData.solutionProvided}
      onChange={handleChange}
      error={errors.solutionProvided}
      placeholder="Enter solution provided"
      maxLength={1500}
    />
    <Input
      label="Amount"
      name="amount"
      value={formData.amount}
      onChange={handleChange}
      error={errors.amount}
      type="number"
      placeholder="Enter amount"
    />
  </div>
);

const JobSheet = () => {
  const navigate = useNavigate();
  const { jwtToken, name } = useSelector((store) => store.loginSlice);

  const { formData, errors, handleChange, setErrors, resetForm, setFormData } =
    useForm(initialFormState);

  const { loading, error: apiError, fetchData, postData } = useApiData();
  const { validateJobSheet } = useFormValidation();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [jobIdData, pickersData] = await Promise.all([
          fetchData(FETCH_JOB_ID_URL, jwtToken),
          fetchData(PICKERS_URL, jwtToken),
        ]);

        const currentYear = format(new Date(), "yy");
        const currentMonth = format(new Date(), "MM");
        const lastJobNumber =
          jobIdData.JOB_ID.length > 0
            ? parseInt(jobIdData.JOB_ID.slice(-3), 10)
            : 0;
        const newJobNumber = (lastJobNumber + 1).toString().padStart(3, "0");
        const newJobID = `iTek${currentYear}${currentMonth}${newJobNumber}`;

        setFormData((prev) => ({
          ...prev,
          jobID: newJobID,
          engineerPicker: pickersData.engineers,
          mocPicker: pickersData.moc,
          assetsPicker: pickersData.assets_type,
          productPicker: pickersData.products,
          faultPicker: pickersData.faults,
          jobStatusPicker: pickersData.job_status,
          engineer: pickersData.engineers[0],
          moc: pickersData.moc[0],
          assets: pickersData.assets_type[0],
          productMake: pickersData.products[0],
          faultType: pickersData.faults[0],
          jobStatus: pickersData.job_status[0],
        }));
      } catch (error) {
        setErrors({ fetch: "Failed to load initial data" });
      }
    };

    fetchInitialData();
  }, [jwtToken, fetchData, setFormData, setErrors]);

  const handleSubmit = async (actionType) => {
    const validationErrors = validateJobSheet(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await postData(
        INSERT_URL,
        { ...formData, name },
        jwtToken,
      );

      if (response.message) {
        setTimeout(() => {
          if (actionType === "saveAndPdf") {
            navigate(`/printPage?jobID=${formData.jobID}`);
          }
          resetForm();
        }, 2000);
      }
    } catch (error) {
      setErrors({ submit: error.message || "Failed to submit job" });
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
      {apiError && (
        <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="flex flex-col lg:flex-row">
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

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => handleSubmit("save")}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("saveAndPdf")}
            className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Generate PDF"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobSheet;
