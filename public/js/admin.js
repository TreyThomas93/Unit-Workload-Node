import { http } from "./http.js";

document.addEventListener("DOMContentLoaded", (e) => {
  const admin = new Admin();

  admin.fetchUsers();

  document.querySelector("tbody").addEventListener("click", (e) => {
    if (e.target.value === "Update") {
      const parent = e.target.parentNode.parentNode;

      const name = parent.childNodes[1].textContent;
      const username = parent.childNodes[3].textContent;
      const id = e.target.getAttribute("data-id");

      const updateAdd = document.querySelector("#update-add-users");

      updateAdd.childNodes[1].textContent = "Update User";

      updateAdd.querySelector("#update-add-form").action = `/admin/${id}?_method=PUT`;

      const inputs = updateAdd.querySelector("#update-add-form").childNodes;

      inputs[1].value = name;
      inputs[3].value = username;
    }
  });
});

class Admin {
  fetchUsers() {
    http
      .get(`/admin/users`)
      .then((data) => {
        const { responseData, responseStatus } = data;

        let output = "";

        responseData.forEach((user) => {
          let name = user.name;
          let username = user.username;
          let logins = user.logins;
          let id = user._id;

          if (logins === undefined) {
            logins = 0;
          }

          output += `
                <tr>
                    <td>${name}</td>
                    <td>${username}</td>
                    <td>${logins}</td>
                    <td><input type="submit" value="Update" class="update-from-table" data-id="${id}" /></td>
                    <td><form action="/admin/${id}?_method=DELETE" method="POST" ><input type="submit" class="delete-from-table" value="Delete" /></form></td>
                </tr>
            `;
        });

        document.querySelector("#display-users-tbody").innerHTML = output;
      })
      .catch((err) => console.log(err));
  }
}
