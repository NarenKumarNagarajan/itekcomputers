import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AllDataTable = ({ allData, openPopup, openDeletePopup }) => {
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState(allData);

  const navigate = useNavigate();

  const { position } = useSelector((store) => store.loginSlice);

  const tableHead = [
    "ID",
    "JOB ID",
    "NAME",
    "MOBILE",
    "IN",
    "OUT",
    "ASSETS",
    "JOB STATUS",
    "SOLUTION",
    "AMOUNT",
    "ACTION",
  ];

  const editJob = (editJobID) => {
    navigate(`/editPage?jobID=${editJobID}`);
  };

  const triggerOpenPopup = (JOB_ID) => {
    openPopup(JOB_ID);
  };

  const handleDeleteJob = (deleteJobID) => {
    openDeletePopup(deleteJobID);
  };

  const handleFilterDataInput = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const filtered = allData.filter(
      (row) =>
        row.JOB_ID.toLowerCase().includes(search.toLowerCase()) ||
        row.NAME.toLowerCase().includes(search.toLowerCase()) ||
        row.MOBILE.includes(search),
    );
    setFilterData(filtered);
  }, [search, allData]);

  return (
    <div className="mt-3 overflow-x-auto">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleFilterDataInput}
        className="mb-2 w-full rounded-lg border-2 border-slate-400 p-2 focus:outline-0 lg:w-1/3"
      />
      <table className="w-full border-collapse overflow-auto border-2 border-[#ddd]">
        <thead>
          <tr className="bg-black text-white">
            {tableHead.map((heading, index) => (
              <th
                key={index}
                className="whitespace-nowrap border border-gray-300 px-2 py-1 text-center"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterData.length > 0 ? (
            filterData.map((row, index) => (
              <tr
                key={row.newID}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.newID}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.JOB_ID}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.NAME}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.MOBILE}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.IN_DATE}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.OUT_DATE}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.ASSETS}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.JOB_STATUS}
                </td>
                <td className="flex-wrap border border-gray-300 px-2 py-1">
                  {row.SOLUTION_PROVIDED}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1">
                  {row.AMOUNT}
                </td>
                <td className="whitespace-nowrap border border-gray-300 px-2 py-1 text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
                      onClick={() => triggerOpenPopup(row.JOB_ID)}
                    >
                      View
                    </button>
                    <button
                      className="rounded bg-orange-600 px-2 py-1 font-bold text-white hover:bg-orange-800"
                      onClick={() => editJob(row.JOB_ID)}
                    >
                      Edit
                    </button>
                    {position === "ADMIN" && (
                      <button
                        className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
                        onClick={() => handleDeleteJob(row.JOB_ID)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHead.length} className="p-4 text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

AllDataTable.propTypes = {
  allData: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.number,
      JOB_ID: PropTypes.string,
      NAME: PropTypes.string,
      MOBILE: PropTypes.string,
      IN_DATE: PropTypes.string,
      OUT_DATE: PropTypes.string,
      ASSETS: PropTypes.string,
      JOB_STATUS: PropTypes.string,
      AMOUNT: PropTypes.number,
      PURCHASE_AMOUNT: PropTypes.number,
    }),
  ).isRequired,
  openPopup: PropTypes.func.isRequired,
  openDeletePopup: PropTypes.func.isRequired,
};

export default AllDataTable;
