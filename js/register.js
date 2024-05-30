import { registerUser } from "./services/auth.js";
      

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let nameInput = document.getElementById("nameInput");
let cnpInput = document.getElementById("cnpInput");
let deviceIdInput = document.getElementById("deviceIdInput");

let RegisterUser = evt => {
    evt.preventDefault();
    //try to register with a new user
    registerUser(emailInput.value, passwordInput.value, nameInput.value, cnpInput.value, deviceIdInput.value)
        .then(user => {
            alert('User registered successfully!');
        })
        .catch(error => {
            alert(error.message);
            console.log(error.code, error.message);
        });
};


MainForm.addEventListener('submit',RegisterUser);