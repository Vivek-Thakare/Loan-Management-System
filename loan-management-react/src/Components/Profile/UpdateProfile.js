import React from "react";
import "./style.css";
import { useForm } from "react-hook-form";
import axios from "axios";

const UpdateProfile = (props) => {
  const { uid } = props;
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    //API call to update the User's Profile.
    try {
      const res = await axios.put(`/userProfile/${uid}`, data);
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const {
    first_name,
    last_name,
    mobile,
    email,
    gender,
    dob,
    address,
  } = props.profile;

  return (
    <div>
      <form
        className="animate__animated animate__fadeIn"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="container-fluid">
          <div className="text-left card shadow">
            <div className="card-header h3 font-weight-normal font-italic text-center bg-success text-light">
              Update Profile
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
                      defaultValue={first_name}
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
                      {...register("last_name")}
                      defaultValue={last_name}
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
                      {...register("mobile")}
                      defaultValue={mobile}
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
                      {...register("email")}
                      defaultValue={email}
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
                  {...register("address")}
                  defaultValue={address}
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
                      defaultValue={gender}
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
                      {...register("dob")}
                      defaultValue={dob}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto ">
              <button className=" btn btn-outline-primary shadow-sm mb-3">
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
