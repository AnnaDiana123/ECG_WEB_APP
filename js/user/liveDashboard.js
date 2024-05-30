//import moduels from Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, onSnapshot} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
//import firebase config
import { firebaseConfig } from "../components/firebaseConfig.js";
//import functionalities
import { initializeChart } from "../components/chart.js";
import { getUserIdFromSessionStorage, signOut } from "../services/auth.js";
import { displayHealthParameters } from "../shared/displayHelpers.js";

//initialize firebase app with configuration
const app = initializeApp(firebaseConfig);
//get firestore instance
const db = getFirestore(app);

//declare variables 
let chart, series;

const applyAnimationToSeries = (series, data) => {
    const delayBetweenPoints = 10;

    series.set("sequencedInterpolation", true);
    series.set("sequencedInterpolationDelay", delayBetweenPoints);
    series.set("interpolationDuration", delayBetweenPoints);
    series.set("interpolationEasing", am5.ease.linear);

    series.data.setAll(data);
};


//function that subscribes to real-time ecg readings from firestore 
const subscribeToEcgReadings = async (series) => {
  const userId = getUserIdFromSessionStorage();

  //get the ecg reading collection
  const readingsRef = collection(db, 'ecg_data', userId, 'readings');

  try {
    //subscribe to real-time updates from the ECG readings collection
    onSnapshot(readingsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //get the data of the added document
          const data = change.doc.data(); 

            //structure the data 
            const structuredData = {
                docId: change.doc.id, // Store the document ID
                ecgData: data.ecg_data,
                rrIntervals: data.rr_intervals,
                bpm: data.bpm,
                sdnn: data.sdnn,
                rmssd: data.rmssd
            };

          //update the chart with new ECG data and display the health param
          series.data.setAll(data.ecg_data); 
          console.log(data.ecg_data)
          displayHealthParameters(structuredData); 
        }
      });
    });
  } catch (error) {
    console.error('Error subscribing to ECG readings:', error); 
  }
};

//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    //initialize chart
    const chartResult = initializeChart('chartdiv');
    chart = chartResult.chart;
    series = chartResult.series;

    //get buttons
    const signOutButton = document.getElementById('signOutButton');

    //add event listeners to the buttons
    signOutButton.addEventListener('click', signOut);

    subscribeToEcgReadings(series);
});