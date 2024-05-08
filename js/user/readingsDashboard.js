import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, query, where , documentId} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


var chart;
var series;

let allStructuredReadings = [];

function initializeChart(){

    am5.ready(function() {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0
    }));

    chart.get("colors").set("step", 3);


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);



    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.3,
      baseInterval: {
        timeUnit: "millisecond",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true,
        minGridDistance: 100
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    // Adjust the tooltip to display dates in a format that includes milliseconds
    xAxis.get("tooltip").label.set("text", "{value.formatDate('HH:mm:ss.SSS')}");

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));


    series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "ecg_value",
      valueXField: "timestamp",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));


    }); // end am5.ready()
  }


  async function fetchEcgReadingsForDate(date, startTime, endTime) {
    let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
    const userId = UserCreds.uid;
    if (!userId) throw new Error('No user ID found');
  
    const startDate = new Date(`${date}T${startTime}:59`);
    const endDate = new Date(`${date}T${endTime}:59`);

    const startDateUnix = startDate.getTime()
    const endDateUnix = endDate.getTime()

    console.log(startDateUnix);
    console.log(endDateUnix);
  
    const readingsRef = collection(db, 'ecg_data', userId, 'readings');
    const q = query(readingsRef, where(documentId(), '>=', startDateUnix.toString()), where(documentId(), '<=', endDateUnix.toString()));
  
    //executes the querry that returns mutiple ecg readings
    const querySnapshot = await getDocs(q);

    allStructuredReadings = [];
  
    try{
      querySnapshot.forEach(doc => {
      const data = doc.data();

      allStructuredReadings.push({
        docId: doc.id, // Store the document ID
        ecgData: data.ecg_data, 
        rrIntervals: data.rr_intervals, 
        bpm: data.bpm, 
        sdnn: data.sdnn, 
        rmssd: data.rmssd 
      });

      
      });

        console.log(allStructuredReadings);
      return allStructuredReadings;
      } catch (error) {
        console.error("Error fetching ECG data:", error);
      }
  }


 async function onLoadDataButtonClick(){
  document.getElementById('analyzisResult').textContent = ""

  //get the date selected by the user
  var dateValue = document.getElementById("datePicker").value;
  var startTimeValue = document.getElementById("startTimePicker").value;
  var endTimeValue = document.getElementById("endTimePicker").value;

  let chartData = [];

  if(!dateValue){
    alert("Please select the date!")
  }
  else if(!startTimeValue ){
    alert("Please select the start time!")
  }
  else if(!endTimeValue){
    alert("Please select the end time!")
  }
  else{
    // Set data
      allStructuredReadings = await fetchEcgReadingsForDate(dateValue,startTimeValue,endTimeValue);

      allStructuredReadings.forEach(batch => {
        chartData = chartData.concat(batch.ecgData);  // Concatenate ecgData from each batch into chartData
      });


      series.data.setAll(chartData);
  }
 }

 function displayHealthParameters(startTimeUnix){
  //fin coresponding batch in order to display the coresponding health parameters
  const corespondingBatch = allStructuredReadings.find(data => {
    return data.docId <= startTimeUnix + 10000 && data.docId>= startTimeUnix - 10000;
    });

  const batchStartingTime = new Date(Number(corespondingBatch.docId));

    document.getElementById('analyzisResult').innerHTML = "The following values were extracted from an analysis of approximately one minute of ECG signal, starting at <b> " + batchStartingTime +" </b> ." +
                                                          "<br> <b> BPM: </b> " + corespondingBatch.bpm +
                                                          "<br> <b> RR Intervals: </b>" + corespondingBatch.rrIntervals.join(", ") +
                                                           "<br> <b> SDNN: </b> " + corespondingBatch.sdnn + 
                                                           "<br> <b> RMSSD: </b>" + corespondingBatch.rmssd ;

 }

 function onAnalyzeDataButtonClick(){
  document.getElementById('analyzisResult').textContent = ""

    var xAxis = chart.xAxes.getIndex(0); //retrieves the x-axis (retrives the first x-axes from the chart x-axis collection)

    var start = xAxis.toAxisPosition(0); //retrieves the position coresponding to the start of the axis
    var end = xAxis.toAxisPosition(1);   //retrieves the position coresponding to the end of the axis

    //convert position to unix time in milliseconds
    var startTimeUnix = xAxis.positionToDate(start);
    var endTimeUnix = xAxis.positionToDate(end);
    var timeIntervalZoomed = endTimeUnix - startTimeUnix;


    const oneMinute = 60000; // 60,000 milliseconds
    if (timeIntervalZoomed <= oneMinute + 10000 && timeIntervalZoomed >= oneMinute - 10000) { // 10-second buffer
        displayHealthParameters(startTimeUnix)
    } else {
      document.getElementById('analyzisResult').textContent = "Zoom in or out to incorporate a one minute reading"
    }
 }

 let SignOut = ()=>{
  //remove the info and cred of the user
  sessionStorage.removeItem("user-creds");
  window.location.href='index.html';
}

   //initialize chart
   document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
});

   const loadDataButton = document.getElementById('loadDataButton');
   const analyzeDataButton = document.getElementById('analyzeDataButton')
   const SignOutButon= document.getElementById('signOutButton');

   

   loadDataButton.addEventListener("click", onLoadDataButtonClick)
   analyzeDataButton.addEventListener("click",onAnalyzeDataButtonClick)

  SignOutButon.addEventListener('click',SignOut);