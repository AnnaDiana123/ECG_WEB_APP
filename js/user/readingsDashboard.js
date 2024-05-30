//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { getUserIdFromSessionStorage, signOut } from "../services/auth.js";
import { displayChartData, analyzeData } from "../shared/displayHelpers.js"


//declare variables 
let allStructuredReadings = [];
let chart, series;


const onLoadDataButtonClick = async () => {
  const userId = getUserIdFromSessionStorage();

  await displayChartData(userId, allStructuredReadings, series);
}


function onAnalyzeDataButtonClick(){
  analyzeData(allStructuredReadings, chart);
}

//event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
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
