class Charts {
  constructor() {
    this.liveWorkloadBarChart;
    this.averageBarChartOne;
    this.averageBarChartTwo;

    this.createLiveWorkloadBarChart();
    this.createAverageBarChartOne();
    this.createAverageBarChartTwo();
  }

  // Live Workload Bar Chart
  createLiveWorkloadBarChart() {
    const ctx = document.querySelector("#workload-bar-chart").getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: [],
      datasets: [
        {
          label: "Current Threshold",
          backgroundColor: [],
          data: [],
        },
        {
          label: "Current UWN",
          backgroundColor: [],
          data: [],
        },
        {
          label: "Max Threshold(1.0) Beta",
          fill: false,
          borderColor: "blue",
          backgroundColor: "blue",
          data: [],
          radius: 0,

          // Changes this dataset to become a line
          type: "line",
        },
        {
          label: "Surpassing Current Threshold",
          backgroundColor: "yellow",
        },
        {
          label: "Surpassing Max Threshold",
          backgroundColor: "red",
        },
        {
          label: "Current Workload",
          backgroundColor: "#2F607B",
        },
      ],
    };

    // Chart Data Options
    let chartOptions = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              fontSize: 12,
              fontColor: "white",
            },
            barPercentage: 0.7,
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Units",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 12,
              beginAtZero: true,
              fontColor: "white",
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Workload",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
      },
      animation: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      title: {
        display: true,
        text: "Current Unit Workload",
        fontSize: 15,
        fontColor: "white",
      },
      legend: {
        labels: {
          filter: function (item, chart) {
            // Logic to remove a particular legend item goes here
            return item.text == null || !item.text.includes("Current UWN");
          },
          fontColor: "white",
        },
      },
    };

    this.liveWorkloadBarChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  liveWorkloadData(data) {
    // Remove Data
    this.liveWorkloadBarChart.data.labels = [];
    this.liveWorkloadBarChart.data.datasets[0].data = [];
    this.liveWorkloadBarChart.data.datasets[1].data = [];
    this.liveWorkloadBarChart.data.datasets[2].data = [];
    this.liveWorkloadBarChart.data.datasets[0].backgroundColor = [];
    this.liveWorkloadBarChart.data.datasets[1].backgroundColor = [];
    this.liveWorkloadBarChart.update();
    //

    // Sort data in descending order with threshold
    data.sort((a, b) => {
      return b.threshold - a.threshold;
    });

    data.forEach((row) => {
      let unit = row.unit;
      let current_threshold = row.threshold;
      let current_workload = row.workload;

      // Check if item already in chart data
      if (
        this.liveWorkloadBarChart.data.labels.includes(unit) !== true &&
        unit !== undefined
      ) {
        if (current_workload >= 1) {
          this.liveWorkloadBarChart.data.datasets[1].backgroundColor.push(
            "red"
          );
          this.liveWorkloadBarChart.data.datasets[0].backgroundColor.push(
            "#2E4E64"
          );
        } else if (current_workload > current_threshold) {
          this.liveWorkloadBarChart.data.datasets[1].backgroundColor.push(
            "yellow"
          );
          this.liveWorkloadBarChart.data.datasets[0].backgroundColor.push(
            "#2E4E64"
          );
        } else {
          this.liveWorkloadBarChart.data.datasets[1].backgroundColor.push(
            "#32A9D9"
          );
          this.liveWorkloadBarChart.data.datasets[0].backgroundColor.push(
            "rgba(46, 78, 100, 0.8)"
          );
        }

        if (current_workload < 0) {
          current_workload = 0;
        }
      }

      // Update Chart with new data
      this.liveWorkloadBarChart.data.labels.push(unit);
      this.liveWorkloadBarChart.data.datasets[0].data.push(current_threshold);
      this.liveWorkloadBarChart.data.datasets[1].data.push(current_workload);
      this.liveWorkloadBarChart.data.datasets[2].data.push(1);
      this.liveWorkloadBarChart.update();
    });
  }

  // Average Post Time, Drive Time, On Call Time
  createAverageBarChartOne() {
    const ctx = document.querySelector("#average-chart-one").getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: ["On Call Time", "Post Time", "Drive Time"],
      datasets: [
        {
          label: "Current Value",
          backgroundColor: [],
          data: [],
        },
        {
          label: "Current Average",
          backgroundColor: [],
          data: [],
        },
      ],
    };

    // Chart Data Options
    let chartOptions = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 12,
              fontColor: "white",
            },
            barPercentage: 0.7,
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: false,
              labelString: "Categories",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 12,
              beginAtZero: true,
              fontColor: "white",
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Time",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
      },
      animation: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      title: {
        display: true,
        text: "On Call Time, Post Time, Drive Time",
        fontSize: 15,
        fontColor: "white",
      },
      legend: {
        labels: {
          //   filter: function (item, chart) {
          //     // Logic to remove a particular legend item goes here
          //     return item.text == null || !item.text.includes("Current Value");
          //   },
          fontColor: "white",
        },
      },
    };

    this.averageBarChartOne = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  averageBarChartOneData(responseData) {
    let currentOnCallValue = responseData[0]["accumulated_on_call_time"];
    let currentOnCallAverage = responseData[0]["on_call_average"];

    let currentPostTimeValue = responseData[0]["accumulated_post_time"];
    let currentPostTimeAverage = responseData[0]["post_time_average"];

    let currentDriveTimeValue = responseData[0]["accumulated_drive_time"];
    let currentDriveTimeAverage = responseData[0]["drive_time_average"];

    // Remove Data
    this.averageBarChartOne.data.datasets[0].data = [];
    this.averageBarChartOne.data.datasets[1].data = [];
    this.averageBarChartOne.data.datasets[0].backgroundColor = [];
    this.averageBarChartOne.data.datasets[1].backgroundColor = [];
    this.averageBarChartOne.update();
    //

    // Update Chart with new data
    this.averageBarChartOne.data.datasets[1].data.push(
      currentOnCallValue,
      currentPostTimeValue,
      currentDriveTimeValue
    );
    this.averageBarChartOne.data.datasets[0].data.push(
      currentOnCallAverage,
      currentPostTimeAverage,
      currentDriveTimeAverage
    );

    this.averageBarChartOne.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartOne.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartOne.update();
  }

  // Average Late Call, Past EOS
  createAverageBarChartTwo() {
    const ctx = document.querySelector("#average-chart-two").getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: ["Late Call", "Past EOS"],
      datasets: [
        {
          label: "Current Value",
          backgroundColor: [],
          data: [],
        },
        {
          label: "Current Average",
          backgroundColor: [],
          data: [],
        },
      ],
    };

    // Chart Data Options
    let chartOptions = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 12,
              fontColor: "white",
            },
            barPercentage: 0.7,
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: false,
              labelString: "Categories",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 12,
              beginAtZero: true,
              fontColor: "white",
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Time",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
      },
      animation: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      title: {
        display: true,
        text: "Late Call, Past EOS",
        fontSize: 15,
        fontColor: "white",
      },
      legend: {
        labels: {
          //   filter: function (item, chart) {
          //     // Logic to remove a particular legend item goes here
          //     return item.text == null || !item.text.includes("Current Value");
          //   },
          fontColor: "white",
        },
      },
    };

    this.averageBarChartTwo = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  averageBarChartTwoData(responseData) {
    let currentLateCallValue = responseData[0]["accumulated_late_calls"];
    let currentLateCallAverage = responseData[0]["late_call_average"];

    let currentPastEOSValue = responseData[0]["accumulated_past_eos"];
    let currentPastEOSAverage = responseData[0]["past_eos_average"];

    // Remove Data
    this.averageBarChartTwo.data.datasets[0].data = [];
    this.averageBarChartTwo.data.datasets[1].data = [];
    this.averageBarChartTwo.data.datasets[0].backgroundColor = [];
    this.averageBarChartTwo.data.datasets[1].backgroundColor = [];
    this.averageBarChartTwo.update();
    //

    // Update Chart with new data
    this.averageBarChartTwo.data.datasets[1].data.push(
      currentLateCallValue,
      currentPastEOSValue
    );
    this.averageBarChartTwo.data.datasets[0].data.push(
      currentLateCallAverage,
      currentPastEOSAverage
    );

    this.averageBarChartTwo.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartTwo.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartTwo.update();
  }
}

export const charts = new Charts();
