import PropTypes from "prop-types";

const Button = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-[120px] items-center justify-center gap-2 self-center rounded-full border-2 border-white bg-[#1a365d] px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1a365d] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.node,
};

export default Button;
