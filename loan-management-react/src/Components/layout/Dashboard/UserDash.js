import React, { useEffect, useContext } from "react";
import LoanChart from "../../Charts/LoanChart";
import TenureChart from "../../Charts/TenureChart";
import Spinner from "../Spinner";
import Details from "../../Details/Details";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../auth/auth-context";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "../../store/actions/userAction";




const UserDash = () => {
  const authCtx = useContext(AuthContext);
  const { id } = authCtx.authData;
  const {token} = authCtx;

  const loanTypeId = useSelector((state) => state.user.loanTypeId);
  const loanOptions = useSelector((state) => state.user.loanOptions);
  const userDetails = useSelector((state) => state.user.userDetails);
  const transactionHistory = useSelector(
    (state) => state.user.transactionHistory
  );
  const dispatch = useDispatch();
  const location = useLocation(); // contains the selected loanTypeId after redirection from Payment Component.


  useEffect(() => {
    dispatch(actionCreators.getLoanOptions(id, location, token));
  }, []);

  useEffect(() => {
    dispatch(actionCreators.getLoanDetails(id, loanTypeId, token));
  }, [loanTypeId]);

  const handleChange = (e) => {
    dispatch(actionCreators.getLoanDetails(id, e.target.value, token));
  };

  const mapLoanOptions = () => {
    //populating the dropdown with options after redirection from Payment component
    if (loanOptions.length !== 0) {
      if (loanTypeId !== undefined) {
        const { loanId } = location.state;
        return (
          <React.Fragment>
            {loanOptions.map((option, index) => {
              return (
                <React.Fragment key={index}>
                  {option.loan_id !== loanId ? (
                    <option
                      className="h6 text-success"
                      key={index}
                      value={option.loan_id}
                    >
                      {`${option.loan_type} (id : ${option.loan_id} ) ${option.loan_status}`}
                    </option>
                  ) : (
                    <option
                      className="h6 text-success"
                      key={index}
                      value={option.loan_id}
                      selected
                    >
                      {`${option.loan_type} (id : ${option.loan_id}) ${option.loan_status}`}
                    </option>
                  )}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const displayData = () => {
    if (userDetails) {
      localStorage.username = `${userDetails.first_name} ${userDetails.last_name}`;
      const {
        paid_loan,
        total_loan,
        loan_tenure,
        loan_id,
        tenure_completed,
      } = userDetails;

      const loan = {
        paid: parseInt(paid_loan),
        remaining: parseInt(total_loan) - parseInt(paid_loan),
      };

      const tenure = {
        completed: parseInt(tenure_completed),
        remaining: parseInt(loan_tenure) - parseInt(tenure_completed),
      };

      return (
        <div>
          {true ? (
            <div className="container-fluid ">
              <div className="row mt-2 ">
                <div className="col-sm-3 mb-2">
                  <LoanChart key={loan_id} loan={loan} />
                </div>
                <div className="col-sm-6 mb-2">
                  <Details
                    userDetails={userDetails}
                    transactionHistory={transactionHistory}
                  />
                </div>
                <div className="col-sm-3">
                  <TenureChart key={loan_id} tenure={tenure} />
                </div>
              </div>
            </div>
          ) : (
            <div className="container jumbotron h4 font-weight-normal">
              You don't have any {loanTypeId} pending
            </div>
          )}
        </div>
      );
    } else {
      return <Spinner />;
    }
  };

  return (
    <div>
      <div className="row container-fluid">
        <div className="col-sm-6">
          <div className="ml-auto">
            <Link
              to="/newloan"
              className="btn shadow-sm w-50 btn-block btn-outline-info mt-4"
            >
              New Loan
            </Link>
          </div>
        </div>
        <div className="col-sm-3"></div>
        <div className="col-sm-3">
          <div className="mt-4">
            <div className="form-group">
              <select
                className="form-control shadow-sm"
                onChange={(e) => {
                  handleChange(e);
                }}
                name="loanTypeId"
              >
                {loanOptions && location.state === undefined //populating the dropdown with dynamic options
                  ? loanOptions.map((option, index) => (
                      <option
                        className="h6 text-success"
                        key={index}
                        value={option.loan_id}
                      >
                       {`${option.loan_type} (id : ${option.loan_id}) ${option.loan_status}`}
                      </option>
                    ))
                  : mapLoanOptions()}
              </select>
            </div>
          </div>
        </div>
      </div>
      {loanOptions.length !== 0 ? (
        displayData()
      ) : (
        <div className="jumbotron container h4">
          Not Applied for any loans yet....
        </div>
      )}
    </div>
  );
};

export default UserDash;
