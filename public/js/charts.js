class Charts {
  constructor() {
    this.liveWorkloadBarChart;
    this.unitChart;
    this.callChart;
    this.onCallChart;
    this.postTimeChart;
    this.driveTimeChart;
    this.eventChart;

    this.createLiveWorkloadBarChart();

    this.chartGenerator("#unit-chart", "Hour", "units", "Units");
    this.chartGenerator("#calls-chart", "Hour", "calls", "Calls");
    this.chartGenerator(
      "#on-call-time-chart",
      "Hour",
      "on-call-time",
      "On Call Time"
    );
    this.chartGenerator("#post-time-chart", "Hour", "post-time", "Post Time");
    this.chartGenerator(
      "#drive-time-chart",
      "Hour",
      "drive-time",
      "Drive Time"
    );

    this.createEventChart();
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

  // Generate Line Charts
  chartGenerator(element, xLabel, yLabel, title) {
    try {
      const ctx = document.querySelector(element).getContext("2d");

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
            borderWidth: 2,
            spanGaps: true,
          },
          {
            label: "Today",
            backgroundColor: [],
            data: [],
            fill: false,
            borderColor: "blue",
            pointRadius: 0,
            borderWidth: 2,
            spanGaps: true,
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
                display: true,
                labelString: xLabel,
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
                labelString: yLabel,
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
          text: title,
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

      if (title === "Units") {
        this.unitChart = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: chartOptions,
        });
      } else if (title === "Calls") {
        this.callChart = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: chartOptions,
        });
      } else if (title === "On Call Time") {
        this.onCallChart = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: chartOptions,
        });
      } else if (title === "Post Time") {
        this.postTimeChart = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: chartOptions,
        });
      } else if (title === "Drive Time") {
        this.driveTimeChart = new Chart(ctx, {
          type: "line",
          data: chartData,
          options: chartOptions,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  unitChartData(responseData) {
    try {
      // Remove Data
      this.unitChart.data.labels = [];
      this.unitChart.data.datasets[1].data = [];
      this.unitChart.data.datasets[0].data = [];
      this.unitChart.data.datasets[0].backgroundColor = [];
      this.unitChart.data.datasets[1].backgroundColor = [];
      this.unitChart.update();

      let averages = responseData[0]["hourly"]["unit"];

      averages.forEach((average) => {
        // Update Chart with new data
        this.unitChart.data.labels.push(average["time"]);
        this.unitChart.data.datasets[0].data.push(average["average"]);
        // if (average["today"] === null) {
        //   this.unitChart.data.datasets[1].data.push(Number.NaN);
        // } else {
        //   this.unitChart.data.datasets[1].data.push(average["today"]);
        // }
        this.unitChart.data.datasets[1].data.push(average["today"]);

        this.unitChart.update();
      });
    } catch (err) {
      console.log(err);
    }
  }

  callChartData(responseData) {
    try {
      // Remove Data
      this.callChart.data.labels = [];
      this.callChart.data.datasets[1].data = [];
      this.callChart.data.datasets[0].data = [];
      this.callChart.data.datasets[0].backgroundColor = [];
      this.callChart.data.datasets[1].backgroundColor = [];
      this.callChart.update();

      let averages = responseData[0]["hourly"]["call"];

      averages.forEach((average) => {
        // Update Chart with new data
        this.callChart.data.labels.push(average["time"]);
        this.callChart.data.datasets[0].data.push(average["average"]);
        this.callChart.data.datasets[1].data.push(average["today"]);

        this.callChart.update();
      });
    } catch (err) {
      console.log(err);
    }
  }

  onCallChartData(responseData) {
    try {
      // Remove Data
      this.onCallChart.data.labels = [];
      this.onCallChart.data.datasets[1].data = [];
      this.onCallChart.data.datasets[0].data = [];
      this.onCallChart.data.datasets[0].backgroundColor = [];
      this.onCallChart.data.datasets[1].backgroundColor = [];
      this.onCallChart.update();

      let averages = responseData[0]["hourly"]["on_call_time"];

      averages.forEach((average) => {
        // Update Chart with new data
        this.onCallChart.data.labels.push(average["time"]);
        this.onCallChart.data.datasets[0].data.push(average["average"]);
        this.onCallChart.data.datasets[1].data.push(average["today"]);

        this.onCallChart.update();
      });
    } catch (err) {
      console.log(err);
    }
  }

  postTimeChartData(responseData) {
    try {
      // Remove Data
      this.postTimeChart.data.labels = [];
      this.postTimeChart.data.datasets[1].data = [];
      this.postTimeChart.data.datasets[0].data = [];
      this.postTimeChart.data.datasets[0].backgroundColor = [];
      this.postTimeChart.data.datasets[1].backgroundColor = [];
      this.postTimeChart.update();

      let averages = responseData[0]["hourly"]["post_time"];

      averages.forEach((average) => {
        // Update Chart with new data
        this.postTimeChart.data.labels.push(average["time"]);
        this.postTimeChart.data.datasets[0].data.push(average["average"]);
        this.postTimeChart.data.datasets[1].data.push(average["today"]);

        this.postTimeChart.update();
      });
    } catch (err) {
      console.log(err);
    }
  }

  driveTimeChartData(responseData) {
    try {
      // Remove Data
      this.driveTimeChart.data.labels = [];
      this.driveTimeChart.data.datasets[1].data = [];
      this.driveTimeChart.data.datasets[0].data = [];
      this.driveTimeChart.data.datasets[0].backgroundColor = [];
      this.driveTimeChart.data.datasets[1].backgroundColor = [];
      this.driveTimeChart.update();

      let averages = responseData[0]["hourly"]["drive_time"];

      averages.forEach((average) => {
        // Update Chart with new data
        this.driveTimeChart.data.labels.push(average["time"]);
        this.driveTimeChart.data.datasets[0].data.push(average["average"]);
        this.driveTimeChart.data.datasets[1].data.push(average["today"]);

        this.driveTimeChart.update();
      });
    } catch (err) {
      console.log(err);
    }
  }

  createEventChart() {
    const ctx = document.querySelector("#event-chart").getContext("2d");

    let chartData = {
      datasets: [
        {
          pointRadius: [],
          pointStyle: "triangle",
          fill: false,
          pointBackgroundColor: [],
          data: [],
        },
        {
          label: "Level Zero",
          backgroundColor: "orange",
        },
        {
          label: "Above Current Threshold",
          backgroundColor: "yellow",
        },
        {
          label: "Above Max Threshold",
          backgroundColor: "red",
        },
        {
          label: "Late Call",
          backgroundColor: "blue",
        },
        {
          label: "Past EOS",
          backgroundColor: "green",
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
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: true,
              labelString: "",
              fontColor: "white",
              fontSize: 15,
            },
            type: "time",
            time: {
              unit: "hour",

              displayFormats: {
                hour: "HH:mm",
              },
            },
            position: "bottom",
          },
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              fontSize: 12,
              beginAtZero: true,
              fontColor: "white",
              max: 10,
              display: false,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.25)",
            },
            scaleLabel: {
              display: false,
              labelString: "",
              fontColor: "white",
              fontSize: 15,
            },
          },
        ],
      },
      spanGaps: true,
      animation: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      title: {
        display: true,
        text: "Events",
        fontSize: 15,
        fontColor: "white",
      },
      legend: {
        display: true,
        labels: {
          filter: function (item, chart) {
            // Logic to remove a particular legend item goes here
            return (
              item.text == null || !item.text.includes(["Events", undefined])
            );
          },
          fontColor: "white",
        },
      },
      tooltips: {
        enabled: true,
        mode: "single",
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[0].label[tooltipItem.index - 1];
            return label;
          },
        },
      },
    };

    this.eventChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: chartOptions,
    });
  }

  eventChartData(responseData) {
    // Remove Data
    this.eventChart.data.labels = [];
    this.eventChart.data.datasets[0].data = [];
    this.eventChart.data.datasets[0].pointRadius = [];
    this.eventChart.data.datasets[0].label = [];
    this.eventChart.data.datasets[0].pointBackgroundColor = [];
    this.eventChart.update();

    let times = responseData[0]["logs"].map((log) => {
      let time = log["log"].split("-")[1];
      let event = log["log"].split("-")[0].trim();
      // this.eventChart.data.datasets[0].label.push(event);

      let splitEvent = event.split(" ")[0];

      let color;
      let sep = event.split(" ");
      let text;

      if (splitEvent == "Unit") {
        if (sep.length === 5) {
          text = sep[2] + " " + sep[3] + " " + sep[4];
        } else {
          text = sep[2] + " " + sep[3];
        }

        if (text === "Above Current Threshold") {
          color = "yellow";
        } else if (text === "Above Max Threshold") {
          color = "red";
        } else if (text === "Received Late Call") {
          color = "blue";
        } else if (text === "Past EOS") {
          color = "green";
        }
      } else if (event === "System is Level Zero") {
        color = "red";
      }

      this.eventChart.data.datasets[0].pointBackgroundColor.push(color);

      return { x: moment(time, "HH:mm:ss"), y: 5 };
    });

    times.unshift({ x: moment("00:00:00", "HH:mm:ss"), y: 5 });
    times.push({ x: moment("23:00:00", "HH:mm:ss"), y: 5 });

    this.eventChart.data.datasets[0].pointBackgroundColor.unshift("red");
    this.eventChart.data.datasets[0].pointBackgroundColor.push("red");

    times.forEach((time) => {
      this.eventChart.data.datasets[0].data.push(time);
      this.eventChart.data.datasets[0].pointRadius.push(10);
    });

    this.eventChart.data.datasets[0].pointRadius[0] = 0;
    this.eventChart.data.datasets[0].pointRadius[
      this.eventChart.data.datasets[0].pointRadius.length - 1
    ] = 0;

    this.eventChart.update();
  }
}

export const charts = new Charts();
