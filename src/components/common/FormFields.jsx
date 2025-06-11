import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const TextareaField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  maxLength,
  className = "",
}) => {
  return (
    <div className="my-3 flex w-full items-center">
      <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
        {label}
      </label>
      <div className="w-2/3">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`h-20 w-full resize-none rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${
            error ? "border-red-500" : ""
          } ${className}`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  className = "",
}) => {
  return (
    <div className="my-3 flex w-full items-center">
      <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
        {label}
      </label>
      <div className="w-2/3">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${
            error ? "border-red-500" : ""
          } ${className}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export const DatePickerField = ({
  label,
  selected,
  onChange,
  error,
  placeholder,
  className = "",
}) => {
  return (
    <div className="my-3 flex w-full items-center">
      <label className="mr-2 w-1/3 text-xl font-bold text-[#1a365d]">
        {label}
      </label>
      <div className="w-2/3">
        <DatePicker
          selected={selected}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          showYearDropdown
          className={`w-full rounded-md border border-slate-800 px-2 py-1 focus:border-slate-800 focus:ring-0 ${
            error ? "border-red-500" : ""
          } ${className}`}
          placeholderText={placeholder}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

TextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  className: PropTypes.string,
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};

DatePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
