//import functionalities
import { fetchUsersList } from "../services/dataServices.js";
import { signOut } from "../services/auth.js";

//array for storing the list of users
let users = [];

const checkCred = () => {
    if(!sessionStorage.getItem("user-creds"))
        window.location.href='index.html';
}

let currentPage = 0;
const itemsPerPage = 10;

function renderTable() {
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const pageUsers = users.slice(start, end);

  const tableBody = document.getElementById('userTableBody');
  tableBody.innerHTML = '';  // Clear the table

  for (const user of pageUsers) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = user.Name;
    row.appendChild(nameCell);

    const cnpCell = document.createElement('td');
    cnpCell.textContent = user.CNP;
    row.appendChild(cnpCell);

    const genderCell = document.createElement('td');
    genderCell.textContent = user.Gender;
    row.appendChild(genderCell);

    const birthdayCell = document.createElement('td');
    birthdayCell.textContent = user.Birthday;
    row.appendChild(birthdayCell);

    const deviceIdCell = document.createElement('td');
    deviceIdCell.textContent = user.DeviceId;
    row.appendChild(deviceIdCell);

    tableBody.appendChild(row);
  }
}

function nextPage() {
    const itemsDisplayed = (currentPage+1) * itemsPerPage;
    console.log(itemsDisplayed);
    console.log(users.length);
    if(itemsDisplayed < users.length){
        currentPage++;
        renderTable();
    }
    else
        alert('No more users to display!');
}

function prevPage(){
    if(currentPage > 0){
        currentPage--;
        renderTable();
    }
    else
        alert('No more users to display!');
}

//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', async () => {
    //vheck creds from session storage
    checkCred();

    // get buttons
    const signOutBtn= document.getElementById('signoutbutton');
    const nextBtn = document.getElementById('nextButton');
    const prevBtn = document.getElementById('prevButton');
    
    //add event listener to buttons
    signOutBtn.addEventListener('click', signOut);
    nextBtn.addEventListener('click', nextPage);
    prevBtn.addEventListener('click', prevPage);

    //fetch the users list
    users = await fetchUsersList();
    console.log(users);
    //initial render of the table
    renderTable();

});