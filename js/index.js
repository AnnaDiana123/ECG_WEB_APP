import { signInUser } from "./services/auth.js";

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");

let SignInUser = evt => {
    evt.preventDefault();
    signInUser(emailInput.value, passwordInput.value)
        .then(user => {
            if (user.uid == 'lCZHCUs76gXGS5dEfYiWZQNdp5G2') {
                window.location.href = "adminHome.html";
            } else {
                window.location.href = "userHome.html";
            }
        })
        .catch(error => {
            alert(error.message);
            console.log(error.code, error.message);
        });
};

MainForm.addEventListener('submit',SignInUser);