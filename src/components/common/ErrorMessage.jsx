import PropTypes from "prop-types";

const ErrorMessage = ({ message, type = "error", className = "" }) => {
  const styles = {
    error: "border-red-500 bg-red-50 text-red-600",
    warning: "border-yellow-500 bg-yellow-50 text-yellow-600",
    success: "border-green-500 bg-green-50 text-green-600",
  };

  if (!message) return null;

  return (
    <div
      className={`relative mt-6 mb-3 w-5/6 rounded-lg border-2 p-3 text-center lg:w-1/3 ${styles[type]} ${className}`}
    >
      <p className="font-bold">{message}</p>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["error", "warning", "success"]),
  className: PropTypes.string,
};

export default ErrorMessage;
