import { fetchUserData, fetchECGBatch } from "./services/dataServices.js";


function generatePDF() {
  //get the jsPDF object from the window object
  const { jsPDF } = window.jspdf;

  //create a new jsPDF instance
  const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
  });

  //add the html content to the PDF
  doc.html(document.querySelector(".container"), {
      callback: function (doc) {
        //get the number of pages in the PDF
        var pageCount = doc.internal.getNumberOfPages();

          //delete extra blank pages
          while (pageCount > 1) {
            doc.deletePage(pageCount);
            pageCount = doc.internal.getNumberOfPages();
          }

          //save the PDF
          doc.save("medical-report.pdf");
      },
      x: 10,
      y: 10,
      margin: [10, 10, 10, 10],  
      width: 500, 
      windowWidth: 1000
  });
}

function getAge(birthday) {
    //create a Date object from the birthday
    let birthDate = new Date(birthday);
  
    //calculate the difference between the current date and the birthday in milliseconds
    let ageDifMs = Date.now() - birthDate.getTime();
  
    //create a new Date object from the difference in milliseconds
    let ageDate = new Date(ageDifMs);
  
    //calculate the age in years. The Date object"s year is the number of years since 1970,
    //so subtract 1970 to get the age. Use Math.abs() to ensure the age is a positive number.
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age;
}

const setInterpretationRange = (age, gender) => {
  if (gender == "female") {
    if (age < 50) {
      return {
        rmssdRange: { min: 16.4, max: 56.6 },
        sdnnRange: { min: 25.7, max: 64.1 },
        bpmRange: { min: 60, max: 100 },
        rrIntervalRange: { min: 550, max: 1200 }
      };
    } else {
      return {
        rmssdRange: { min: 8.8, max: 35.2 },
        sdnnRange: { min: 18, max: 45.2 },
        bpmRange: { min: 60, max: 100 },
        rrIntervalRange: { min: 550, max: 1200 }
      };
    }
  } else {
    if (age < 50) {
      return {
        rmssdRange: { min: 15.7, max: 52.3 },
        sdnnRange: { min: 27, max: 64.6 },
        bpmRange: { min: 60, max: 100 },
        rrIntervalRange: { min: 550, max: 1200 }
      };
    } else {
      return {
        rmssdRange: { min: 9.5, max: 31.5 },
        sdnnRange: { min: 18.2, max: 47.8 },
        bpmRange: { min: 60, max: 100 },
        rrIntervalRange: { min: 550, max: 1200 }
      };
    }
  }
}

const  setInterpretationMessage = (bpm, sdnn, rmssd, rrIntervals, bpmRange, sdnnRange, rmssdRange, rrIntervalsRange) => {
  let bpmMessage, sdnnMessage, rmssdMessage, rrMessage = "";

  //BPM Messages
  if (bpm < bpmRange.min) {
      bpmMessage = "Your resting heart rate is below 60 BPM, which might indicate bradycardia. This can be caused by high fitness levels, certain medications, or heart conditions.";
  } else if (bpm > bpmRange.max) {
      bpmMessage = "Your resting heart rate is above 100 BPM, which might indicate tachycardia. This can be due to stress, anxiety, dehydration, or heart conditions.";
  } else {
      bpmMessage = "Your resting heart rate is within the normal range (60-100 BPM).";
  }

  //SDNN Messages
  if (sdnn < sdnnRange.min) {
      sdnnMessage = "Your heart rate variability is low, suggesting reduced flexibility in your heart's response. This can be caused by stress, fatigue, or chronic health conditions.";
  } else if (sdnn > sdnnRange.max) {
      sdnnMessage = "Your heart rate variability is high, which might indicate a very responsive nervous system. This can be seen in highly relaxed or fit individuals but can also occur due to some medical conditions.";
  } else {
      sdnnMessage = "Your heart rate variability (SDNN) is within the normal range.";
  }

  //RMSSD Messages
  if (rmssd < rmssdRange.min) {
      rmssdMessage = "Your short-term heart rate variability is low, which might mean your heart isn't responding well to changes. This can be due to stress, lack of sleep, or certain health conditions.";
  } else if (rmssd > rmssdRange.max) {
      rmssdMessage = "Your short-term heart rate variability is high, which might mean your heart is very responsive to changes. This can be seen in relaxed or well-rested individuals but might also be due to some medical conditions.";
  } else {
      rmssdMessage = "Your short-term heart rate variability (RMSSD) is within the normal range.";
  }

  //RR Interval Messages
  for (let i = 0; i < rrIntervals.length; i++) {
      if (rrIntervals[i] < rrIntervalsRange.min || rrIntervals[i] > rrIntervalsRange.max) {
          rrMessage = `One of your RR intervals (${rrIntervals[i]} ms) is outside the normal range. This could indicate an irregular heartbeat or other cardiac issue.`;
          break; //exit loop after finding the first abnormal interval
      }
  }
  if (rrMessage == "") {
      rrMessage = "Your RR intervals are within the normal range.";
  }

  //display the messages
  document.getElementById("bpmText").innerText = bpmMessage;
  document.getElementById("sdnnText").innerText = sdnnMessage;
  document.getElementById("rmssdText").innerText = rmssdMessage;
  document.getElementById("rrIntervalsText").innerText = rrMessage;
}



