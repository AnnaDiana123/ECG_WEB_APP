import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";

//this is the configuration for Firebase that will be used across the application.
export const firebaseConfig = {
    apiKey: "AIzaSyBOesAtQekwBT9_yuXpoaGCg6gmxiizzP4",
    authDomain: "ecgapp-7d874.firebaseapp.com",
    projectId: "ecgapp-7d874",
    storageBucket: "ecgapp-7d874.appspot.com",
    messagingSenderId: "931292339686",
    appId: "1:931292339686:web:2f75e50b490be933f94a27",
    measurementId: "G-2BE9FVBPMW"
  };


//initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize Firestore
const db = getFirestore(app);

//initialize Firebase Auth
const auth = getAuth(app);

export { app, db, auth };
