import { http } from "./http.js";

document.addEventListener("DOMContentLoaded", (e) => {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(savePosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function savePosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  http
    .post("/geolocation", { latitude, longitude })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
}
