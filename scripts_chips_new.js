// scripts_chips_new.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";

$.fn.dataTable.moment('DD/MM/YYYY');

const firebaseConfig = {
    apiKey: "AIzaSyCW9ncgY2xktBgSIOw_bQuHMX1ERG8rXOc",
    authDomain: "chips-f9759.firebaseapp.com",
    databaseURL: "https://chips-f9759-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chips-f9759",
    storageBucket: "chips-f9759.firebasestorage.app",
    messagingSenderId: "458774611531",
    appId: "1:458774611531:web:6ae0e6923ce6fa7f55efce"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentChipId = null;
let currentRating = 0;

// Setup star rating interaction
function updateStarDisplay() {
    document.querySelectorAll('#starRating span').forEach(star => {
        const val = parseInt(star.dataset.value);
        star.classList.toggle('selected', val <= currentRating);
    });
}

document.querySelectorAll('#starRating span').forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.value);
        updateStarDisplay();
    });
});

// Open comment modal
window.openCommentModal = function (chipId) {
    currentChipId = chipId;
    document.getElementById("commentModal").style.display = "block";
    loadComments(chipId);
    currentRating = 0;
    updateStarDisplay();
};

function loadComments(chipId) {
    const list = document.getElementById("commentList");
    list.innerHTML = "Loading...";
    const commentsRef = ref(db, 'comments/' + chipId);

    get(commentsRef).then((snapshot) => {
        const data = snapshot.val();
        list.innerHTML = "";
        if (data) {
            Object.values(data).forEach(comment => {
                const rating = parseInt(comment.rating) || 0;
                const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
                const li = document.createElement("li");
                li.textContent = `${comment.name}: ${stars} – ${comment.text}`;
                list.appendChild(li);
            });
        } else {
            list.innerHTML = "<li>No comments yet.</li>";
        }
    });
}

// Submit comment
const submitBtn = document.getElementById("submitCommentBtn");
submitBtn.addEventListener("click", () => {
    const name = document.getElementById("commentName").value.trim();
    const text = document.getElementById("commentText").value.trim();
    if (!name || !text) return alert("Ja hallo je kunt niet raten zonder je naam te noemen he, anoniempje!");

    const commentsRef = ref(db, 'comments/' + currentChipId);
    push(commentsRef, { name, text, rating: currentRating });

    document.getElementById("commentName").value = "";
    document.getElementById("commentText").value = "";
    currentRating = 0;
    updateStarDisplay();
    loadComments(currentChipId);
});

// Render star display in table
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '&#9733;' : '&#9734;';
    }
    return stars;
}

// Load CSV and render table
Papa.parse('chips.csv', {
    download: true,
    header: true,
    complete: function (results) {
        const data = results.data;

        const tableData = data.map(row => {
            const img = `<img src="${row.Pic}" class="thumbnail" alt="chip" />`;
            const button = `<button onclick="openCommentModal(${row.ID})">Comments</button>`;
            return [
                row.ID,
                row.Name,
                row.Brand,
                row.Taste,
                row.Date,
                img,
                generateStars(parseFloat(row.Rating)),
                row.Opmerking,
                button
            ];
        });

        const table = $('#chipTable').DataTable({
            data: tableData,
            columns: [
                { title: "ID" },
                { title: "Name" },
                { title: "Brand" },
                { title: "Taste" },
                { title: "Date" },
                { title: "Pic" },
                { title: "Rating" },
                { title: "Opmerking" },
                { title: "Comments" }
            ],
            searching: false,
            lengthChange: false
        });

        // Custom filter
        const tasteOptions = new Set();
        const brandOptions = new Set();
        data.forEach(row => {
            tasteOptions.add(row.Taste);
            brandOptions.add(row.Brand);
        });

        // Populate Taste filter
        Array.from(tasteOptions).sort().forEach(taste => {
            $('#tasteFilter').append(`<option value="${taste}">${taste}</option>`);
        });

        // Populate Brand filter
        Array.from(brandOptions).sort().forEach(brand => {
            $('#brandFilter').append(`<option value="${brand}">${brand}</option>`);
        });

        // Add filtering behavior
        $('#brandFilter').on('change', function () {
            table.column(2).search(this.value).draw(); // Brand = column 2
        });

        $('#tasteFilter').on('change', function () {
            table.column(3).search(this.value).draw(); // Taste = column 3
        });

        $('#searchBox').on('keyup', function () {
            table.search(this.value).draw();
        });


        // Modal logic
        const modal = $('#imageModal');
        const modalImg = $('#img01');
        const span = $('.close');

        $('#chipTable').on('click', '.thumbnail', function () {
            modal.css("display", "block");
            modalImg.attr('src', $(this).attr('src'));
        });

        $(window).on('keydown', function (event) {
            if (event.key === "Escape") modal.css("display", "none");
        });

        span.on('click', function () {
            modal.css("display", "none");
        });

        $(window).on('click', function (event) {
            if ($(event.target).is(modal)) modal.css("display", "none");
        });

        // Logic for text about chipstable
        const datum_startmoment = '2024-05-01';
        const datum_bijgewerkt = '2025-04-15';

        const datum_nu = new Date(datum_bijgewerkt).toLocaleDateString('nl-NL', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const datum_start = new Date(datum_startmoment).toLocaleDateString('nl-NL', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const aantal = table.rows().count();
        const datetimestart = new Date(datum_startmoment);
        const weeksPassed = Math.floor((new Date(datum_bijgewerkt) - datetimestart) / (1000 * 60 * 60 * 24 * 7));
        const x = (weeksPassed > 0) ? (aantal / weeksPassed).toFixed(2) : aantal;

        const text = `In deze tabel staan alle zakken chips die ik heb gegeten. Sommige zakken heb ik helemaal alleen gegeten, andere met vrienden. Ik werk de website eens in de zoveel tijd bij. Ik ben <strong>${datum_start}</strong> begonnen met de chipsverzameling. Op het moment van schrijven (<strong>${datum_nu}</strong>) heb ik <strong>${aantal}</strong> zakken gegeten. Dat is ongeveer <strong>${x}</strong> zakken per week. Prima lijkt me zo. Ik ben verder nog aan de dunne kant dus geen probleem.`;

        $('#chipsInfo').html(text);

    }
});
