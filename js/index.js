import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();


let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");

let SignInUser = evt => {
    evt.preventDefault();

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(async(credentials)=>{
        var ref = doc(db, "UserAuthList",credentials.user.uid);
        //docSnap referst to data to a specific document from firestore  (gets the uid from UserAuthList from Firestore)
        const docSnap = await getDoc(ref);

        if(docSnap.exists()){
            //stores the user info in the memory of the current session, if you close the browser you will lose the info
            sessionStorage.setItem("user-info",JSON.stringify({
                Name: docSnap.data().Name,
                CNP: docSnap.data().CNP,
                DeviceId: docSnap.data().DeviceId,

            }))
            //also store the user credential details
            sessionStorage.setItem("user-creds",JSON.stringify(credentials.user));
            //change location to home page
            window.location.href="home.html";
        }
    })

    .catch((error)=>{
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}

MainForm.addEventListener('submit',SignInUser);