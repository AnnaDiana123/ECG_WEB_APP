//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { signOut } from "../services/auth.js";
import { displayChartData , analyzeData } from "../shared/displayHelpers.js";
import { getUserIdFromName } from "../services/dataServices.js";



//declare variables
let allStructuredReadings = [];
let chart, series;


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
