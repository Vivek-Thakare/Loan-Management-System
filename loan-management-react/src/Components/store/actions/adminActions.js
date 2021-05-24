import axios from "axios";

export const GET_LOAN_OPTIONS = "GET_LOAN_OPTIONS";
export const GET_USERS_FOR_LOAN_TYPE = "GET_USERS_FOR_LOAN_TYPE";
export const ADMIN_ERROR = "ADMIN_ERROR";

export const getLoanOptions = (token) => {
  //API call for getting the Loan options, i.e different types of loan applied.
  return async (dispatch) => {
    try {
      const headers = {Authorization: `Bearer ${token}` }
      const res = await axios.get("/getAppliedLoanOptions", {headers});
      dispatch({
        type: GET_LOAN_OPTIONS,
        payload: {
          loanOptions: res.data.options,
          loanChart: res.data.loan_summary,
          loanType: res.data.options[0],
        },
      });
    } catch (err) {
      dispatch({ type: ADMIN_ERROR, error: "something went wrong" });
    }
  };
};

//API call for getting all the users associated with the selected LoanType.
export const getAllUsers = (loanType, token) => {
  return async (dispatch) => {
    if (loanType) {
      try {
        const config = {
          headers: {Authorization: `Bearer ${token}` },
          params: { loantype: loanType }
        }
        const res = await axios.get("/getUsers", config);

        if (res.data.status == "success") {
          dispatch({
            type: GET_USERS_FOR_LOAN_TYPE,
            payload: {
              users: res.data.users,
            },
          });
        } else {
          alert("no users found");
        }
        console.log("Get ALL USERS", res.data);
      } catch (err) {
        dispatch({ type: ADMIN_ERROR, error: "something went wrong" });
      }
    }
  };
};
