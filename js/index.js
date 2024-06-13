import { signInUser } from "./services/auth.js";
import { fetchUserData } from "./services/dataServices.js";

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");

let SignInUser = async (evt) => {
    evt.preventDefault();
    try {
        const user = await signInUser(emailInput.value, passwordInput.value);
        const uid = user.uid;

        //fetch user role from Firestore
        const userData = await fetchUserData(uid);
        if (userData) {
            const userRole = userData.Role;
            //redirect based on role
            if (userRole === "Admin") {
                window.location.href = "./html/admin/adminHome.html";
            } else if (userRole === "User") {
                window.location.href = "./html/user/userHome.html";
            } else {
                throw new Error("Invalid user role");
            }
        } else {
            throw new Error("User document does not exist");
        }
    } catch (error) {
        alert(error.message);
    }
};

MainForm.addEventListener("submit",SignInUser);
event.preventDefault(); // Prevent the default form submission behavior