const populateMedicalReport = async () => {
    //get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const batchId = urlParams.get("batchId");
  
    //fetch user data and ECG batch data from Firestore
    const userData = await fetchUserData(userId);
    const ecgBatch = await fetchECGBatch(userId, batchId);
  
    //complete the medical report with the fetched data
    if (userData) {
      document.getElementById("referneceRangeText").textContent = `Reference Range ( ${userData.Gender}, Age ${getAge(userData.Birthday)} )`;
      document.getElementById("summaryText").textContent = `The values for RMSSD, RR Intervals, BPM, and SDNN provided in this report have been extracted from an approximately one-minute ECG reading that commenced at ${new Date(Number(batchId))}.`;
      document.getElementById("patientName").textContent = userData.Name;
      document.getElementById("patientAge").textContent = getAge(userData.Birthday);  
      document.getElementById("patientGender").textContent = userData.Gender;  
      document.getElementById("reportDate").textContent = new Date(Number(batchId));
    }
    else{
        alert("url parameters are not correct");
    }
  
    if (ecgBatch && userData) {
      //set patient params
      document.getElementById("rrIntervalsValue").textContent = ecgBatch.rr_intervals.join(", ");
      document.getElementById("bpmValue").textContent = `${ecgBatch.bpm} bpm`;
      document.getElementById("sdnnValue").textContent = `${ecgBatch.sdnn} ms`;
      document.getElementById("rmssdValue").textContent = `${ecgBatch.rmssd} ms`;

      //set interpretation range for patient params
      const { rmssdRange, sdnnRange, bpmRange, rrIntervalRange } = setInterpretationRange(getAge(userData.Birthday), userData.Gender);
      document.getElementById("rrIntervalsRange").textContent = `${rrIntervalRange.min} - ${rrIntervalRange.max} ms`;
      document.getElementById("bpmRange").textContent = `${bpmRange.min} - ${bpmRange.max} bpm`;
      document.getElementById("sdnnRange").textContent = `${sdnnRange.min} - ${sdnnRange.max} ms`;
      document.getElementById("rmssdRange").textContent = `${rmssdRange.min} - ${rmssdRange.max} ms`;

      //set interpretation for patient params
      setInterpretationMessage(ecgBatch.bpm, ecgBatch.sdnn, ecgBatch.rmssd, ecgBatch.rr_intervals, bpmRange, sdnnRange, rmssdRange, rrIntervalRange);

    }
    else{
        alert("url parameters are not correct");
    }
  };
  
  //event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
  document.addEventListener("DOMContentLoaded", async () => {
    //get buttons
    const generatePDFButton = document.getElementById("generatePdfButton");

    //add event listeners to the buttons
    generatePDFButton.addEventListener("click", generatePDF);

    populateMedicalReport();
  });