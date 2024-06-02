//import firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, documentId, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "../components/firebaseConfig";
//import functionalities
import { displayHealthParameters } from "../shared/displayHelpers.js";

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

export const fetchUsersList = async () => {
  //create reference to the user collection
  const userRef = collection(db, 'UserAuthList');
  //get all documents in the collection
  const querySnapshot = await getDocs(userRef);

  const users = [];

  //loop through each document in the snapshot
  querySnapshot.forEach(doc => {
    //push all entries in the array
    users.push({
      //create a new object with the document data
      ...doc.data()
    });
  });

  return users;
}

export const fetchECGBatch = async (userId, batchId) => {
  //create reference to the batch doc
  const batchRef = doc(db, 'ecg_data', userId, 'readings', batchId);
  //get the document
  const docSnap = await getDoc(batchRef);

  if (docSnap.exists()) {
    //return batch data
    return docSnap.data();
  } else {
    console.log("No such batch!");
    return null;
  }

}

export const subscribeToEcgReadings = (series,userId) => {
  //get the reference to the readings collection
  const readingsRef = collection(db, 'ecg_data', userId, 'readings');


  //Subscribe to ECG readings (the function return an unsubscribe function that can be used to stop listening to changes in the collection)
  let unsubscribe = onSnapshot(readingsRef, snapshot => {
    //get the last change of the collection
    const lastDocument = snapshot.docs[snapshot.docs.length - 1];
    const data = lastDocument.data();
    console.log('Last document:', lastDocument.data());

    const structuredData = {
        docId: lastDocument.id, // Store the document ID
        ecgData: data.ecg_data, 
        rrIntervals: data.rr_intervals, 
        bpm: data.bpm, 
        sdnn: data.sdnn, 
        rmssd: data.rmssd 
    }
    document.getElementById('explanationText').innerHTML = `<b>The last reading captured for this user was at:  ${new Date(Number(structuredData.docId))} </b>`; 
    displayHealthParameters(structuredData);
    //update the chart with new ECG data and display the health param
    series.data.setAll(structuredData.ecgData);
    //add animation to series
    series.appear();
   
  }, error => {
    console.error('Error subscribing to ECG readings:', error); 
  });

  return unsubscribe;
};


export const getUserIdFromName = async (name) =>{
  try {
    //get reference to the user collection
    const userRef = collection(db, 'UserAuthList');
    //query to find user by name
    const q = query(userRef, where("Name", '==', name));

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

