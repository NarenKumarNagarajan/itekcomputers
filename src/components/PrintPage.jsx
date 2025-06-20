import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BUTTON_BASE_STYLE, BUTTON_COLORS } from "../utils/globalConstants";

import logo from "../images/logo.png";
import { IoIosMail, IoIosCall } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { DATA_BY_JOB_ID_URL } from "../utils/globalConstants";
import { numberToWords } from "../utils/helperFunc";

const PrintPage = () => {
  const [jobDetails, setJobDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jobID = queryParams.get("jobID");
  const componentRef = useRef();
  const { jwtToken } = useSelector((store) => store.loginSlice);

  useEffect(() => {
    if (!jobID) {
      setErrorMsg("No Job ID provided");
      return;
    }
    getJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobID]);

  // Handle window focus to ensure buttons work after print dialog
  useEffect(() => {
    const handleFocus = () => {
      // Force a re-render when window regains focus
      setJobDetails((prev) => ({ ...prev }));
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const getJobDetails = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${DATA_BY_JOB_ID_URL}?jobID=${jobID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        setErrorMsg("NO DATA FOUND");
        setJobDetails({});
      } else {
        setJobDetails(data[0]);
        setErrorMsg("");
      }
    } catch (error) {
      console.error("Error fetching job details:", error.message);
      setErrorMsg("Error fetching job details");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = componentRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <div class="print-content">
        ${printContent}
      </div>
    `;

    window.print();

    // Restore the original content after a short delay
    setTimeout(() => {
      document.body.innerHTML = originalContent;
      // Re-attach event listeners
      window.location.reload();
    }, 100);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-purple-300">
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        {jobDetails && (
          <div className="bg-white p-1" ref={componentRef}>
            <div className="border-2 border-black">
              <div className="flex items-center border-b-2 border-black">
                <div className="m-2 flex justify-center">
                  <img src={logo} alt="iTek Logo" className="h-18 w-40" />
                </div>

                <div className="ml-5 flex-1 text-center">
                  <h1 className="">LAPTOP | DESKTOP | CCTV</h1>
                  <p>
                    # No: 9, Rajiv Gandhi Salai, OMR, Kandhanchavadi, Perungudi,
                    <br />
                    Chennai - 600 0096.
                  </p>
                  <h1>
                    <IoIosCall className="mr-2 inline h-5 w-5" /> 8148300494
                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                    <IoIosMail className="mr-2 inline h-5 w-5" />
                    itekcomputers07@gmail.com
                  </h1>
                  <h1>
                    <BiWorld className="mr-2 inline h-5 w-5" />{" "}
                    www.itekcomputers.in
                  </h1>
                </div>
              </div>

              <h1 className="border-b-2 border-black p-1 text-center">
                JOB SHEET
              </h1>

              <div className="flex items-center justify-between border-b-2 border-black px-6">
                <div className="w-1/2 border-r-2 border-black text-left">
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black py-1">
                      Job No
                    </span>
                    <span className="flex-grow border-b-2 border-black py-1 pl-2">
                      {jobDetails.JOB_ID}
                    </span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black py-1">
                      Engineer
                    </span>
                    <span className="py-1 pl-2">{jobDetails.ENGINEER}</span>
                  </p>
                </div>
                <div className="w-1/2 py-2 text-right">
                  <p>
                    <span className="font-courier">In Date:</span>{" "}
                    {jobDetails.IN_DATE}
                  </p>

                  <p>
                    <span className="font-courier">Out Date:</span>{" "}
                    {jobDetails.OUT_DATE}
                  </p>
                </div>
              </div>

              <h1 className="border-b-2 border-black py-2 text-center">
                CUSTOMER DETAILS
              </h1>

              <div className="flex items-start justify-between border-b-2 border-black px-6 text-left">
                <div className="w-1/2 border-r-2 border-black">
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black py-1">
                      Name
                    </span>
                    <span className="py-1 pl-2">{jobDetails.NAME}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black pb-1">
                      Mobile
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.MOBILE}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black pb-1">
                      Email
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.EMAIL}</span>
                  </p>
                </div>
                <div className="w-1/2 py-1 pl-2">
                  <p className="font-courier">Address:</p>
                  <p>{jobDetails.ADDRESS}</p>
                </div>
              </div>

              <h1 className="border-b-2 border-black py-2 text-center">
                PRODUCT DETAILS
              </h1>

              <div className="flex h-full items-stretch justify-between border-b-2 border-black text-left">
                <div className="flex min-h-full w-1/2 flex-col border-r-2 border-black px-6">
                  <p className="flex">
                    <span className="font-courier min-h-full w-[150px] border-r-2 border-black py-1">
                      Asset Type
                    </span>
                    <span className="py-1 pl-2">{jobDetails.ASSETS}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1">
                      Product Type
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.PRODUCT_MAKE}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1">
                      Serial No
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.SERIAL_NO}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1">
                      Description
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.DESCRIPTION}</span>
                  </p>
                  <p className="flex flex-grow">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1">
                      Job Status
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.JOB_STATUS}</span>
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="border-b-2 border-black px-2 py-1 text-justify">
                    <span className="font-courier">Fault Type: </span>{" "}
                    {jobDetails.FAULT_TYPE}
                  </p>
                  <h1 className="font-courier px-2 pt-1">Fault Description:</h1>
                  <p className="px-2 pb-1 text-justify">
                    {jobDetails.FAULT_DESC}
                  </p>
                </div>
              </div>

              <div className="border-b-2 border-black px-6 py-1">
                <h1 className="font-courier">Provided Solution:</h1>
                <p className="text-justify">{jobDetails.SOLUTION_PROVIDED}</p>
              </div>

              <div className="border-b-2 border-black px-6">
                <p className="flex">
                  <span className="font-courier w-[130px] border-r-2 border-black py-1">
                    AMOUNT
                  </span>
                  <span className="py-1 pl-2">
                    {jobDetails.AMOUNT === 0 ? "-" : `Rs. ${jobDetails.AMOUNT}`}
                  </span>
                </p>
                <p className="flex">
                  <span className="font-courier w-[130px] border-r-2 border-black py-1">
                    (in words)
                  </span>
                  <span className="py-1 pl-2">
                    {jobDetails.AMOUNT === 0
                      ? "-"
                      : `(${numberToWords(
                          parseInt(jobDetails.AMOUNT, 10),
                        )} Only)`}
                  </span>
                </p>
              </div>

              <h1 className="border-b-2 border-black px-6 py-1 text-justify">
                <span className="font-courier">Terms & Conditions: </span>
                iTek Computers will not be held responsible or liable for
                products that are not picked up or delivered within 60 days or
                two months from the date the job sheet is issued.
              </h1>

              <div className="flex w-full items-stretch justify-between px-6">
                <div className="flex w-1/2 items-start border-r-2 border-black py-1">
                  <h1>Customer Signature</h1>
                </div>
                <div className="flex flex-col justify-between py-1 text-right">
                  <h1>Authorized Signature</h1>
                  <h1 className="pt-20">(iTek Computers)</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={handlePrint}
          className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.PRIMARY.base} ${BUTTON_COLORS.PRIMARY.hover}`}
        >
          Print
        </button>
        <button
          onClick={handleBack}
          className={`${BUTTON_BASE_STYLE} ${BUTTON_COLORS.DANGER.base} ${BUTTON_COLORS.DANGER.hover}`}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PrintPage;
