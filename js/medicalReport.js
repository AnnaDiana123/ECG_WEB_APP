import { fetchUserData, fetchECGBatch } from "./services/dataServices.js";

function generatePDF() {
  //get the jsPDF object from the window object
  const { jsPDF } = window.jspdf;

  //create a new jsPDF instance
  const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
  });

  //add the html content to the PDF
  doc.html(document.querySelector('.container'), {
      callback: function (doc) {
        //get the number of pages in the PDF
        var pageCount = doc.internal.getNumberOfPages();

          //delete extra blank pages
          while (pageCount > 1) {
            doc.deletePage(pageCount);
            pageCount = doc.internal.getNumberOfPages();
          }

          //save the PDF
          doc.save('medical-report.pdf');
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
  
    //calculate the age in years. The Date object's year is the number of years since 1970,
    //so subtract 1970 to get the age. Use Math.abs() to ensure the age is a positive number.
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age;
}


const populateMedicalReport = async () => {
    //get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const batchId = urlParams.get('batchId');
  
    //fetch user data and ECG batch data from Firestore
    const userData = await fetchUserData(userId);
    const ecgBatch = await fetchECGBatch(userId, batchId);
  
    //complete the medical report with the fetched data
    if (userData) {
        document.getElementById('summaryText').textContent = `The values for RMSSD, RR Intervals, BPM, and SDNN provided in this report have been extracted from an approximately one-minute ECG reading that commenced at ${new Date(Number(batchId))}.`;
      document.getElementById('patientName').textContent = userData.Name;
      document.getElementById('patientAge').textContent = getAge(userData.Birthday);  
      document.getElementById('patientGender').textContent = userData.Gender;  
      document.getElementById('reportDate').textContent = new Date(Number(batchId));
    }
    else{
        console.log("url parameters are not correct");
    }
  
    if (ecgBatch) {
      document.getElementById('rrIntervalsValue').textContent = ecgBatch.rr_intervals.join(', ');
      document.getElementById('bpmValue').textContent = `${ecgBatch.bpm} bpm`;
      document.getElementById('sdnnValue').textContent = `${ecgBatch.sdnn} ms`;
      document.getElementById('rmssdValue').textContent = `${ecgBatch.rmssd} ms`;
    }
    else{
        console.log("url parameters are not correct");
    }
  };
  
  //event listener for DOMContentLoaded to ensure DOM is fully loaded before running the script
  document.addEventListener('DOMContentLoaded', async () => {
    //get buttons
    const generatePDFButton = document.getElementById('generatePdfButton');

    //add event listeners to the buttons
    generatePDFButton.addEventListener('click', generatePDF);

    populateMedicalReport();
  });