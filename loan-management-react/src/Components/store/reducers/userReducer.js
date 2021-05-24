import * as actionTypes from "../actions/userAction";

const initialState = {
  userProfileData: null,
  loanTypeId: null,
  loanOptions: [],
  userDetails:null,
  transactionHistory:null,
  errorMsg: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_PROFILE:
      return {
        ...state,
        userProfileData: action.payload,
      };

    case actionTypes.GET_LOAN_OPTIONS:
      return {
        ...state,
        loanTypeId: action.payload.loanTypeId,
        loanOptions: action.payload.loanOptions
      };

      case actionTypes.GET_LOAN_DETAILS:
        return {
          ...state,
          userDetails: action.payload.userDetails,
          transactionHistory: action.payload.transactionHistory
        };

    case actionTypes.USER_ERROR:
      return {
        ...state,
        errorMsg: action.error,
      };


  }
  return state;
};

export default userReducer;
