import { http } from "./http.js";
import { charts } from "./charts.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const master = new Master();

  master.fetchLiveWorkload();

  master.fetchSystem();

  master.promptLoadWindow();

  const resetNum = 600;
  let num = 0;
  setInterval(() => {
    num++;
    document.querySelector("#load-bar-inner").style.width = `${
      (num / resetNum) * 100
    }%`;
    if (num === resetNum) {
      num = 0;

      master.promptLoadWindow();

      master.fetchLiveWorkload();

      master.fetchSystem();
    }
  }, 100);

  document.body.addEventListener("click", (e) => {
    let name = e.target.className;
    if (name === "load-screen") {
      master.removeLoadWindow();
    }

    if (e.target.className === "view-button") {
      let row = e.target.parentNode.parentNode;

      let output = "";

      let textArray = [];

      if (row.className === "workload-row") {
        if (document.querySelector(".workload-table-popup-container")) {
          master.removePopUp();
        }

        row.childNodes.forEach((data) => {
          let text = data.textContent;

          if (text.trim() !== "") {
            textArray.push(text);
          }
        });

        // let windowWidth = screen.width;
        let windowWidth = window.innerWidth;

        if (windowWidth < 1080) {
          output = `

            <button class="exit-popup">Exit</button>
            <table>
              <tbody>
                <tr>
                  <td>Unit</td>
                  <td>${textArray[0]}</td>
                </tr>
                <tr>
                  <td>Workload</td>
                  <td>${textArray[1]}</td>
                </tr>
                <tr>
                  <td>Threshold</td>
                  <td>${textArray[2]}</td>
                </tr>
                <tr>
                  <td>Crew Member One</td>
                  <td>${textArray[3]}</td>
                </tr>
                <tr>
                  <td>Crew Member Two</td>
                  <td>${textArray[4]}</td>
                </tr>
                <tr>
                  <td>Ratio</td>
                  <td>${textArray[5]}</td>
                </tr>
                <tr>
                  <td>Arrivals</td>
                  <td>${textArray[6]}</td>
                </tr>
                <tr>
                  <td>Task Time</td>
                  <td>${textArray[7]}</td>
                </tr>
                <tr>
                  <td>Post Time</td>
                  <td>${textArray[8]}</td>
                </tr>
                <tr>
                  <td>Post Assignments</td>
                  <td>${textArray[9]}</td>
                </tr>
                <tr>
                  <td>Drive Time</td>
                  <td>${textArray[10]}</td>
                </tr>
                <tr>
                  <td>On Call Time</td>
                  <td>${textArray[11]}</td>
                </tr>
                <tr>
                  <td>Last Post</td>
                  <td>${textArray[12]}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>${textArray[13]}</td>
                </tr>
              </tbody>
            </table>
          
          `;

          master.promptPopUp(output);
        } else {
          output = `

            <button class="exit-popup">Exit</button>
            <table>
              <thead>
                <th>Unit</th>
                <th>Workload</th>
                <th>Threshold</th>
                <th>Crew Member One</th>
                <th>Crew Member Two</th>
                <th>Ratio</th>
                <th>Arrivals</th>
                <th>Task Time</th>
                <th>Post Time</th>
                <th>Post Assignments</th>
                <th>Drive Time</th>
                <th>On Call Time</th>
                <th>Last Post</th>
                <th>Status</th>
              </thead>
              <tbody>
                <tr>
                  <td>${textArray[0]}</td>
                  <td>${textArray[1]}</td>
                  <td>${textArray[2]}</td>
                  <td>${textArray[3]}</td>
                  <td>${textArray[4]}</td>
                  <td>${textArray[5]}</td>
                  <td>${textArray[6]}</td>
                  <td>${textArray[7]}</td>
                  <td>${textArray[8]}</td>
                  <td>${textArray[9]}</td>
                  <td>${textArray[10]}</td>
                  <td>${textArray[11]}</td>
                  <td>${textArray[12]}</td>
                  <td>${textArray[13]}</td>
                </tr>
              </tbody>
            </table>
          
          `;

          master.promptPopUp(output);
        }
      }
    }

    if (e.target.className === "exit-popup") {
      master.removePopUp();
    }
  });
});

