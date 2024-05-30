//import firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, documentId, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "../components/firebaseConfig";

//initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);
//fet Firestore instance
const db = getFirestore(app);

export const fetchEcgReadings= async (userId, date, startTime, endTime) => {
  //create date object fir start and end time
  const startDate = new Date(`${date}T${startTime}:59`);
  const endDate = new Date(`${date}T${endTime}:59`);
  
  //convert to unix
  const startDateUnix = startDate.getTime()
  const endDateUnix = endDate.getTime()
  
  //create reference to the ecg readings collection
  const readingsRef = collection(db, 'ecg_data', userId, 'readings');
  //create a querry
  const q = query(readingsRef, where(documentId(), '>=', startDateUnix.toString()), where(documentId(), '<=', endDateUnix.toString()));
  
  //executes the querry that returns mutiple ecg readings
  const querySnapshot = await getDocs(q);
  
  const allStructuredReadings = [];
  
  try{
    //loop trough each document in the snapshot
    querySnapshot.forEach(doc => {
      const data = doc.data();
      
      //push all entries in the array
      allStructuredReadings.push({
        docId: doc.id, // Store the document ID
        ecgData: data.ecg_data, 
        rrIntervals: data.rr_intervals, 
        bpm: data.bpm, 
        sdnn: data.sdnn, 
        rmssd: data.rmssd 
      });
    });
    
    return allStructuredReadings;
  } catch (error) {
    console.error("Error fetching ECG data:", error);
  }
};


export const fetchUserData = async (userId) => {
  //create reference to the user doc
  const userRef = doc(db, 'UserAuthList', userId);
  //get the document
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    //return user data
    return docSnap.data();
  } else {
    console.log("No such user!");
    return null;
  }
}

