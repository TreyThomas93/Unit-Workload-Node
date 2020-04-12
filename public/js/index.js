import { http } from "./http.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const workload = new unitWorkload();

  workload.fetchWorkload();
  workload.fetchReport();

  workload.createWorkloadChart();

  const resetNum = 600;
  let num = 0;
  setInterval(() => {
    num++;
    document.querySelector("#load-bar-inner").style.width = `${
      (num / resetNum) * 100
    }%`;
    if (num === resetNum) {
      num = 0;
      workload.fetchWorkload();
      workload.fetchReport();
    }
  }, 100);
});

class unitWorkload {
  constructor() {
    this.max_threshold = 1;
    this.barChart;
    this.lineChart;
  }

  timeDifference(time) {
    let bool;

    let time_start = new Date();
    let time_end = new Date();

    const value_start = time.split(":");
    const value_end = new Date().toLocaleTimeString().split(":");

    time_start.setHours(value_start[0], value_start[1], 0);
    time_end.setHours(value_end[0], value_end[1], 0);

    let diff = (time_end - time_start) / 1000;

    if (diff >= 120) {
      bool = true;
    } else {
      bool = false;
    }

    return bool;
  }

  fetchWorkload() {
    http
      .get(`/live_workload`)
      .then((data) => {
        const { responseData, responseStatus } = data;

        this.systemCards(responseData);

        this.workloadTables(responseData);

        this.workloadChart(responseData);

        const updatedAt = responseData[0].updated_at;

        const bool = this.timeDifference(updatedAt);

        let fontColor;

        if (bool) {
          fontColor = "red";
        } else {
          fontColor = "yellow";
        }

        let updateAtElement = document.querySelector("#updated-at");

        updateAtElement.style.color = fontColor;
        updateAtElement.textContent = updatedAt;
      })
      .catch((err) => console.log(err));
  }

  fetchReport() {
    http
      .get(`/system_report`)
      .then((data) => {
        const { responseData, responseStatus } = data;

        if (responseStatus === 200) {
          this.systemReport(responseData);
        }
      })
      .catch((err) => console.log(err));
  }

  systemCards(data) {
    let onCall = 0;
    let posting = 0;
    let driving = 0;
    let fueling = 0;
    let eos = 0;
    let lateCall = 0;
    let pastEOS = 0;
    let sos = 0;

    data.forEach((unit) => {
      let status = unit.status;

      if (status === "On Call") {
        onCall++;
      } else if (status === "Posting") {
        posting++;
      } else if (status === "Driving") {
        driving++;
      } else if (status === "Fueling") {
        fueling++;
      } else if (status === "EOS") {
        eos++;
      } else if (status === "Late Call") {
        lateCall++;
      } else if (status === "Past EOS") {
        pastEOS++;
      } else if (status === "SOS") {
        sos++;
      }
    });

    let level = posting + driving + sos;

    onCall = onCall + lateCall;

    document.querySelector("#level-count").textContent = level;
    document.querySelector("#on-call-count").textContent = onCall;
    document.querySelector("#posting-count").textContent = posting;
    document.querySelector("#driving-count").textContent = driving;
    document.querySelector("#fueling-count").textContent = fueling;
    document.querySelector("#eos-count").textContent = eos;
    document.querySelector("#late-call-count").textContent = lateCall;
    document.querySelector("#past-eos-count").textContent = pastEOS;

    if (level === 0) {
      document.querySelector("#level").style.backgroundColor = "red";
    } else {
      document.querySelector("#level").style.backgroundColor = "var(--primary)";
    }

    if (lateCall > 0) {
      document.querySelector("#late-call").style.backgroundColor = "red";
    } else {
      document.querySelector("#late-call").style.backgroundColor =
        "var(--primary)";
    }

    if (pastEOS > 0) {
      document.querySelector("#past-eos").style.backgroundColor = "red";
    } else {
      document.querySelector("#past-eos").style.backgroundColor =
        "var(--primary)";
    }
  }

  formatTime(int) {
    let hours = Math.floor(int / 60);
    let minutes = int % 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return hours + ":" + minutes;
  }

