import axios from "axios";
import { useContext } from "react";

export const GET_USER_PROFILE = "GET_USER_PROFILE";
export const GET_LOAN_OPTIONS = "GET_LOAN_OPTIONS";
export const GET_LOAN_DETAILS = "GET_LOAN_DETAILS";
export const USER_ERROR = "USER_ERROR";




export const getUserProfileDetails = (id, token) => {
  return async (dispatch) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`/userProfile/${id}`, { headers });
      dispatch({ type: GET_USER_PROFILE, payload: res.data.data });
    } catch (err) {
      console.log("user profile", err);
      dispatch({ type: USER_ERROR, error: err });
    }
  };
};

export const getLoanOptions = (id, location, token) => {
  //API call for getting the loan options to populate the select box fields.
  return async (dispatch) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`/getUserLoanOptions/${id}`, { headers });
      console.log(res.data.loan_options);

      let loanTypeId = null;

      if (location.state === undefined) {
        loanTypeId = res.data.loan_options[0].loan_id;
        console.log(loanTypeId);
      } else {
        loanTypeId = location.state.loanId;
        console.log(loanTypeId);
      }

      dispatch({
        type: GET_LOAN_OPTIONS,
        payload: { loanTypeId: loanTypeId, loanOptions: res.data.loan_options },
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: USER_ERROR, error: err });
    }
  };
};

export const getLoanDetails = (id, loanTypeId, token) => {
  //API call for getting the user details of the selected loan type. It will be called whenever the loanTypeId is changed
  return async (dispatch) => {
    try {
      if (loanTypeId) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { id: id, loanId: loanTypeId },
        };
        const res = await axios.get(`/getUserLoanDetails`, config);

        dispatch({
          type: GET_LOAN_DETAILS,
          payload: {
            userDetails: res.data.data,
            transactionHistory: res.data.transaction_history,
          },
        });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: USER_ERROR, error: err });
    }
  };
};
