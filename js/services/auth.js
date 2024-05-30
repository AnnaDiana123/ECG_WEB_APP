//import modules from firebase
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "../components/firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

//initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);
//fet Firestore instance
const db = getFirestore(app);
//fet Firebase Auth instance
const auth = getAuth(app);


export const signInUser = async (email, password) => {
    try {
        //try to sign in with email and password
        const credentials = await signInWithEmailAndPassword(auth, email, password);

        //store user id in session storage
        sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
        return credentials.user;

    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export const registerUser = async (email,password,name,cnp,deviceId) => {
    try {
        //create user with email and password
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        //create reference for new user in firestore
        const userRef = doc(db, "UserAuthList", credentials.user.uid);

        //set user details
        await setDoc(userRef, { Name: name, CNP: cnp, DeviceId: deviceId });
        return credentials.user;
        
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

export const signOut = ()=>{
    //remove the info and cred of the user
    sessionStorage.removeItem("user-creds");
    window.location.href='index.html';
}

export const getUserIdFromSessionStorage = () => {
    let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
    const userId = UserCreds.uid;

    return userId;
}