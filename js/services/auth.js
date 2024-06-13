//import modules from firebase
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {  db, auth } from "../components/firebaseConfig.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, browserSessionPersistence, setPersistence  } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

export const checkCred = () => {
    if(!sessionStorage.getItem("user-creds"))
        window.location.href="index.html";
}

export const signInUser = async (email, password) => {
    try {
        //set authentication persistence to SESSION
        await setPersistence(auth, browserSessionPersistence);

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

export const registerUser = async (email,password,name,cnp, birthday, gender, deviceId) => {
    try {
        //create user with email and password
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        //create reference for new user in firestore
        const userRef = doc(db, "UserAuthList", credentials.user.uid);

        //set user details
        await setDoc(userRef, { Name: name, CNP: cnp, Birthday:birthday, Gender:gender, DeviceId: deviceId, Role: "User", email: email});
        return credentials.user;
        
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

export const signOutUser = async ()=>{
    //remove the info and cred of the user
    sessionStorage.removeItem("user-creds");
    await signOut(auth);
    window.location.href="../../index.html";
}

export const getUserIdFromSessionStorage = () => {
    let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
    const userId = UserCreds.uid;

    return userId;

}