import React from "react";
import { Doughnut } from "react-chartjs-2";

 const TenureChart = (props) => {
  
    const { completed, remaining } = props.tenure;

    let chart = {
      totalTenure: completed + remaining,
      chartData: {
        labels: ["Remaining", "Completed"],
        datasets: [
          {
            backgroundColor: ["rgb(59, 120, 156)", "rgb(138, 83, 163)"],
            borderColor: "white",
            // hoverBorderColor : 'slateblue',
            // hoverBackgroundColor : 'gold',
            data: [remaining, completed],
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
          padding: 5,
        },
      },
    };
  

  const formatTenure = () => {    //function to display tenure remaining in months and years
    let year = parseInt(chart.totalTenure / 12);
    let month = chart.totalTenure % 12;
    if (year < 1) {
      return <span>{month} mths.</span>;
    } else if (year === 1) {
      if (month === 0) {
        return <span>{year} yr.</span>;
      } else {
        return (
          <span>
            {year} yr {month} mths.
          </span>
        );
      }
    } else {
      return (
        <span>
          {year} yrs {month} mths.
        </span>
      );
    }
  }

    return (
      <div className="card rounded shadow animate__animated animate__pulse">
        <div className="card-body">
          <div
            className="card-header shadow h5 rounded text-white"
            style={{ backgroundColor: "#76b900" }}
          >
            Tenure Summary
          </div>
          <hr className="w-75" style={{ borderTop: "2px solid green" }} />
          <Doughnut
            data={chart.chartData}
            options={chart.options}
            height={43}
            width={50}
          />
          <hr />
          <div className="card-text text-center mt-3 h6 ">
            {" "}
            Period : {formatTenure()}
          </div>
        </div>
      </div>
    );
  
}

export default TenureChart;