  workloadTables(data) {
    data.sort(function (a, b) {
      return b.workload - a.workload;
    });

    let maxOutput = "";
    let currentOutput = "";
    let otherOutput = "";

    let total_above_max = 0;
    let total_above_current = 0;
    let total_other = 0;

    data.forEach((unit) => {
      const unit_number = unit.unit;
      const workload = unit.workload;
      const threshold = unit.threshold;
      const arrivals = unit.arrivals;
      const task_time = (unit.task_time / arrivals).toFixed();
      const post_time = this.formatTime(unit.post_time);
      const drive_time = this.formatTime(unit.drive_time);
      const on_call_time = this.formatTime(unit.on_call_time);
      const last_post = unit.last_post;
      const status = unit.status;

      const ratio = (workload - threshold).toFixed(2);

      let backgroundColor;
      let color;

      if (threshold >= 0.83 && threshold < 0.92) {
        (backgroundColor = "lightblue"), (color = "black");
      } else if (threshold >= 0.92 && threshold < 1) {
        (backgroundColor = "lightgreen"), (color = "black");
      } else if (threshold >= 1) {
        (backgroundColor = "red"), (color = "white");
      } else {
        (backgroundColor = "none"), (color = "white");
      }

      if (workload >= this.max_threshold) {
        total_above_max++;

        maxOutput += `
        
          <tr style='background-color: ${backgroundColor}; color: ${color}'>  
            <td>${unit_number}</td>
            <td>${workload}</td>
            <td>${threshold}</td>
            <td>${ratio}</td>
            <td>${arrivals}</td>
            <td>${task_time}</td>
            <td>${post_time}</td>
            <td>${drive_time}</td>
            <td>${on_call_time}</td>
            <td>${last_post}</td>
            <td>${status}</td>
          </tr>
        
        `;
      } else if (workload < this.max_threshold && workload > threshold) {
        total_above_current++;

        currentOutput += `
        
          <tr style='background-color: ${backgroundColor}; color: ${color}'>  
            <td>${unit_number}</td>
            <td>${workload}</td>
            <td>${threshold}</td>
            <td>${ratio}</td>
            <td>${arrivals}</td>
            <td>${task_time}</td>
            <td>${post_time}</td>
            <td>${drive_time}</td>
            <td>${on_call_time}</td>
            <td>${last_post}</td>
            <td>${status}</td>
          </tr>
        
        `;
      } else {
        total_other++;

        otherOutput += `
        
          <tr style='background-color: ${backgroundColor}; color: ${color}'>  
            <td>${unit_number}</td>
            <td>${workload}</td>
            <td>${threshold}</td>
            <td>${ratio}</td>
            <td>${arrivals}</td>
            <td>${task_time}</td>
            <td>${post_time}</td>
            <td>${drive_time}</td>
            <td>${on_call_time}</td>
            <td>${last_post}</td>
            <td>${status}</td>
          </tr>
        
        `;
      }
    });

    document.querySelector("#above-max-tbody").innerHTML = maxOutput;
    document.querySelector("#above-current-tbody").innerHTML = currentOutput;
    document.querySelector("#other-tbody").innerHTML = otherOutput;

    document.querySelector("#total-above-max").textContent = total_above_max;
    document.querySelector(
      "#total-above-current"
    ).textContent = total_above_current;
    document.querySelector("#total-other").textContent = total_other;
  }

  createWorkloadChart() {
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

    this.barChart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });
  }

  workloadChart(data) {
    // Remove Data
    this.barChart.data.labels = [];
    this.barChart.data.datasets[0].data = [];
    this.barChart.data.datasets[1].data = [];
    this.barChart.data.datasets[2].data = [];
    this.barChart.data.datasets[0].backgroundColor = [];
    this.barChart.data.datasets[1].backgroundColor = [];
    this.barChart.update();
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
        this.barChart.data.labels.includes(unit) !== true &&
        unit !== undefined
      ) {
        if (current_workload >= 1) {
          this.barChart.data.datasets[1].backgroundColor.push("red");
          this.barChart.data.datasets[0].backgroundColor.push("#2E4E64");
        } else if (current_workload > current_threshold) {
          this.barChart.data.datasets[1].backgroundColor.push("yellow");
          this.barChart.data.datasets[0].backgroundColor.push("#2E4E64");
        } else {
          this.barChart.data.datasets[1].backgroundColor.push("#32A9D9");
          this.barChart.data.datasets[0].backgroundColor.push(
            "rgba(46, 78, 100, 0.8)"
          );
        }

        if (current_workload < 0) {
          current_workload = 0;
        }
      }

      // Update Chart with new data
      this.barChart.data.labels.push(unit);
      this.barChart.data.datasets[0].data.push(current_threshold);
      this.barChart.data.datasets[1].data.push(current_workload);
      this.barChart.data.datasets[2].data.push(1);
      this.barChart.update();
    });
  }

  timeConvert(num) {
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (rminutes < 10) {
      rminutes = `0${rminutes}`;
    }
    return rhours + ":" + rminutes;
  }

  systemReport(report) {
    let logOutput = "";
  
    let systemLog = report[0]["systemLog"];

    systemLog.forEach((log) => {
      logOutput += `
        <li>${log["log"]} [Driving: ${log["driving"]} - Posting: ${log["posting"]} - Level: ${log["level"]}]</li>
      `;
    });

    if (logOutput === "") {
      logOutput = "No Events Logged";
    }

    document.querySelector("#system-log").innerHTML = logOutput;

    // Autoscroll to bottom of ul
    const element = document.querySelector("#system-log");
    element.scrollTop = element.scrollHeight - element.clientHeight;

    let accumulated_calls = report[0]["accumulated_calls"];
    let accumulated_post_time = report[0]["accumulated_post_time"];
    let accumulated_units = report[0]["accumulated_units"];
    let accumulated_drive_time = report[0]["accumulated_drive_time"];
    let accumulated_on_call_time = report[0]["accumulated_on_call_time"];
    let accumulated_late_calls = report[0]["accumulated_late_calls"];
    let accumulated_past_eos = report[0]["accumulated_past_eos"];
    let accumulated_level_zero = report[0]["accumulated_level_zero"];

    document.querySelector("#total-calls").textContent = accumulated_calls;
    document.querySelector("#total-post-time").textContent = this.timeConvert(
      accumulated_post_time
    );
    document.querySelector("#total-units").textContent = accumulated_units;
    document.querySelector("#total-drive-time").textContent = this.timeConvert(
      accumulated_drive_time
    );
    document.querySelector(
      "#total-on-call-time"
    ).textContent = this.timeConvert(accumulated_on_call_time);
    document.querySelector(
      "#total-late-calls"
    ).textContent = accumulated_late_calls;
    document.querySelector(
      "#total-past-eos"
    ).textContent = accumulated_past_eos;
    document.querySelector(
      "#total-time-level-zero"
    ).textContent = this.timeConvert(accumulated_level_zero);
  }
}


