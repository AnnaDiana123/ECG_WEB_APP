import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js";

      
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();


let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let nameInput = document.getElementById("nameInput");
let cnpInput = document.getElementById("cnpInput");
let deviceIdInput = document.getElementById("deviceIdInput");

let RegisterUser = evt => {
    evt.preventDefault();

    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(async(credentials)=>{
        var ref = doc(db, "UserAuthList",credentials.user.uid);
        await setDoc(ref,{
            Name: nameInput.value,
            CNP: cnpInput.value,
            DeviceId: deviceIdInput.value
        });
    })

    .catch((error)=>{
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}

MainForm.addEventListener('submit',RegisterUser);