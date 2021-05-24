import * as actionTypes from "../actions/adminActions";

const initialState = {
  data: null,
  loanOptions: [],
  loanType: null,
  loanChart: null,
  users: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_LOAN_OPTIONS:
      return {
        ...state,
        data: action.payload,
        loanOptions: action.payload.loanOptions,
        loanType: action.payload.loanType,
        loanChart: action.payload.loanChart,
      };

    case actionTypes.GET_USERS_FOR_LOAN_TYPE:
      return {
        ...state,
        users: action.payload.users,
      };

    case actionTypes.ADMIN_ERROR:
      return {
        ...state,
        errorMsg: action.error,
      };
  }
  return state;
};

export default adminReducer;
