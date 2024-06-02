import { fetchEcgReadings, fetchUserData } from "../services/dataServices";


export const displayHealthParameters = (corespondingBatch) => {
    document.getElementById('analyzisResult').innerHTML = "";
    if (corespondingBatch) {
      const batchStartingTime = new Date(Number(corespondingBatch.docId));

      document.getElementById('analyzisResult').innerHTML = `
          The following values were extracted from an analysis of approximately one minute of ECG signal, starting at <b>${batchStartingTime}</b>.
          <br> <b> BPM: </b> ${corespondingBatch.bpm}
          <br> <b> RR Intervals: </b> ${corespondingBatch.rrIntervals.join(", ")}
          <br> <b> SDNN: </b> ${corespondingBatch.sdnn}
          <br> <b> RMSSD: </b> ${corespondingBatch.rmssd}
      `;
  } else {
      document.getElementById('analyzisResult').textContent = "No corresponding batch found for the selected time.";
  }
};
  


export const analyzeData = (userId, allStructuredReadings, chart) => {
    let xAxis = chart.xAxes.getIndex(0); //retrieves the x-axis (retrives the first x-axes from the chart x-axis collection)

    let start = xAxis.toAxisPosition(0); //retrieves the position coresponding to the start of the axis
    let end = xAxis.toAxisPosition(1);   //retrieves the position coresponding to the end of the axis

    //convert position to unix time in milliseconds
    let startTimeUnix = xAxis.positionToDate(start);
    let endTimeUnix = xAxis.positionToDate(end);
    let timeIntervalZoomed = endTimeUnix - startTimeUnix;


    const oneMinute = 60000; // 60.000 milliseconds
    if (timeIntervalZoomed <= oneMinute + 10000 && timeIntervalZoomed >= oneMinute - 10000) { // 10-second buffer
          //find coresponding batch in order to display the coresponding health parameters
          const corespondingBatch = allStructuredReadings.find(data => {
          return data.docId <= startTimeUnix + 10000 && data.docId>= startTimeUnix - 10000; //10 second range
        });

        //create a URLSearchParams object to store the user id and batch id for later use
        const urlParams = new URLSearchParams({
          userId: userId,
          batchId: corespondingBatch.docId
        });
      
        //open the new page in a new tab
        window.open(`medicalReport.html?${urlParams.toString()}`, '_blank');

    } else {
      alert("Zoom in or out to incorporate a one minute reading");
    }
}


export const displayChartData = async (userId,allStructuredReadings,series) => {
    //get the date selected by the user
    let dateValue = document.getElementById("datePicker").value;
    let startTimeValue = document.getElementById("startTimePicker").value;
    let endTimeValue = document.getElementById("endTimePicker").value;
  
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
        try {
      
          //fetch ECG readings for the specified date and time range
          const readings = await fetchEcgReadings(userId, dateValue, startTimeValue, endTimeValue);

          if (readings.length === 0) {
            alert("No ECG readings available for the selected time range.");
            return;
        }

          //clear and update allStructuredReadings with the fetched data
          allStructuredReadings.length = 0;
          allStructuredReadings.push(...readings);
      
          //concatenate all ECG data from the fetched readings
          allStructuredReadings.forEach(batch => {
            chartData = chartData.concat(batch.ecgData);  
          });
      
          // Update the chart with the new data
          series.data.setAll(chartData);

        } catch (error) {
          console.error("Error loading data:", error); // Log any errors that occur
          alert("Failed to load data. Please try again.");
        }
    }
};