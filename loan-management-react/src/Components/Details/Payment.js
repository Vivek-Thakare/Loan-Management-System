import React, { Component } from "react";
import axios from "axios";
import { Checkmark } from "react-checkmark";
import SyncLoader from "react-spinners/SyncLoader";
import { Redirect } from "react-router-dom";

export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loanId: this.props.location.payment_data.loan_id,
      res: null,
      payment_done: false,
      redirect: false,
    };
  }

  payMoney = async (amount, user_id, loan_id,type) => {
    //API call to pay the installment amount.
    try {
      console.log(type)
      const res = await axios.get("/payLoan", {
        params: { uid: user_id, lid: loan_id, amount: amount ,type:type },
      });
      this.setState({ res: res.data, payment_done: true });
    } catch (err) {
      console.log("payment", err);
    }
  };

  componentDidMount() {
    const payment_data = this.props.location.payment_data;
    setTimeout(() => {
      this.payMoney(
        payment_data.installment_amt,
        payment_data.user_id,
        payment_data.loan_id,
        payment_data.type
      );
    }, 3000);
    setTimeout(() => {
      this.setState({ redirect: true });
    }, 7000);
  }

  render() {
    if (!this.state.payment_done) {
      return (
        <div className="container ">
          <div className="jumbotron p-5 m-4">
            <p className="display-4">payment processing</p>
            <SyncLoader size={10} color={"gray"}></SyncLoader>
          </div>
        </div>
      );
    } else {
      if (!this.state.redirect) {
        return (
          <div className="container ">
            <div className="jumbotron p-4 pb-5 m-4">
              <Checkmark size="xxLarge"></Checkmark>
              <h3 className=" text-success mt-2">Payment Recieved </h3>
              <h4 className="text-success mt-2">Thank You for your Payment</h4>
              <p>You can check transaction history for your records</p>
              <div>
                <h4>Total Payment Amount</h4>
                <h3>Rs. {this.state.res.data[2]}</h3>
              </div>
              <p>please wait while we are redirecting you to Dashboard</p>
            </div>
          </div>
        );
      } else {
        return (
          <Redirect
            to={{
              pathname: "/user",
              state: {
                loanId: this.state.loanId,
              },
            }}
          ></Redirect>
        );
      }
    }
  }
}
