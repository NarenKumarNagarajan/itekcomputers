import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { useSelector } from "react-redux";

import logo from "../images/logo.png";
import { IoIosMail, IoIosCall } from "react-icons/io";
import { BiWorld } from "react-icons/bi";
import { DATA_BY_JOB_ID_URL } from "../utils/globalConstants";
import { numberToWords } from "../utils/helperFunc.jsx";

const PrintPage = () => {
  const [jobDetails, setJobDetails] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const location = useLocation();
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

  const getJobDetails = async () => {
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
    }
  };

  const formatAmount = (amount) => {
    try {
      if (!amount || amount === 0) return "-";
      return `Rs. ${amount}`;
    } catch (error) {
      console.error("Error formatting amount:", error);
      return "-";
    }
  };

  const formatAmountInWords = (amount) => {
    try {
      if (!amount || amount === 0) return "-";
      return `(${numberToWords(parseInt(amount, 10))} Only)`;
    } catch (error) {
      console.error("Error formatting amount in words:", error);
      return "-";
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-purple-300">
        {errorMsg && (
          <div className="text-xl font-bold text-red-600">{errorMsg}</div>
        )}
        {jobDetails && Object.keys(jobDetails).length > 0 && (
          <div className="bg-white px-6 py-12" ref={componentRef}>
            <div className="border-2 border-black">
              <div className="flex items-center border-b-2 border-black">
                <img
                  src={logo}
                  alt="logo"
                  className="w-2/6 border-r-2 border-black p-4"
                />

                <div className="ml-5 flex-1 text-center">
                  <h1 className="font-bold">LAPTOP | DESKTOP | CCTV</h1>
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

              <h1 className="border-b-2 border-black p-1 text-center text-xl font-bold">
                JOB SHEET
              </h1>

              <div className="flex items-center justify-between border-b-2 border-black px-6">
                <div className="w-1/2 border-r-2 border-black text-left">
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black py-1 text-lg font-bold">
                      Job No
                    </span>
                    <span className="flex-grow border-b-2 border-black py-1 pl-2">
                      {jobDetails.JOB_ID}
                    </span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black py-1 text-lg font-bold">
                      Engineer
                    </span>
                    <span className="py-1 pl-2">{jobDetails.ENGINEER}</span>
                  </p>
                </div>
                <div className="w-1/2 py-2 text-right">
                  <p>
                    <span className="font-courier text-lg font-bold">
                      In Date:
                    </span>{" "}
                    {jobDetails.IN_DATE}
                  </p>

                  <p>
                    <span className="font-courier text-lg font-bold">
                      Out Date:
                    </span>{" "}
                    {jobDetails.OUT_DATE}
                  </p>
                </div>
              </div>

              <h1 className="border-b-2 border-black py-2 text-center font-bold">
                CUSTOMER DETAILS
              </h1>

              <div className="flex items-start justify-between border-b-2 border-black px-6 text-left">
                <div className="w-1/2 border-r-2 border-black">
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black py-1 text-lg font-bold">
                      Name
                    </span>
                    <span className="py-1 pl-2">{jobDetails.NAME}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black pb-1 text-lg font-bold">
                      Mobile
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.MOBILE}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[100px] border-r-2 border-black pb-1 text-lg font-bold">
                      Email
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.EMAIL}</span>
                  </p>
                </div>
                <div className="w-1/2 py-1 pl-2">
                  <p className="font-courier text-lg font-bold">Address:</p>
                  <p>{jobDetails.ADDRESS}</p>
                </div>
              </div>

              <h1 className="border-b-2 border-black py-2 text-center font-bold">
                PRODUCT DETAILS
              </h1>

              <div className="flex h-full items-stretch justify-between border-b-2 border-black text-left">
                <div className="flex min-h-full w-1/2 flex-col border-r-2 border-black px-6">
                  <p className="flex">
                    <span className="font-courier min-h-full w-[150px] border-r-2 border-black py-1 text-lg font-bold">
                      Asset Type
                    </span>
                    <span className="py-1 pl-2">{jobDetails.ASSETS}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1 text-lg font-bold">
                      Product Type
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.PRODUCT_MAKE}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1 text-lg font-bold">
                      Serial No
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.SERIAL_NO}</span>
                  </p>
                  <p className="flex">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1 text-lg font-bold">
                      Description
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.DESCRIPTION}</span>
                  </p>
                  <p className="flex flex-grow">
                    <span className="font-courier w-[150px] border-r-2 border-black pb-1 text-lg font-bold">
                      Job Status
                    </span>
                    <span className="pb-1 pl-2">{jobDetails.JOB_STATUS}</span>
                  </p>
                </div>
                <div className="w-1/2">
                  <p className="border-b-2 border-black px-2 py-1 text-justify">
                    <span className="font-courier text-lg font-bold">
                      Fault Type:{" "}
                    </span>{" "}
                    {jobDetails.FAULT_TYPE}
                  </p>
                  <h1 className="font-courier px-2 pt-1 text-lg font-bold">
                    Fault Description:
                  </h1>
                  <p className="px-2 pb-1 text-justify">
                    {jobDetails.FAULT_DESC}
                  </p>
                </div>
              </div>

              <div className="border-b-2 border-black px-6 py-1">
                <h1 className="font-courier text-lg font-bold">
                  Provided Solution:
                </h1>
                <p className="text-justify">{jobDetails.SOLUTION_PROVIDED}</p>
              </div>

              <div className="border-b-2 border-black px-6">
                <p className="flex font-bold">
                  <span className="font-courier w-[130px] border-r-2 border-black py-1 text-lg">
                    AMOUNT
                  </span>
                  <span className="py-1 pl-2">
                    {formatAmount(jobDetails.AMOUNT)}
                  </span>
                </p>
                <p className="flex">
                  <span className="font-courier w-[130px] border-r-2 border-black py-1 text-lg font-bold">
                    (in words)
                  </span>
                  <span className="py-1 pl-2">
                    {formatAmountInWords(jobDetails.AMOUNT)}
                  </span>
                </p>
              </div>

              <h1 className="border-b-2 border-black px-6 py-1 text-justify">
                <span className="font-courier text-lg font-bold">
                  Terms & Conditions:{" "}
                </span>
                iTek Computers will not be held responsible or liable for
                products that are not picked up or delivered within 60 days or
                two months from the date the job sheet is issued.
              </h1>

              <div className="flex w-full items-stretch justify-between px-6 font-bold">
                <div className="flex w-1/2 items-start border-r-2 border-black py-1">
                  <h1>Customer Signature</h1>
                </div>
                <div className="flex flex-col justify-between py-1 text-right">
                  <h1>Authorized Signature</h1>
                  <h1 className="pt-20 font-bold">(iTek Computers)</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReactToPrint
        trigger={() => (
          <center>
            <button className="my-5 rounded-lg bg-black px-3 py-2 text-white">
              Print
            </button>
          </center>
        )}
        content={() => componentRef.current}
      />
    </div>
  );
};

export default PrintPage;
