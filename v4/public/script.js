// Add current year to footer
let year = (new Date()).getFullYear();
let yearSpan = document.querySelector("#year");

yearSpan.innerHTML = year;