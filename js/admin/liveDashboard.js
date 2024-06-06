//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { signOut } from "../services/auth.js";
import { subscribeToEcgReadings } from "../services/dataServices.js";
import { getUserIdFromName } from "../services/dataServices.js";


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
  let pacientNameValue= document.getElementById("pacientName").value;

  if(!pacientNameValue){
    alert("Please fill in the Name of the pacient!")
  }
  else{
    const userId = await getUserIdFromName(pacientNameValue);

    if(userId){
      unsubscribe = await subscribeToEcgReadings(series,userId);
    }
  }
}


//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  const chartResult = initializeChart("chartdiv"); 
  chart = chartResult.chart;
  series = chartResult.series;
  //get buttons
  const signOutButton = document.getElementById("signOutButton");
  const loadLiveDataButton = document.getElementById("loadLiveDataButton");

  //add event listeners to the buttons
  signOutButton.addEventListener("click", signOut);
  loadLiveDataButton.addEventListener("click", onLoadLiveDataButtonClick);

});