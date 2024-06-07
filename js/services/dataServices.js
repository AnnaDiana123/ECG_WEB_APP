//import firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, documentId, doc, getDoc, onSnapshot, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "../components/firebaseConfig";

//initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);
//fet Firestore instance
const db = getFirestore(app);

//global variables
let isCurrentlyDisplaying = false; //variable for processing the queue when displaying the live data

export const fetchEcgReadings= async (userId, date, startTime, endTime) => {
  //create date object for start and end time
  const startDate = new Date(`${date}T${startTime}:59`);
  const endDate = new Date(`${date}T${endTime}:59`);
  
  //convert to unix
  const startDateUnix = startDate.getTime()
  const endDateUnix = endDate.getTime()
  
  //create reference to the ecg readings collection
  const readingsRef = collection(db, "ecg_data", userId, "readings");
  //create a querry
  const q = query(readingsRef, where(documentId(), ">=", startDateUnix.toString()), where(documentId(), "<=", endDateUnix.toString()));
  
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
  const userRef = doc(db, "UserAuthList", userId);
  //get the document
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    //return user data
    return docSnap.data();
  } else {
    return null;
  }
}

export const fetchUsersList = async () => {
  //create reference to the user collection
  const userRef = collection(db, "UserAuthList");
  //get all documents in the collection
  const querySnapshot = await getDocs(userRef);

  const users = [];

  //loop through each document in the snapshot
  querySnapshot.forEach(doc => {
    //push all entries in the array besides the admin
    if(doc.data().Role === "User"){
      users.push({
        //create a new object with the document data
        ...doc.data()
      });
    }
  });

  return users;
}

export const fetchECGBatch = async (userId, batchId) => {
  //create reference to the batch doc
  const batchRef = doc(db, "ecg_data", userId, "readings", batchId);
  //get the document
  const docSnap = await getDoc(batchRef);

  if (docSnap.exists()) {
    //return batch data
    return docSnap.data();
  } else {
    return null;
  }

}

function setAndDisplayDataPromise(series, data) {
  //this function returns a promise that resolves after 10 seconds
  return new Promise((resolve) => {
  series.data.setAll(data);
  //add animation to series
  series.appear();
  setTimeout(resolve, 10500);
  });
}

const displayQueue = async (series, dataQueue) => {
  if(dataQueue.length === 0 || isCurrentlyDisplaying === true){
    return;
  }

  isCurrentlyDisplaying = true;

  //get the first element from the queue
  const ecgData = dataQueue.shift();
  if (!ecgData || ecgData.length === 0) {
    isProcessing = false;
    return;
  }

  //set and display the data
  for(let i =0; i<ecgData.length; i=i+1000){
    //display 1000 data points at a time, coresponding to 10 seconds of data
    await setAndDisplayDataPromise(series,  ecgData.slice( i , i+1000 ) );
  }

  //set the flag to false because it is done displaying the data
  isCurrentlyDisplaying = false;

  //if there are more elements in the queue display them
  if (dataQueue.length > 0) 
    displayQueue(series, dataQueue);
}

export const subscribeToEcgReadings = async (series,userId) => {
  //get the reference to the readings collection
  const readingsRef = collection(db, "ecg_data", userId, "readings");
  //create a query to get the last document in the collection
  const q = query(readingsRef, orderBy(documentId(), "desc"), limit(1));

  //queue for the live data
  let ecgBatchQueue = [];


  //Subscribe to ECG readings (the function return an unsubscribe function that can be used to stop listening to changes in the collection)
  let unsubscribe = onSnapshot(q, readingsRef, async snapshot => {
    //get the last change of the collection
    const lastDocument = snapshot.docs[0];
    if(!lastDocument){
      alert("No data available for this user!");
      return;
    }
    else{
      const data = lastDocument.data();

      if(new Date().getTime() - lastDocument.id <= 1.5 * 60 * 1000 ){ //the last document should not be older then 1.5 minutes
        document.getElementById("lastBatchText").innerHTML = "";
        ecgBatchQueue.push (
          data.ecg_data
        );

        displayQueue(series, ecgBatchQueue);
      }
      else{
        document.getElementById("lastBatchText").innerHTML = `The last ECG reading for this user was captured at <b> ${new Date(Number(lastDocument.id))} </b>
        <br> If you connected your device, please wait around one minute to see the live data.`
      }
    } 
  },  error => {
    console.error("Error subscribing to ECG readings:", error); 
  });

  return unsubscribe;
};


export const getUserIdFromName = async (name) =>{
  try {
    //get reference to the user collection
    const userRef = collection(db, "UserAuthList");
    //query to find user by name
    const q = query(userRef, where("Name", "==", name));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("The pacient name is not correct!");
        return null;
    }

    //extract the first element of the array returned by the query
    const firstDoc = querySnapshot.docs[0];

    //The doc.is is the user.id
    return firstDoc.id;

} catch (error) {
    console.error("Error fetching documents:", error);
}
}

