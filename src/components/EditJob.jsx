import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateJobSheet, postData, getData } from "../services/apiService";

const EditJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobID: "",
    customerName: "",
    mobileNo: "",
    email: "",
    address: "",
    engineer: "",
    moc: "",
    inDate: "",
    outDate: "",
    assets: "",
    productMake: "",
    serialNo: "",
    description: "",
    faultType: "",
    faultDesc: "",
    jobStatus: "",
    solutionProvided: "",
    amount: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [jobID, setJobID] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateJobSheet(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await postData(
        UPDATE_URL,
        {
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
        },
        jwtToken,
      );

      if (response.message) {
        setMessage({ type: "success", text: response.message });
        // Only navigate on success
        setTimeout(() => {
          navigate("/allData");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update job",
      });
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getData(`${GET_URL}?jobID=${jobID}`, jwtToken);
        if (response && response.length > 0) {
          const jobData = response[0];
          setFormData({
            jobID: jobData.JOB_ID || "",
            customerName: jobData.NAME || "",
            mobileNo: jobData.MOBILE || "",
            email: jobData.EMAIL || "",
            address: jobData.ADDRESS || "",
            engineer: jobData.ENGINEER || "",
            moc: jobData.MOC || "",
            inDate: jobData.IN_DATE || "",
            outDate: jobData.OUT_DATE || "",
            assets: jobData.ASSETS || "",
            productMake: jobData.PRODUCT_MAKE || "",
            serialNo: jobData.SERIAL_NO || "",
            description: jobData.DESCRIPTION || "",
            faultType: jobData.FAULT_TYPE || "",
            faultDesc: jobData.FAULT_DESC || "",
            jobStatus: jobData.JOB_STATUS || "",
            solutionProvided: jobData.SOLUTION_PROVIDED || "",
            amount: jobData.AMOUNT || "",
          });
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setMessage({ type: "error", text: "Failed to fetch job details" });
      }
    };

    if (jobID) {
      fetchJobDetails();
    }
  }, [jobID, jwtToken]);

  return <div>{/* Render your form here */}</div>;
};

export default EditJob;
