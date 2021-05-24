import React from "react";
import { Link } from "react-router-dom";
import CurrencyFormat from "react-currency-format";

const Details = (props) => {
  const {
    total_loan,
    paid_loan,
    loan_tenure,
    tenure_completed,
    loan_type,
    loan_status
  } = props.userDetails;

  const tenure_remaining = loan_tenure - tenure_completed;
  const remaining_loan = total_loan - paid_loan;
  const transaction_history = props.transactionHistory;

  const Pay = () => {
    const {
      installment_amt,
      installment_due_date,
      user_id,
      loan_id,
      loan_type,
    } = props.userDetails;

    const paymentData = {
      //Payload for the Payment component after clicking the Pay now button
      installment_amt,
      installment_due_date,
      user_id,
      loan_id,
      loan_type,
      type:'installment'
    };

    const closeLoanData = {
      //Payload for the Payment component after clicking the close loan button
      installment_amt: remaining_loan,
      installment_due_date,
      user_id,
      loan_id,
      loan_type,
      type:'closeLoan'
    };

    return (
      <div>
        {loan_status!== 'closed' ?
         <div className="card shadow-sm mt-4">
         <div className="card-body">
           <div
             className="card-header h6 rounded text-white"
             style={{ backgroundColor: "#76b900" }}
           >
             Current Installment
           </div>
           <hr></hr>
           <p className="card-text my-2">Amount : Rs. {installment_amt} </p>
           <p className="card-text">Due Date: {installment_due_date} </p>

           <Link
             to={{ pathname: "/payment", payment_data: paymentData }}
             className="btn btn-primary mt-1"
           >
             Pay Now
           </Link>
         </div>
       </div>:
        <div className="card shadow-sm mt-4">
        <div className="card-body">
          <div
            className="card-header h6 rounded text-white"
            style={{ backgroundColor: "#76b900" }}
          >
            Current Installment
          </div>
          <hr></hr>
          <b>This Loan is closed.</b>
        </div>
      </div>
       }
        {loan_status!=='closed'?<div className="container mt-4">
          <Link
            to={{ pathname: "/payment", payment_data: closeLoanData }}
            className="btn btn-outline-success btn-block "
          >
            Close Loan
          </Link>
        </div>:null}
      </div>
    );
  };

  const formatTenure = (tenure) => {
    //function to display tenure remaining in months and years
    let year = parseInt(tenure / 12);
    let month = tenure % 12;
    if (year < 1) {
      return <span>{month} mths.</span>;
    } else if (year === 1) {
      if (month === 0 && year === 1) {
        return <span>{year} yr.</span>;
      } else {
        return (
          <span>
            {year} yr {month} mths.
          </span>
        );
      }
    } else {
      return (
        <span>
          {year} yrs {month} mths.
        </span>
      );
    }
  };

  const setStatusColor = (status) => {
    switch (status) {
      case "green":
        return "text-success";

      case "yellow":
        return "text-warning";

      case "red":
        return "text-danger";

      default:
        return "text-light";
    }
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <div
          className="card-header shadow h5 rounded text-white"
          style={{ backgroundColor: "#e66220" }}
        >
          Details - {loan_type}
        </div>
        <div className="row mt-2">
          <div className="col-sm-6">
            <div className="card shadow-sm mt-3">
              <div className="card-body">
                <div
                  className="card-header h6 rounded text-white"
                  style={{ backgroundColor: "#5161ce" }}
                >
                  Loan (in Rs.)
                </div>
                <hr></hr>
                <div className="text-left ml-2  font-italic">
                  <p className="card-text">
                    Loan Amount :{" "}
                    <CurrencyFormat
                      value={total_loan}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rs. "}
                    />
                  </p>
                  <p className="card-text">
                    Paid :{" "}
                    <CurrencyFormat
                      value={parseInt(paid_loan)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rs. "}
                    />{" "}
                  </p>
                  <p className="card-text">
                    Remaining :{" "}
                    <CurrencyFormat
                      value={parseInt(remaining_loan)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rs. "}
                    />{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card shadow-sm mt-3">
              <div className="card-body">
                <div
                  className="card-header h6 rounded text-white"
                  style={{ backgroundColor: "#76b900" }}
                >
                  Tenure
                </div>
                <hr></hr>
                <div className="text-left ml-2  font-italic">
                  <p className="card-text">
                    Total : {formatTenure(loan_tenure)}{" "}
                  </p>
                  <p className="card-text">
                    Completed : {formatTenure(tenure_completed)}{" "}
                  </p>
                  <p className="card-text">
                    Remaining : {formatTenure(tenure_remaining)}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-sm-6">
            <div className="card mt-4 shadow-sm">
              <div className="card-body">
                <div
                  className="card-header h6 rounded text-white"
                  style={{ backgroundColor: "#5161ce" }}
                >
                  Transaction History
                </div>
                <table className="table table-responsive-sm">
                  <thead>
                    <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaction_history
                      ? transaction_history.map((
                          res,
                          index //displaying the last three transactions of the user.
                        ) => (
                          <tr key={index}>
                            <td>
                              <span className={setStatusColor(res.status)}>
                                &#9679;
                              </span>
                              {res.tid}{" "}
                            </td>
                            <td>Rs.{res.paid_amount} </td>
                            <td>{res.date.slice(4, 16)}</td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-sm">
            <Pay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
