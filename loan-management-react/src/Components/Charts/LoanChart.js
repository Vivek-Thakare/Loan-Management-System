import React  from "react";
import { Doughnut } from "react-chartjs-2";
import CurrencyFormat from "react-currency-format";

const LoanChart = (props) => {
  
    
    const { paid, remaining } = props.loan;

    let chart = {
      total: paid + remaining,
      chartData: {
        labels: ["Remaining loan", "Paid loan"],
        datasets: [
          {
            backgroundColor: ["rgb(59, 120, 156)", "#76b900"],
            borderColor: "white",
            // hoverBorderColor : 'slateblue',
            // hoverBackgroundColor : 'gold',
            data: [remaining, paid],
          },
        ],
      },
      options: {
        cutoutPercentage: 60,
        responsive: true,
        animation: {
          animateRotate: true,
          //  duration : 2000
        },
        legend: {
          // display:false
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
  

  
    return (
      <div className="card rounded shadow animate__animated animate__pulse">
        <div className="card-body">
          <div
            className="card-header shadow h5 rounded text-white"
            style={{ backgroundColor: "#5161ce" }}
          >
            Loan Summary
          </div>
          <hr className="w-75" style={{ borderTop: "2px solid #5161ce" }} />
          <Doughnut
            data={chart.chartData}
            options={chart.options}
            height={43}
            width={50}
          />
          <hr />
          <div className="card-text text-center mt-3 h6 ">
            {" "}
            Loan Amount :{" "}
            <CurrencyFormat
              value={chart.total}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rs. "}
            />
          </div>
        </div>
      </div>
    );
}

export default LoanChart;
