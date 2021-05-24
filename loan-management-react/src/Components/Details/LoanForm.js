import React, { useContext } from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react/cjs/react.development";
import { Redirect } from "react-router-dom";
import AuthContext from "../auth/auth-context";

const LoanForm = () => {
  const authCtx = useContext(AuthContext);
  const { id } = authCtx.authData;
  const {token} = authCtx

  const { register, handleSubmit } = useForm();
  const [redirect, setRedirect] = useState(false);

  const onSubmit = async (data) => {
    //API call to register the user applied loan.
    try {
      data.tenure = Number(data.tenure) * 12;      // Converting the tenure in months..(user will select in years).
      const headers = {Authorization: `Bearer ${token}`}
      const res = await axios.post(`/applyForLoan/${id}`, data, {headers});
      console.log(data);
      alert(res.data.msg);
      if (res.data.status) {
        setRedirect(true);
        console.log(redirect, "redirect");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form
        className="animate__animated animate__fadeIn  my-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="container w-50 mx-auto">
          <div className="text-left card shadow">
            <div className="card-header h3 font-weight-normal font-italic text-center bg-info text-light">
              New loan
            </div>
            <div className="card-body mt-2">
              <div className="form-group">
                <label htmlFor="loan_type">Select Loan Type</label>
                <select
                  className="form-control shadow-sm"
                  {...register("loan_type")}
                  name="loan_type"
                >
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Car Loan</option>
                </select>
              </div>
              <div className="row">
                <div className="col">
                  <div className=" form-group">
                    <label htmlFor="firstname">Loan Amount (In Rs.)</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      name="loan_amount"
                      {...register("loan_amount")}
                      required
                      placeholder="Loan Amount"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className=" form-group">
                    <label htmlFor="tenure">Tenure (In Years)</label>
                    <select
                      className="form-control shadow-sm"
                      {...register("tenure")}
                      name="tenure"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto ">
              <button className=" btn btn-outline-primary shadow-sm mb-3">
                Apply
              </button>
            </div>
          </div>
        </div>
      </form>
      {redirect ? <Redirect to="/user" /> : null}
    </div>
  );
};

export default LoanForm;
