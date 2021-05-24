import React from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import axios from "axios";

const Register = (props) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/authenticate", data); //API call to register the user.
      alert(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="">
      <form
        className="animate__animated animate__fadeIn"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="container">
          <div className="card shadow rounded text-left">
            <div className="card-header h4 font-weight-normal font-italic text-center  text-info">
              Register
            </div>
            <div className="card-body mt-2">
              <div className="row">
                <div className="col-sm">
                  <div className=" form-group">
                    <label htmlFor="firstname">Firstname :- </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      name="first_name"
                      {...register("first_name")}
                      required
                      placeholder="Enter Firstname"
                    />
                  </div>
                </div>
                <div className="col-sm">
                  <div className=" form-group">
                    <label htmlFor="lastname">Lastname :- </label>
                    <input
                      type="text"
                      className="form-control shadow-sm "
                      name="last_name"
                      required
                      {...register("last_name")}
                      placeholder="Enter Lastname"
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm">
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile :- </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      name="mobile"
                      required
                      {...register("mobile")}
                      placeholder="Enter Mobile"
                    />
                  </div>
                </div>
                <div className="col-sm">
                  <div className="form-group">
                    <label htmlFor="email">Email :- </label>
                    <input
                      type="email"
                      className="form-control shadow-sm"
                      name="email"
                      required
                      {...register("email")}
                      placeholder="Enter Email"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Address :- </label>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  name="address"
                  required
                  {...register("address")}
                  placeholder="Enter Address"
                />
              </div>
              <div className="row mt-1">
                <div className="col-sm">
                  <div className="form-group">
                    <label htmlFor="gender">Gender :- </label>
                    <br />
                    <select
                      name="gender"
                      {...register("gender")}
                      className="form-control"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth :- </label>
                    <input
                      type="date"
                      className="form-control shadow-sm"
                      name="dob"
                      required
                      {...register("dob")}
                    />
                  </div>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-sm">
                  <div className=" form-group">
                    <label htmlFor="username">Username :- </label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      name="user_name"
                      {...register("user_name")}
                      required
                      placeholder="Enter Username"
                    />
                  </div>
                </div>
                <div className="col-sm">
                  <div className=" form-group">
                    <label htmlFor="password">Password :- </label>
                    <input
                      type="password"
                      className="form-control shadow-sm "
                      name="password"
                      required
                      {...register("password")}
                      placeholder="Password"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto ">
              <button className=" btn btn-outline-primary shadow-sm mb-3">
                Register
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
