import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, query, where , documentId} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";
import Chart from 'chart.js/auto';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ctx = document.getElementById('ecgChart').getContext('2d');
let ecgChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'ECG Reading',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (ms)'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'ECG Value'
                }
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadDataButton').addEventListener('click', loadData);
});

let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));

async function fetchEcgReadingsForDate(date) {
    const userId = UserCreds.uid;
    if (!userId) throw new Error('No user ID found');

    const startDate = date.replaceAll('-', '') + '000000';
    const endDate = date.replaceAll('-', '') + '235959';

    const readingsRef = collection(db, 'ecg_data', userId, 'readings');
    const q = query(readingsRef, where(documentId(), '>=', startDate), where(documentId(), '<=', endDate));

    const querySnapshot = await getDocs(q);
    const allReadings = [];
    querySnapshot.forEach(doc => {
        const data = doc.data().ekgData;
        const timestamp = doc.id;
        allReadings.push({ timestamp, data });
    });
    return allReadings;
}

async function loadData() {
    const selectedDate = document.getElementById('datePicker').value;
    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    try {
        const allReadings = await fetchEcgReadingsForDate(selectedDate);
        if (allReadings.length === 0) {
            alert("No readings found for this date.");
            return;
        }

        let batchIndex = 0;
        const displayNextBatch = () => {
            if (batchIndex >= allReadings.length) {
                alert("All batches displayed.");
                return;
            }

            const { timestamp, data } = allReadings[batchIndex++];
            document.getElementById('timestampValue').textContent = timestamp;
            ecgChart.data.labels = data.map((_, i) => i * 10 + 'ms');
            ecgChart.data.datasets[0].data = data;
            ecgChart.update();

            // Clear chart and show next batch after a delay
            setTimeout(() => {
                ecgChart.data.labels = [];
                ecgChart.data.datasets[0].data = [];
                ecgChart.update();
                displayNextBatch();
            }, 5000); // Delay before showing the next batch
        };

        displayNextBatch();
    } catch (error) {
        console.error("Error loading data: ", error);
        alert("Failed to load data.");
    }
}