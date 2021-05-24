import React, { useContext, useEffect } from "react";
import Spinner from "../Spinner";
import AdminChart from "../../Charts/AdminChart";
import TransactionStatusChart from "../../Charts/TransactionStatusChart";
import { useDispatch, useSelector } from "react-redux";
import * as actionCreators from "../../store/actions/adminActions";
import AdminTable from "../Tables/AdminTable";
import AuthContext from "../../auth/auth-context";

const AdminDash = () => {
  const authCtx = useContext(AuthContext)
  const {token} = authCtx
  
  //selector hooks for accessing the golbal state stored in store.
  const data = useSelector((state) => state.admin.data);
  const loanType = useSelector((state) => state.admin.loanType);
  const loanOptions = useSelector((state) => state.admin.loanOptions);
  const loanChart = useSelector((state) => state.admin.loanChart);
  const userList = useSelector((state) => state.admin.users);
  
  

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(actionCreators.getLoanOptions(token));
  }, []);

  useEffect(() => {
    dispatch(actionCreators.getAllUsers(loanType, token));
  }, [loanType]);

  const onChangeHandler = (event) => {
    dispatch(actionCreators.getAllUsers(event.target.value, token));
  };

  if (data) {
    return (
      <div>
        <div className="container-fluid mt-4">
          <div className="row mt-2 ">
            <div className="col-sm-3 mb-2">
              <ul className="nav nav-tabs " role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="pill"
                    href="#home"
                  >
                    Loan
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="pill" href="#menu1">
                    Transaction
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div id="home" className=" tab-pane active">
                  <br />
                  {loanChart ? (<AdminChart loan={loanChart} />) : null}
                </div>
                <div id="menu1" className=" tab-pane fade">
                  <br />
                  <TransactionStatusChart />{" "}
                </div>
              </div>
            </div>
            <div className="col-sm-9 mb-2">
              <div className="row container-fluid">
                <div className="col-sm-4">
                  <div className="form-group">
                    <select
                      className="form-control shadow-sm"
                      onChange={onChangeHandler}
                      name="loanType"
                    >
                      {loanOptions.length !== 0
                        ? loanOptions.map((option, index) => (
                            <option
                              className="h6 text-success"
                              key={index}
                              value={option}
                            >
                              {option}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                </div>
                <div className="col-sm-8"></div>
              </div>
              <AdminTable loanType={loanType} userList={userList} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

export default AdminDash;
