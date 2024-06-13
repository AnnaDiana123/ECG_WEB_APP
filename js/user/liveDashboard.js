//import functionalities
import { initializeChart } from "../components/chart.js";
import { getUserIdFromSessionStorage, signOutUser, checkCred } from "../services/auth.js";
import { subscribeToEcgReadings } from "../services/dataServices.js";


//declare variables 
let chart, series;


//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
  //check creds from session storage
  checkCred();

  const chartResult = initializeChart("chartdiv"); 
  chart = chartResult.chart;
  series = chartResult.series;


  //get buttons
  const signOutButton = document.getElementById("signOutButton");

  //add event listeners to the buttons
  signOutButton.addEventListener("click", signOutUser);

  const userId = getUserIdFromSessionStorage();
  await subscribeToEcgReadings(series,userId);
});