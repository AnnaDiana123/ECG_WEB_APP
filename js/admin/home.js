//import functionalities
import { fetchUsersList } from "../services/dataServices.js";
import { signOutUser, checkCred } from "../services/auth.js";

//array the list of users
let users = [];


let currentPage = 0;
const itemsPerPage = 10;

function renderTable() {
  //render 10 users per page
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const pageUsers = users.slice(start, end);

  const tableBody = document.getElementById("userTableBody");
  tableBody.innerHTML = "";  //clear table

  for (const user of pageUsers) {
    //create a row for the each user
    const row = document.createElement("tr");

    //create cells for properties
    const nameCell = document.createElement("td");
    nameCell.textContent = user.Name;
    row.appendChild(nameCell);

    const cnpCell = document.createElement("td");
    cnpCell.textContent = user.CNP;
    row.appendChild(cnpCell);

    const genderCell = document.createElement("td");
    genderCell.textContent = user.Gender;
    row.appendChild(genderCell);

    const birthdayCell = document.createElement("td");
    birthdayCell.textContent = user.Birthday;
    row.appendChild(birthdayCell);

    const deviceIdCell = document.createElement("td");
    deviceIdCell.textContent = user.DeviceId;
    row.appendChild(deviceIdCell);

    //add the row to the table
    tableBody.appendChild(row);
  }
}

function nextPage() {
    //get the items displayed
    const itemsDisplayed = (currentPage+1) * itemsPerPage;

    //check if there are more users for display
    if(itemsDisplayed < users.length){
        currentPage++;
        renderTable();
    }
    else
        alert("No more users to display!");
}

function prevPage(){
    //check if there are previous users to display
    if(currentPage > 0){
        currentPage--;
        renderTable();
    }
    else
        alert("No more users to display!");
}

//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
    //check creds from session storage
    checkCred();

    //get buttons
    const signOutBtn= document.getElementById("signoutbutton");
    const nextBtn = document.getElementById("nextButton");
    const prevBtn = document.getElementById("prevButton");
    
    //add event listener to buttons
    signOutBtn.addEventListener("click", signOutUser);
    nextBtn.addEventListener("click", nextPage);
    prevBtn.addEventListener("click", prevPage);

    //fetch the users list
    users = await fetchUsersList();

    //initial render of the table
    renderTable();

});