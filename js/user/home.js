import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, query, where , documentId, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let SignOutBtn = document.getElementById('signoutbutton');
let updateDeviceIdButton = document.getElementById('updateDeviceIdButton');


let SignOut = ()=>{
    //remove the info and cred of the user
    sessionStorage.removeItem("user-creds");
    window.location.href='index.html';
}

let CheckCred = ()=>{
    if(!sessionStorage.getItem("user-creds"))
        window.location.href='index.html';
}


// Function to fetch user data
async function fetchUserData() {
    let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
    const userId = UserCreds.uid;

    const userRef = doc(db, 'UserAuthList', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        document.getElementById('nameField').value = userData.Name;
        document.getElementById('cnpField').value = userData.CNP;
        document.getElementById('deviceIdField').value = userData.DeviceId;
    } else {
        console.log("No such user!");
    }
}


window.addEventListener('load',CheckCred);
SignOutBtn.addEventListener('click',SignOut);

document.getElementById('updateDeviceIdButton').addEventListener('click',async function(event) {
    event.preventDefault();  // Prevent the form from submitting immediately
    
        let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
        const userId = UserCreds.uid;
    
        const newDeviceId= document.getElementById('deviceIdField').value;
    
        if(newDeviceId){
            const userRef = doc(db, 'UserAuthList', userId);
    
            try {
                updateDoc(userRef, {
                    DeviceId: newDeviceId
                });
                alert('Device ID updated successfully!');
            } catch (error) {
                console.error('Error updating device ID:', error);
                alert('Failed to update device ID.');
            }
        }
        else{
            alert('Please fill in the Device Id field!')
        }

});

// Initial data fetch
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();  
});