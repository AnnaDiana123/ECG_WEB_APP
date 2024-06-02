//initialize chart
import { initializeChart } from "../components/chart.js";
//import functionalities
import { getUserIdFromSessionStorage, signOut } from "../services/auth.js";
import { displayChartData, analyzeData } from "../shared/displayHelpers.js"


//declare variables 
let allStructuredReadings = [];
let chart, series;
var userId = getUserIdFromSessionStorage();


const onLoadDataButtonClick = async () => {
  await displayChartData(userId, allStructuredReadings, series);
}


const onAnalyzeDataButtonClick = () =>{
  //check if data was loaded in the chart
  if (series.data.length === 0) {
    alert('The chart is empty.');
  } else {
    analyzeData(userId,allStructuredReadings, chart);
  }
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
