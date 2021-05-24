import React from "react";
import LoanChart from "../../Charts/LoanChart";
import TenureChart from "../../Charts/TenureChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEnvelope,
  faLandmark,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";

const AdminModal = (props) => {
  const {
    paid_loan,
    total_loan,
    tenure_completed,
    loan_tenure,
    first_name,
    user_id,
    last_name,
    email,
    mobile,
    loan_type,
    issue_date,
    loan_id,
  } = props.modalData;

  const tenure_remaining = loan_tenure - tenure_completed;
  const remaining_loan = total_loan - paid_loan;

  const loan = {
    paid: parseInt(paid_loan),
    remaining: parseInt(remaining_loan),
  };

  const tenure = {
    completed: parseInt(tenure_completed),
    remaining: parseInt(tenure_remaining),
  };

  return (
    <div
      key={loan_id}
      className="modal animate__animated animate__fadeIn"
      id="user"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div
            className="modal-header text-light"
            style={{ backgroundColor: "#5161ce" }}
          >
            <p className="modal-title h4 r">Details</p>
            <button type="button" className="close" data-dismiss="modal">
              <span className="h4 text-light p-2">&times;</span>
            </button>
          </div>
          <div className="card modal-body">
            <div className="row border ml-1 mr-1 px-2 rounded">
              <div className="col-sm-3">
                <p className="card-text text-justify text-center font-weight-normal h4 mt-4 pt-2">
                  {first_name} {last_name}
                </p>
              </div>
              <div className="col-sm">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-left">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="text-info "
                        />
                        <b> Email</b> :- {email}
                      </td>
                      <td className="text-left">
                        <FontAwesomeIcon
                          icon={faMobileAlt}
                          className="text-info "
                        />
                        <b> Mobile</b> :- {mobile}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-left">
                        <FontAwesomeIcon
                          icon={faLandmark}
                          className="text-info"
                        />
                        <b> Loan Type </b> :- {loan_type}
                      </td>
                      <td className="text-left">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-info"
                        />
                        <b> Issue Date</b> :- {issue_date.slice(5, 16)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-5 mx-auto">
                <LoanChart key={user_id} loan={loan} />
              </div>
              <div className="col-sm-5 mx-auto">
                <TenureChart key={user_id} tenure={tenure} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
