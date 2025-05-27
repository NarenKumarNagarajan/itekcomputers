import { useCallback } from "react";

export const useFormValidation = () => {
  const validateJobSheet = useCallback((formData) => {
    const errors = {};

    // Customer Details Validation
    if (!formData.customerName?.trim()) {
      errors.customerName = "Enter Customer Name";
    }

    if (!/^\d{10}$/.test(formData.mobileNo)) {
      errors.mobileNo = "Enter Valid Mobile Number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter Valid Email Address";
    }

    // Product Details Validation
    if (!formData.engineer) {
      errors.engineer = "Enter Engineer Name";
    }

    if (!formData.moc) {
      errors.moc = "Enter MOC";
    }

    if (!formData.assets) {
      errors.assets = "Enter Assets";
    }

    if (!formData.productMake) {
      errors.productMake = "Enter Product Make";
    }

    if (!formData.serialNo?.trim()) {
      errors.serialNo = "Enter Serial No";
    }

    if (!formData.faultType) {
      errors.faultType = "Enter Fault Type";
    }

    if (!formData.jobStatus) {
      errors.jobStatus = "Enter Job Status";
    }

    return errors;
  }, []);

  return {
    validateJobSheet,
  };
};
