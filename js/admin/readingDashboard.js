//import moduels from Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
//import firebase config
import { firebaseConfig } from "../components/firebaseConfig.js";
//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { signOut } from "../services/auth.js";
import { displayChartData , analyzeData } from "../shared/displayHelpers.js"


//initialize firebase app with configuration
const app = initializeApp(firebaseConfig);
//get firestore instance
const db = getFirestore(app);

//declare variables
let allStructuredReadings = [];
let chart, series;


const getUserIdFromName = async (name) =>{
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


const onLoadDataButtonClick = async () => {

  //get the date selected by the user
  let pacientNameValue= document.getElementById("pacientName").value;

  if(!pacientNameValue){
    alert("Please fill in the Name of the pacient!")
  }
  else{
    const userId = await getUserIdFromName(pacientNameValue);

    if(userId){
      await displayChartData(userId, allStructuredReadings, series);
    }
  }
}

const onAnalyzeDataButtonClick = () => {
  analyzeData(allStructuredReadings, chart);
}


   //initialize chart
document.addEventListener('DOMContentLoaded', () => {
  const chartResult = initializeChart('chartdiv');
  chart = chartResult.chart;
  series = chartResult.series;

  //get references to the buttons
  const loadDataButton = document.getElementById('loadDataButton');
  const analyzeDataButton = document.getElementById('analyzeDataButton');
  const signOutButton = document.getElementById('signOutButton');

  //add event listeners to the buttons
  loadDataButton.addEventListener("click", onLoadDataButtonClick);
  analyzeDataButton.addEventListener("click", onAnalyzeDataButtonClick);
  signOutButton.addEventListener('click', signOut);
});
