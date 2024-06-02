//import moduels from Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc,  updateDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
//import firebase config
import { firebaseConfig } from "../components/firebaseConfig.js";
//import functionalities
import { signOut, getUserIdFromSessionStorage } from "../services/auth.js";
import { fetchUserData } from "../services/dataServices.js";


//initialize firebase app with configuration
const app = initializeApp(firebaseConfig);
//get firestore instance
const db = getFirestore(app);


//functions that checks user id stored in session storage
const checkCred = ()=>{
    if(!sessionStorage.getItem("user-creds"))
        //redirect to login page if no user creds are found
        window.location.href='index.html';
}


//function to display user data
const displayUserData = async () => {
    const userId = getUserIdFromSessionStorage();

    try {
        //fetch user data from firestore
        const userData = await fetchUserData(userId);

        if (userData) {
            //display fetched data
            document.getElementById('nameField').value = userData.Name;
            document.getElementById('cnpField').value = userData.CNP;
            document.getElementById('birthdayField').value = userData.Birthday;
            document.getElementById('genderField').value = userData.Gender;
            document.getElementById('deviceIdField').value = userData.DeviceId;
        }
    } catch (error) {
        console.error("Error displaying user data:", error);
    }

}


//function that updates user device id
const updateDeviceId = async (event) => {
    event.preventDefault();  //prevent the form from submitting immediately
    
    const userId = getUserIdFromSessionStorage();
    
    //get the new device id value 
    const newDeviceId= document.getElementById('deviceIdField').value;
    
    if(newDeviceId){
        //fetch user document
        const userRef = doc(db, 'UserAuthList', userId);
    
        try {
            //update the device id field
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
        alert('Please fill in the Device Id field!');
    }

};


//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    checkCred(); 
    displayUserData(); 

    //get references to the buttons
    const signOutButton = document.getElementById('signoutbutton');
    const updateDeviceIdButton = document.getElementById('updateDeviceIdButton');

    //add event listeners to the buttons
    signOutButton.addEventListener('click', signOut); 
    updateDeviceIdButton.addEventListener('click', updateDeviceId); 
});