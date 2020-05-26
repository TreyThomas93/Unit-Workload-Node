class Charts {
  constructor() {
    this.liveWorkloadBarChart;
    this.averageBarChartOne;
    this.averageBarChartTwo;
    this.averageBarChartThree;
    this.averageBarChartFour;
    this.averageBarChartFive;
    this.averageLineChartFour;

    this.createLiveWorkloadBarChart();
    this.createAverageBarChartOne();
    this.createAverageBarChartTwo();
    this.createAverageBarChartThree();
    this.createAverageLineChartFour();
    this.createAverageBarChartFour();
    this.createAverageBarChartFive();
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
        {
          label: "Shift Average",
          fill: false,
          borderColor: "white",
          backgroundColor: "white",
          data: [],
          radius: 0,

          // Changes this dataset to become a line
          type: "line",
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
    this.liveWorkloadBarChart.data.datasets[6].data = [];
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
      let shift_average = row.shift_average;

      if (shift_average < 0) {
        shift_average = 0;
      }

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
      this.liveWorkloadBarChart.data.datasets[6].data.push(shift_average);
      this.liveWorkloadBarChart.update();
    });
  }

  // Post Time, Drive Time, On Call Time
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
              labelString: "Time(Minutes)",
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
    this.averageBarChartOne.data.datasets[0].data.push(
      currentOnCallValue,
      currentPostTimeValue,
      currentDriveTimeValue
    );
    this.averageBarChartOne.data.datasets[1].data.push(
      currentOnCallAverage,
      currentPostTimeAverage,
      currentDriveTimeAverage
    );

    this.averageBarChartOne.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartOne.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartOne.update();
  }

  // Late Call, Past EOS
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
              max: 15,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Value",
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
    this.averageBarChartTwo.data.datasets[0].data.push(
      currentLateCallValue,
      currentPastEOSValue
    );
    this.averageBarChartTwo.data.datasets[1].data.push(
      currentLateCallAverage,
      currentPastEOSAverage
    );

    this.averageBarChartTwo.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartTwo.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartTwo.update();
  }

  // Calls
  createAverageBarChartThree() {
    const ctx = document.querySelector("#average-chart-three").getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: ["Calls"],
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
              max: 300,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Calls",
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
        text: "Calls",
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

    this.averageBarChartThree = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  averageBarChartThreeData(responseData) {
    let currentCallValue = responseData[0]["accumulated_calls"];
    let currentCallAverage = responseData[0]["call_average"];

    // Remove Data
    this.averageBarChartThree.data.datasets[0].data = [];
    this.averageBarChartThree.data.datasets[1].data = [];
    this.averageBarChartThree.data.datasets[0].backgroundColor = [];
    this.averageBarChartThree.data.datasets[1].backgroundColor = [];
    this.averageBarChartThree.update();
    //

    // Update Chart with new data
    this.averageBarChartThree.data.datasets[0].data.push(currentCallValue);
    this.averageBarChartThree.data.datasets[1].data.push(currentCallAverage);

    this.averageBarChartThree.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartThree.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartThree.update();
  }

  // Units Per Hour Line
  // Units
  createAverageLineChartFour() {
    const ctx = document
      .querySelector("#average-chart-four-line")
      .getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: [],
      datasets: [
        {
          label: "Average",
          backgroundColor: [],
          data: [],
          fill: false,
          borderColor: "white",
          pointRadius: 0,
          borderDash: [15, 10],
          borderWidth: 2
        },
        {
          label: "Today",
          backgroundColor: [],
          data: [],
          fill: false,
          borderColor: "blue",
          pointRadius: 0,
          borderWidth: 2
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
              // max: 60,
            },
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
      },
      animation: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      title: {
        display: true,
        text: "Units",
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

    this.averageLineChartFour = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: chartOptions,
    });
  }

  averageLineChartFourData(responseData) {
    // Remove Data
    this.averageLineChartFour.data.labels = [];
    this.averageLineChartFour.data.datasets[1].data = [];
    this.averageLineChartFour.data.datasets[0].backgroundColor = [];
    this.averageLineChartFour.data.datasets[1].backgroundColor = [];
    this.averageLineChartFour.update();

    let averages = responseData[0]["unitHourlyAverages"];

    averages.forEach((average) => {
      for (let key in average) {
        // Update Chart with new data
        this.averageLineChartFour.data.labels.push(key);
        this.averageLineChartFour.data.datasets[0].data.push(average[key]);
        this.averageLineChartFour.data.datasets[1].data.push(average[key]);
        // this.averageLineChartFour.data.datasets[0].backgroundColor = "#32A9D9";
        // this.averageLineChartFour.data.datasets[1].backgroundColor =
        //   "rgba(46, 78, 100, 1)";

        this.averageLineChartFour.update();
      }
    });
  }

  // Units
  createAverageBarChartFour() {
    const ctx = document.querySelector("#average-chart-four").getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: ["Units"],
      datasets: [
        {
          label: "Current Value",
          backgroundColor: [],
          data: [],
        },
        {
          label: "Average",
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
              max: 60,
            },
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
      },
      animation: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      title: {
        display: true,
        text: "Units",
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

    this.averageBarChartFour = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  averageBarChartFourData(responseData) {
    let currentUnitValue = responseData[0]["accumulated_units"];
    let currentUnitAverage = responseData[0]["unit_average"];

    // Remove Data
    this.averageBarChartFour.data.datasets[0].data = [];
    this.averageBarChartFour.data.datasets[1].data = [];
    this.averageBarChartFour.data.datasets[0].backgroundColor = [];
    this.averageBarChartFour.data.datasets[1].backgroundColor = [];
    this.averageBarChartFour.update();
    //

    // Update Chart with new data
    this.averageBarChartFour.data.datasets[0].data.push(currentUnitValue);
    this.averageBarChartFour.data.datasets[1].data.push(currentUnitAverage);
    this.averageBarChartFour.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartFour.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartFour.update();
  }

  // Level Zero
  createAverageBarChartFive() {
    const ctx = document.querySelector("#average-chart-five").getContext("2d");

    // Chart Data Display
    let chartData = {
      labels: ["Level Zero"],
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
              max: 120,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "Time(Minutes)",
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
        text: "Level Zero",
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

    this.averageBarChartFive = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  averageBarChartFiveData(responseData) {
    let currentLevelZeroValue = responseData[0]["accumulated_level_zero"];
    let currentLevelZeroAverage = responseData[0]["level_zero_average"];

    // Remove Data
    this.averageBarChartFive.data.datasets[0].data = [];
    this.averageBarChartFive.data.datasets[1].data = [];
    this.averageBarChartFive.data.datasets[0].backgroundColor = [];
    this.averageBarChartFive.data.datasets[1].backgroundColor = [];
    this.averageBarChartFive.update();
    //

    // Update Chart with new data
    this.averageBarChartFive.data.datasets[0].data.push(currentLevelZeroValue);
    this.averageBarChartFive.data.datasets[1].data.push(
      currentLevelZeroAverage
    );
    this.averageBarChartFive.data.datasets[0].backgroundColor = "#32A9D9";
    this.averageBarChartFive.data.datasets[1].backgroundColor =
      "rgba(46, 78, 100, 1)";

    this.averageBarChartFive.update();
  }
}

export const charts = new Charts();
