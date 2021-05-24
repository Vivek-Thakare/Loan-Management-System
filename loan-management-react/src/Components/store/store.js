import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import adminReducer from "./reducers/adminReducer";
import userReducer from "./reducers/userReducer";


const rootReducer = combineReducers({
    user: userReducer,
    admin: adminReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;