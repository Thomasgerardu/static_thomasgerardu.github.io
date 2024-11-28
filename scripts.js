$(document).ready(function () {
    // Load the CSV file
    Papa.parse("chips.csv", {
        download: true,
        header: true,
        complete: function (results) {
            var data = results.data;

            // Convert the Date column to ISO format for sorting
            data.forEach(function (row) {
                if (row.Date) {
                    // Convert dd/mm/yyyy to yyyy-mm-dd
                    var parts = row.Date.split('/');
                    if (parts.length === 3) {
                        row.Date = new Date(parts[2], parts[1] - 1, parts[0]).toISOString().split('T')[0];
                    }
                }
            });

            var tasteOptions = new Set();
            var brandOptions = new Set();

            // Collect options for filtering
            data.forEach(function (row) {
                tasteOptions.add(row.Taste);
                brandOptions.add(row.Brand);
            });

            // Convert Sets to Arrays and sort them alphabetically
            tasteOptions = Array.from(tasteOptions).sort();
            brandOptions = Array.from(brandOptions).sort();

            // Populate the filter dropdowns
            tasteOptions.forEach(function (option) {
                $('#tasteFilter').append('<option value="' + option + '">' + option + '</option>');
            });

            brandOptions.forEach(function (option) {
                $('#brandFilter').append('<option value="' + option + '">' + option + '</option>');
            });

            // Populate the table
            data.forEach(function (row) {
                $('#myTable tbody').append(
                    '<tr>' +
                    '<td>' + row.Brand + '</td>' +
                    '<td>' + row.Taste + '</td>' +
                    '<td>' + row.Date + '</td>' +
                    '<td><img src="' + row.Pic + '" alt="' + row.Taste + '" class="thumbnail"></td>' +
                    '<td>' + row.Opmerking + '</td>' +
                    '<td>' + generateStars(row.Rating) + '</td>' +
                    '</tr>'
                );
            });

            // Initialize DataTable
            var table = $('#myTable').DataTable({
                "paging": true,
                "info": false,
                "searching": true, // Enable global search
                "dom": 'lrtip' // Removes the global search box
            });

            var datum_startmoment = '2024-05-01'
            var datum_bijgewerkt = '2024-10-25'

            // Hardcoded date and time in long date format
            var datum_nu = new Date(datum_bijgewerkt).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            var datum_start = new Date(datum_startmoment).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Calculate the total number of rows (aantal)
            var aantal = table.rows().count();

            // Calculate the number of weeks since dattimestart
            var datetimestart = new Date(datum_startmoment); // Start date as yyyy-mm-dd
            var weeksPassed = Math.floor((new Date(datum_bijgewerkt) - datetimestart) / (1000 * 60 * 60 * 24 * 7)); // Use hardcoded current date

            // Calculate x = aantal / weeksPassed
            var x = (weeksPassed > 0) ? (aantal / weeksPassed).toFixed(2) : aantal;

            // Update the text in the paragraph with strong tags
            var text = `In deze tabel staan alle zakken chips die ik heb gegeten. Sommige zakken heb ik helemaal alleen gegeten, andere met vrienden. Ik werk de website eens in de zoveel tijd bij. Ik ben <strong>${datum_start}</strong> begonnen met de chipsverzameling. Op het moment van schrijven (<strong>${datum_nu}</strong>) heb ik <strong>${aantal}</strong> zakken gegeten. Dat is ongeveer <strong>${x}</strong> zakken per week. Prima lijkt me zo. Ik ben verder nog aan de dunne kant dus geen probleem.`;

            $('#chipsInfo').html(text); // Use .html() instead of .text() to render HTML

            // Custom filtering by Taste and Brand
            $('#tasteFilter').on('change', function () {
                table.column(1).search(this.value).draw();
            });

            $('#brandFilter').on('change', function () {
                table.column(0).search(this.value).draw();
            });

            // Link custom search box to DataTable search
            $('#searchBox').on('keyup', function () {
                table.search(this.value).draw();
            });

            // Modal logic
            var modal = $('#imageModal');
            var modalImg = $('#img01');
            var span = $('.close');

            // When the user clicks on the image, open the modal
            $('#myTable').on('click', '.thumbnail', function () {
                modal.css("display", "block");
                modalImg.attr('src', $(this).attr('src'));
            });

            // When the user presses the Escape key, close the modal
            $(window).on('keydown', function (event) {
                if (event.key === "Escape") { // Check if the Escape key was pressed
                    modal.css("display", "none");
                }
            });

            // When the user clicks on <span> (x), close the modal
            span.on('click', function () {
                modal.css("display", "none");
            });

            // Close the modal when clicking outside of the image
            $(window).on('click', function (event) {
                if ($(event.target).is(modal)) {
                    modal.css("display", "none");
                }
            });

        }
    });
    // Function to generate star rating based on the number
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '&#9733;'; // Full star
            } else {
                stars += '&#9734;'; // Empty star
            }
        }
        return stars;
    }
});
