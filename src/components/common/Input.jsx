import PropTypes from "prop-types";

const Input = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  readOnly = false,
  className = "",
  autoFocus = false,
}) => {
  // If no label is provided, render a simple input (for Login page)
  if (!label) {
    return (
      <div className="relative mb-6 flex flex-col">
        <div className="relative flex-1">
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            autoFocus={autoFocus}
            className={`w-full rounded-lg border-2 border-white bg-white px-4 py-2 text-gray-700 focus:border-white focus:outline-none ${className}`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  // If label is provided, render the full input with label (for JobSheet page)
  return (
    <div className="my-3 flex w-full items-center">
      <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
        {label}
      </label>
      <div className="w-2/3">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          autoFocus={autoFocus}
          className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${
            error ? "border-red-500" : ""
          } ${className}`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default Input;
