import errorImg from "../images/errorImg.jpg";

const ErrorPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-auto p-4">
      <img src={errorImg} alt="Error" />
    </div>
  );
};

export default ErrorPage;