class Master {
  constructor() {
    this.charts = charts;
    this.max_threshold = 1;

    this.notified = true;
    this.oldCount = 0;

    this.screenWidth = screen.width;
  }

  promptLoadWindow() {
    let loadScreen = document.createElement("div");

    loadScreen.className = "load-screen";

    loadScreen.innerHTML = `
      <div>
        <h1>Loading</h1>
      </div>
    `;

    document.querySelector("html").style.overflowY = "hidden";

    document.body.appendChild(loadScreen);
  }

  removeLoadWindow() {
    document.querySelector(".load-screen").remove();

    document.querySelector("html").style.overflowY = "auto";
  }

  promptNotificationTab(notification) {
    let notificationTab = document.createElement("div");

    notificationTab.className = "notification-tab";

    notificationTab.innerHTML = `<div></div>`;

    document.body.appendChild(notificationTab);

    const width = 100;
    let counter = 0;
    let getWidth = setInterval(() => {
      counter++;

      if (counter === width) {
        clearInterval(getWidth);
        document.querySelector(".notification-tab > div").innerHTML = `
        <h5>${notification}</h5>
      `;

        setTimeout(() => {
          document.querySelector(".notification-tab > div").innerHTML = "";
          this.removeNotificationTab();
        }, 5000);
      }

      if (document.querySelector(".notification-tab") !== null) {
        document.querySelector(
          ".notification-tab > div"
        ).style.width = `${counter}%`;
      }
    }, 1);
  }

  removeNotificationTab() {
    const width = 0;
    let counter = 100;
    let getWidth = setInterval(() => {
      counter--;

      if (counter === width) {
        clearInterval(getWidth);
        document.querySelector(".notification-tab").remove();
      }

      if (document.querySelector(".notification-tab") !== null) {
        document.querySelector(
          ".notification-tab > div"
        ).style.width = `${counter}%`;
      }
    }, 1);
  }

  promptPopUp(content) {
    let popup = document.createElement("div");

    popup.className = "workload-table-popup-container";

    popup.innerHTML = `
      <div class="workload-table-popup">
        ${content}
      </div>
    `;

    document.body.appendChild(popup);
  }

