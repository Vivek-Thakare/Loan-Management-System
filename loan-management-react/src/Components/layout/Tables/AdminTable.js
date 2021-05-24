import React, { Fragment, useEffect, useState } from "react";

import CurrencyFormat from "react-currency-format";

import axios from "axios";
import AdminModal from "../Modals/AdminModal";

const AdminTable = (props) => {
  const [modalData, setModalData] = useState(null);
  const [searchType, setSearchType] = useState("Search By");
  const [searchData, setSearchData] = useState("");
  const [searchData1, setSearchData1] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [searchStatus, setSearchStatus] = useState(true);
  const [comparator, setComparator] = useState("=");

  const { loanType, userList } = props;

  useEffect(() => {
    setTableData(userList);
  }, [userList]);

  const handleSearch = async () => {
    //API call to filter table data according to the selected filter type.
    try {
      const params = {
        search_type: searchType,
        search_key: searchData,
        comparator: comparator,
        search_key1: searchData1,
        loantype: loanType,
      };
      const res = await axios.get("/filterSearch", { params: params });
      console.log(res.data);
      if (res.data.data !== "null") {
        setTableData(res.data.data);
      } else {
        setSearchStatus(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchClear = () => {
    setTableData(userList);
    setSearchStatus(true);
    setSearchType("Search By");
    setSearchData("");
  };

  const createTable = (user, index) => {
    //Creating Dynamic table according the data received
    if (user) {
      const {
        user_id,
        first_name,
        last_name,
        total_loan,
        paid_loan,
        installment_due_date,
        loan_id,
        loan_type,
        loan_status,
      } = user;
      const remaining_loan = total_loan - paid_loan;

      return (
        <tr key={index}>
          <td className="text-justify">{user_id}</td>
          <td className="text-justify">
            {first_name} {last_name}
          </td>
          <td className="text-justify">{loan_id}</td>
          <td className="text-justify">
            <CurrencyFormat
              value={total_loan}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rs. "}
            />
          </td>
          <td className="text-justify">
            {" "}
            <CurrencyFormat
              value={parseInt(paid_loan)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rs. "}
            />
          </td>
          <td className="text-justify">
            <CurrencyFormat
              value={parseInt(remaining_loan)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rs. "}
            />
          </td>
          <td className="text-justify">{loan_status}</td>
          <td className="d-flex ">
            <button
              type="button"
              className="container ml-2 btn btn-outline-info"
              onClick={() => setModalData(user)}
              data-toggle="modal"
              data-target="#user"
            >
              View Chart
            </button>
          </td>
        </tr>
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      {tableData ? (
        <div className="container-fluid mt-3">
          {/* <div class="container"> */}
          <div className="form-inline">
            <div className="form-group">
              <select
                onChange={(e) => setSearchType(e.target.value)}
                className="form-control w-100"
                id="sel1"
                value={searchType}
                name="search_type"
              >
                <option>Search By</option>
                <option>User Id</option>
                <option>Name</option>
                <option>Date Issued</option>
                <option>Date Issued (Range)</option>
                <option>Loan Amount</option>
                <option>Loan Paid</option>
                <option>Loan Remaining</option>
                <option>Tenure</option>
                <option>Tenure remaining</option>
                <option>Tenure completed</option>
              </select>
            </div>
            {searchType === "Name" || //conditional rendering to show or hide specific input boxes.
            searchType === "Search By" ||
            searchType === "User Id" ||
            searchType === "Date Issued (Range)" ||
            searchType === null ? null : (
              <div className="form-group">
                <select
                  onChange={(e) => setComparator(e.target.value)}
                  className="form-control w-100 mx-2"
                  id="sel1"
                  name="search_type"
                >
                  <option defaultValue> = </option>
                  <option> &gt; </option>
                  <option> &lt; </option>
                </select>
              </div>
            )}
            {searchType === "Date Issued (Range)" ? (
              <React.Fragment>
                <label className="pl-3">From</label>
                <input
                  className="form-control mx-2 w-25"
                  onChange={(e) => setSearchData(e.target.value)}
                  type="date"
                  name="search_key"
                  placeholder="Search"
                />
                <label>To</label>
                <input
                  className="form-control mx-2 w-25"
                  onChange={(e) => setSearchData1(e.target.value)}
                  type="date"
                  name="search_key"
                  placeholder="Search"
                />
              </React.Fragment>
            ) : (
              <input
                className="form-control mx-2 w-25"
                onChange={(e) => setSearchData(e.target.value)}
                type={searchType === "Date Issued" ? "date" : "text"}
                name="search_key"
                value={searchData}
                placeholder="Search"
              />
            )}

            <button
              onClick={(e) => handleSearch(e)}
              className="btn btn-success mx-2"
              type="submit"
            >
              Search
            </button>
            <button
              onClick={() => handleSearchClear()}
              className="btn btn-success mx-2"
            >
              Clear
            </button>
            <br />
          </div>
          {/* </div> */}
          <table className="table mt-3 shadow table-striped table-responsive-sm bg-light animate__animated animate__fadeIn">
            <thead
              className="text-left text-light"
              style={{ backgroundColor: "#5161ce" }}
            >
              <tr>
                <th className="h6">ID</th>
                <th className="h6">Name</th>
                <th className="h6">Loan ID</th>
                <th className="h6">Loan Amount</th>
                <th className="h6">Loan Paid</th>
                <th className="h6">Loan Remaining</th>
                <th className="h6">Loan Status</th>
                <th className="h6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {searchStatus ? (
                tableData.map(createTable)
              ) : (
                <tr>
                  <td colSpan="6" className="text-info h5">
                    No Records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {modalData ? (
            <AdminModal modalData={modalData} />
          ) : null}
        </div>
      ) : null}
    </Fragment>
  );
};

export default AdminTable;
