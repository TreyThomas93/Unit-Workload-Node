import { http } from "./http.js";
import { charts } from "./charts.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const master = new Master();

  master.fetchLiveWorkload();

  master.fetchSystem();

  setInterval(() => {

  }, 100)
});

class Master {
  constructor() {
    this.charts = charts;
    this.max_threshold = 1;
  }

  timeDifference(time) {
    let bool;

    const [newTime, modifier] = new Date().toLocaleTimeString().split(" ");

    let [hours, minutes] = newTime.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    let time_start = new Date();
    let time_end = new Date();

    const value_start = time.split(":");
    const value_end = `${hours}:${minutes}`.split(":");

    time_start.setHours(value_start[0], value_start[1], 0);
    time_end.setHours(value_end[0], value_end[1], 0);

    let diff = (time_end - time_start) / 1000;

    // 5 minutes
    if (diff >= 300) {
      bool = true;
    } else {
      bool = false;
    }

    return bool;
  }

  // Fetches live workload data
  fetchLiveWorkload() {
    http
      .get(`/live_workload`)
      .then((data) => {
        const { responseData, responseStatus } = data;

        const updatedAt = responseData[0].updated_at;

        let outdated = this.timeDifference(updatedAt);

        let fontColor;

        if (outdated) {
          fontColor = "red";
          alert("[OUTDATED DATA]");
        } else {
          this.charts.liveWorkloadData(responseData);
          this.systemCards(responseData);
          this.workloadTables(responseData);
          this.crewList(responseData);
          fontColor = "yellow";
        }

        let updateAtElement = document.querySelector("#updated-at");

        updateAtElement.style.color = fontColor;
        updateAtElement.textContent = updatedAt;
      })
      .catch((err) => console.log(err));
  }

  // Fetches system averages data
  fetchSystem() {
    http
      .get(`/system_report`)
      .then((data) => {
        const { responseData, responseStatus } = data;

        if (responseData[0]["valid"]) {
          let logOutput = "";

          let systemLog = responseData[0]["systemLog"];

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

          this.charts.averageBarChartOneData(responseData);
          this.charts.averageBarChartTwoData(responseData);
          this.charts.averageBarChartThreeData(responseData);
          this.charts.averageBarChartFourData(responseData);
          this.charts.averageBarChartFiveData(responseData);

          document.querySelector("#status").style.color = "yellow";
          document.querySelector("#status").textContent = "Valid";
        } else {
          document.querySelector("#status").style.color = "red";
          document.querySelector("#status").textContent = "Invalid";
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
      let task_time;
      if (arrivals !== 0) {
        task_time = (unit.task_time / arrivals).toFixed();
      } else {
        task_time = unit.task_time;
      }
      const post_time = this.formatTime(unit.post_time);
      const post_assignments = unit.post_assignments;
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
            <td>${post_assignments}</td>
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
            <td>${post_assignments}</td>
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
            <td>${post_assignments}</td>
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

  crewList(data) {
    let crews = "";
    let total = 0;

    data.sort(function (a, b) {
      return a["unit"] - b["unit"];
    });

    data.forEach((crew) => {
      let unit = crew["unit"];
      let crewOne = crew["crew_member_one"];
      let crewTwo = crew["crew_member_two"];
      total += 1;

      crews += `

        <tr>
          <td>${unit}</td>
          <td>${crewOne}</td>
          <td>${crewTwo}</td>
        </tr>

      `;
    });

    document.querySelector("#crew-list-tbody").innerHTML = crews;
    document.querySelector("#total-crews").textContent = total;
  }
}


