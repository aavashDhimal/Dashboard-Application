import { Pie } from "react-chartjs-2";

function PieChart() {
    const data = [
    {
        "_id": "GET",
        "count": 34089
      },
      {
        "_id": "POST",
        "count": 6
      },
      {
        "_id": "DELETE",
        "count": 3
      }
    ]

    const chartData = {
      labels: data.map(item => item._id),
      datasets: [
        {
          fill: true,
          data: data.map(item => item.count),
          backgroundColor: [
            'rgba(99, 225, 132, 0.8)', // GET
            'rgba(5, 162, 235, 0.8)', // HEAD
            'rgba(55, 206, 86, 0.8)', // OPTIONS
            'rgba(75, 192, 192, 0.8)'  // POST
          ],
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: "Deals Won And Lost",
        fontSize: 15
      },
      legend: {
        display: true,
        position: "top"
      },

      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const currentValue = dataset.data[tooltipItem.index];
            return `${data.labels[tooltipItem.index]}: ${currentValue}`;
          }
        }
      }
    };
  
    return (
      <div style={{ maxHeight: "250px" }}>
        <Pie
          data={chartData}
          options={chartOptions}

        />
      </div>
    )
  }
  
  export default PieChart