  removePopUp() {
    document.querySelector(".workload-table-popup-container").remove();
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

    let diff = Math.abs((time_end - time_start) / 1000);

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

        if (document.querySelector(".load-screen") !== null) {
          this.removeLoadWindow();
        }

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

        if (responseData.length != 0) {
          if (responseData[0]["valid"]) {
            // get number of list items in system and compare to new data amount.
            // If more data amount, then trigger notification alarm.

            let logOutput = "";

            let systemLog = responseData[0]["logs"];

            let newCount = 0;
            systemLog.forEach((log) => {
              newCount++;

              logOutput += `
                <li>${log["log"]} [Driving: ${log["driving"]} - Posting: ${log["posting"]} - Level: ${log["level"]}]</li>
              `;
            });

            if (logOutput === "") {
              logOutput = "No Events Logged";
            }

            document.querySelector("#system-log").innerHTML = logOutput;

            let result = Math.abs(newCount - this.oldCount);

            if (result >= 1 && !this.notified) {
              this.oldCount = newCount;
              let latest = document.querySelector("#system-log > li:last-child")
                .textContent;

              let refined = latest.substring(0, latest.indexOf("["));

              refined = refined.split("-")[0];

              if (this.screenWidth > 1080) {
                this.promptNotificationTab(refined);
              }

              // alert tone
              const audio = new Audio("audio/notification.mp3");
              audio.play();
            } else {
              this.notified = false;
              this.oldCount = newCount;
            }

            // Autoscroll to bottom of ul
            const element = document.querySelector("#system-log");
            element.scrollTop = element.scrollHeight - element.clientHeight;

            // Display Weekly Off On Time
            document.querySelector("#off-on-time").textContent =
              responseData[0]["weekly_off_on_time"]["percentage"] + "%";

            document.querySelector("#daterange").textContent =
              responseData[0]["weekly_off_on_time"]["daterange"];

            this.charts.unitChartData(responseData);
            this.charts.callChartData(responseData);
            this.charts.onCallChartData(responseData);
            this.charts.postTimeChartData(responseData);
            this.charts.driveTimeChartData(responseData);
            this.charts.taskTimeChartData(responseData);
            this.charts.postAssignmentsChartData(responseData);
            this.charts.eventChartData(responseData);

            document.querySelector("#status").style.color = "yellow";
            document.querySelector("#status").textContent = "Valid";
          } else {
            document.querySelector("#status").style.color = "red";
            document.querySelector("#status").textContent = "Invalid";
          }
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
      const crew_member_one = unit.crew_member_one;
      const crew_member_two = unit.crew_member_two;
      let task_time;
      if (arrivals !== 0) {
        task_time = (unit.task_time / arrivals).toFixed();
      } else {
        task_time = unit.task_time;
      }
      const post_time = this.formatTime(unit.post_time);
      const post_assignments = unit.post_assignments;
      const drive_time = this.formatTime(unit.drive_time);
      const on_call_time = this.formatTime(unit.task_time);
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
        
          <tr class="workload-row" style='background-color: ${backgroundColor}; color: ${color}'>  
            <td>${unit_number}</td>
            <td>${workload}</td>
            <td>${threshold}</td>
            <td style="display: none;">${crew_member_one}</td>
            <td style="display: none;">${crew_member_two}</td>
            <td style="display: none;">${ratio}</td>
            <td style="display: none;">${arrivals}</td>
            <td style="display: none;">${task_time}</td>
            <td style="display: none;">${post_time}</td>
            <td style="display: none;">${post_assignments}</td>
            <td style="display: none;">${drive_time}</td>
            <td style="display: none;">${on_call_time}</td>
            <td style="display: none;">${last_post}</td>
            <td style="display: none;">${status}</td>
            <td><button class="view-button">View</button></td>
          </tr>
        
        `;
      } else if (workload < this.max_threshold && workload > threshold) {
        total_above_current++;

        currentOutput += `
        
          <tr class="workload-row" style='background-color: ${backgroundColor}; color: ${color}'>  
            <td>${unit_number}</td>
            <td>${workload}</td>
            <td>${threshold}</td>
            <td style="display: none;">${crew_member_one}</td>
            <td style="display: none;">${crew_member_two}</td>
            <td style="display: none;">${ratio}</td>
            <td style="display: none;">${arrivals}</td>
            <td style="display: none;">${task_time}</td>
            <td style="display: none;">${post_time}</td>
            <td style="display: none;">${post_assignments}</td>
            <td style="display: none;">${drive_time}</td>
            <td style="display: none;">${on_call_time}</td>
            <td style="display: none;">${last_post}</td>
            <td style="display: none;">${status}</td>
            <td><button class="view-button">View</button></td>
          </tr>
        
        `;
      } else {
        total_other++;

        otherOutput += `
        
          <tr class="workload-row" style='background-color: ${backgroundColor}; color: ${color}'>  
            <td>${unit_number}</td>
            <td>${workload}</td>
            <td>${threshold}</td>
            <td style="display: none;">${crew_member_one}</td>
            <td style="display: none;">${crew_member_two}</td>
            <td style="display: none;">${ratio}</td>
            <td style="display: none;">${arrivals}</td>
            <td style="display: none;">${task_time}</td>
            <td style="display: none;">${post_time}</td>
            <td style="display: none;">${post_assignments}</td>
            <td style="display: none;">${drive_time}</td>
            <td style="display: none;">${on_call_time}</td>
            <td style="display: none;">${last_post}</td>
            <td style="display: none;">${status}</td>
            <td><button class="view-button">View</button></td>
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
