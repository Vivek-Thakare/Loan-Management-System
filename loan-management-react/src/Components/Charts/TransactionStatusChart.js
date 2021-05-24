import React, { Component } from "react";
import { Bar} from "react-chartjs-2";
import axios from "axios";

export default class TransactionStatusChart extends Component {
  constructor(props) {
    super(props);
    console.log("rendered");
    this.state = {
      display: false,

      chartData: {
        labels: ["Green", "Yellow", "Red"],
        datasets: [
          {
            backgroundColor: ["green", "yellow", "red"],
            borderColor: "white",
            // hoverBorderColor : 'slateblue',
            // hoverBackgroundColor : 'gold',
            data: [0, 0, 0],
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
              },
            },
          ],
        },

        responsive: true,
        animation: {
          animateRotate: true,
          //  duration : 2000
        },
        legend: {
          display: false,
          labels: {
            // boxWidth : 10
            fontSize: 15,
            fontColor: "#5161ce",
          },
        },
        layout: {
          padding: 1,
        },
      },
    };
  }
  
  fetchData = async (yearAndMonth) => {
    const res = await axios.get("/getTransactionStatus", {
      params: { data: yearAndMonth },
    });
    console.log(res.data.data, "fetchdata");

    this.setState({
      display: true,
      chartData: {
        labels: ["Green", "Yellow", "Red"],
        datasets: [
          {
            backgroundColor: ["#76b900", "#FFD300", "#FF0000"],
            borderColor: "white",
            data: res.data.data,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: res.data.range + 1,
                fontColor: "slateblue",
                // lineHeight: 2.3
              },
            },
          ],
        },

        responsive: true,
        animation: {
          animateRotate: true,
          //  duration : 2000
        },
        legend: {
          display: false,
          labels: {
            // boxWidth : 10
            fontSize: 15,
            fontColor: "#5161ce",
          },
        },
        layout: {
          padding: 1,
        },
      },
    });

    console.log(this.state, "state in fetch data");
  };


  componentDidMount() {
    let d = new Date()
    let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}`;
    console.log(d.getMonth(),"month");
    this.fetchData(dateStr);
  }


  handleChange(e) {
    this.fetchData(e.target.value);
  }

  render() {
    if (this.state.display) {
      return (
        <div className="card rounded shadow animate__animated animate__pulse ">
          <div className="card-body">
            <div
              className="card-header shadow h5 rounded text-white"
              style={{ backgroundColor: "#5161ce" }}
            >
              Monthly Transaction Status
            </div>

            <hr
              className="w-75 mb-4"
              style={{ borderTop: "2px solid #5161ce" }}
            />
            <div>
              <form>
                <div className="form-group">
                  <input
                    type="month"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                </div>
              </form>
            </div>
            <Bar
              data={this.state.chartData}
              options={this.state.options}
              height={35}
              width={40}
            />
            <div className="text-left ">
              <p className="text-center mt-2 shadow-sm card-header">Color indicates payment status</p>
              <br/>
              <p className="card-text"><span className="text-success h5">&#9679;</span> before 15th day.</p>
              <p className="card-text "><span className="text-warning h5">&#9679;</span> between 15th and due date.</p>
              <p className="card-text"><span className="text-danger h5">&#9679;</span> past the due date.</p>
            </div>
          </div>
        </div>
      );
    } else {
      return "loading";
    }
  }
}
