import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as l}from"./chart-CK3GlVs3.js";import{c,s as d}from"./auth-Dd_LY3a3.js";import{d as m,a as u}from"./displayHelpers-CtlhmCs7.js";import{g as p}from"./dataServices-BLqrFuHg.js";import"https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";import"./firebaseConfig-HqSgYK5z.js";import"https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";var e;let n=[],i,a;const h=async()=>{let t=document.getElementById("pacientCNP").value;t?(e=await p(t),e&&await m(e,n,a)):alert("Please fill in the CNP of the pacient!")},B=()=>{a.data.length===0?alert("The chart is empty."):u(e,n,i)};document.addEventListener("DOMContentLoaded",()=>{c();const t=l("chartdiv");i=t.chart,a=t.series;const o=document.getElementById("loadDataButton"),r=document.getElementById("analyzeDataButton"),s=document.getElementById("signOutButton");o.addEventListener("click",h),r.addEventListener("click",B),s.addEventListener("click",d)});
