import { registerUser } from "./services/auth.js";
      

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let nameInput = document.getElementById("nameInput");
let cnpInput = document.getElementById("cnpInput");
let birthdayInput = document.getElementById("birthdayInput");
let genderInput = document.getElementById("genderInput");
let deviceIdInput = document.getElementById("deviceIdInput");

let RegisterUser = evt => {
    evt.preventDefault();
    //try to register with a new user
    registerUser(emailInput.value, passwordInput.value, nameInput.value,
        cnpInput.value, birthdayInput.value, genderInput.value, deviceIdInput.value)
        .then(user => {
            alert("User registered successfully!");
        })
        .catch(error => {
            alert(error.message);
        });
};


MainForm.addEventListener("submit",RegisterUser);