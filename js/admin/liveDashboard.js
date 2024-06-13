//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { signOutUser, checkCred } from "../services/auth.js";
import { subscribeToEcgReadings } from "../services/dataServices.js";
import { getUserIdFromCNP } from "../services/dataServices.js";


//declare variables 
let chart, series;
var unsubscribe;

const onLoadLiveDataButtonClick = async () => {
  //unsubscrie to listening the previous user live data
  if(unsubscribe){
    //remove the series from the chart that coresponds to the previous user
    unsubscribe();
    if(series.data.length > 0){
      series.data.setAll([]);
    }
  }

  //get the date selected by the user
  let pacientCNPValue= document.getElementById("pacientCNP").value;

  if(!pacientCNPValue){
    alert("Please fill in the CNP of the pacient!")
  }
  else{
    const userId = await getUserIdFromCNP(pacientCNPValue);

    if(userId){
      unsubscribe = await subscribeToEcgReadings(series,userId);
    }
  }
}


//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  //check creds from session storage
  checkCred();

  const chartResult = initializeChart("chartdiv"); 
  chart = chartResult.chart;
  series = chartResult.series;
  //get buttons
  const signOutButton = document.getElementById("signOutButton");
  const loadLiveDataButton = document.getElementById("loadLiveDataButton");

  //add event listeners to the buttons
  signOutButton.addEventListener("click", signOutUser);
  loadLiveDataButton.addEventListener("click", onLoadLiveDataButtonClick);

});