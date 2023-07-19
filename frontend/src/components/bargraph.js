import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({}) {
  const chartData = {
    labels: [
      "0 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM","12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
    ],
    datasets: [
      {
        label: "Entries",
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 115, 121, 197, 229, 230, 246, 243, 255, 248, 248, 241,400
        ],
        backgroundColor: "rgba(100, 0, 235, 0.8)" // Add your desired background color here
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio : false,
    title: {
      display: true,
      text: "Deals Won And Lost",
      fontSize: 15
    },
    legend: {
      display: true
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            suggestedMin: 0, // Set the minimum value of the x-axis to 0
            suggestedMax: 23, // Set the maximum value of the x-axis to 23 (total hours)
            stepSize: 1, // Set the step size to 1 to display all hours
            maxRotation: 0.5,
          },
          ticks: {
            // Rotate X-axis labels if needed
            autoSkip: true,
            maxTicksLimit: 8 // Show a maximum of 8 X-axis labels
          }
        }
      ]
    }
  };

  return (
    <div style={{ height: "300px",width :"100% !important" }}>
      <Bar
        data={chartData}
        options={chartOptions}
        height={300} // Specify the height of the chart
        width={600} // Specify the width of the chart
      />
    </div>
  );
}

export default BarChart;
