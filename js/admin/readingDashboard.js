//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { signOutUser, checkCred } from "../services/auth.js";
import { displayChartData , analyzeData } from "../shared/displayHelpers.js";
import { getUserIdFromCNP } from "../services/dataServices.js";



//declare variables
var userId;
let allStructuredReadings = [];
let chart, series;


const onLoadDataButtonClick = async () => {

  //get the date selected by the user
  let pacientCNPValue= document.getElementById("pacientCNP").value;

  if(!pacientCNPValue){
    alert("Please fill in the CNP of the pacient!")
  }
  else{
    userId = await getUserIdFromCNP(pacientCNPValue);

    if(userId){
      await displayChartData(userId, allStructuredReadings, series);
    }
  }
}

const onAnalyzeDataButtonClick = () => {
  //check if data was loaded in the chart
  if (series.data.length === 0) {
    alert("The chart is empty.");
  } else {
    analyzeData(userId,allStructuredReadings, chart);
  }
}


   //initialize chart
document.addEventListener("DOMContentLoaded", () => {
  //check creds from session storage
  checkCred();

  const chartResult = initializeChart("chartdiv");
  chart = chartResult.chart;
  series = chartResult.series;

  //get references to the buttons
  const loadDataButton = document.getElementById("loadDataButton");
  const analyzeDataButton = document.getElementById("analyzeDataButton");
  const signOutButton = document.getElementById("signOutButton");

  //add event listeners to the buttons
  loadDataButton.addEventListener("click", onLoadDataButtonClick);
  analyzeDataButton.addEventListener("click", onAnalyzeDataButtonClick);
  signOutButton.addEventListener("click", signOutUser);
});
