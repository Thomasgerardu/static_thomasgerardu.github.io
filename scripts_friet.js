$(document).ready(function () {
    // Load the CSV file
    Papa.parse("friet.csv", {
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

            var naamOptions = new Set();
            var staddorpOptions = new Set();

            // Collect options for filtering
            data.forEach(function (row) {
                naamOptions.add(row.Frituur);
                staddorpOptions.add(row.Locatie);
            });

            // Convert Sets to Arrays and sort them alphabetically
            naamOptions = Array.from(naamOptions).sort();
            staddorpOptions = Array.from(staddorpOptions).sort();

            // Populate the filter dropdowns
            naamOptions.forEach(function (option) {
                $('#naamFilter').append('<option value="' + option + '">' + option + '</option>');
            });

            staddorpOptions.forEach(function (option) {
                $('#staddorpFilter').append('<option value="' + option + '">' + option + '</option>');
            });

            // Populate the table
            data.forEach(function (row) {
                const overall = calculateOverall(row); // Calculate overall rating dynamically

                $('#datatable tbody').append(
                    '<tr>' +
                    '<td>' + row.Locatie + '</td>' +
                    '<td><a href="' + row.Link + '" target="_blank">Link</a></td>' +
                    '<td>' + row.Frituur + '</td>' +
                    '<td>' + row.Date + '</td>' +
                    '<td><img src="' + row.Pic + '" alt="' + row.Frituur + '" class="thumbnail"></td>' +
                    '<td>' + row.Opmerking + '</td>' +
                    '<td class="scores">' +
                        '<div class="score-line">Taste: ' + generateStars(row.Taste) + '</div>' +
                        '<div class="score-line">Crunch: ' + generateStars(row.Crunch) + '</div>' +
                        '<div class="score-line">Presentation: ' + generateStars(row.Presentation) + '</div>' +
                        '<div class="score-line">Mayo: ' + generateStars(row.Mayo) + '</div>' +
                    '</td>' +
                    '<td data-overall="' + overall + '">' + generateStars(overall) + '</td>' + // Overall score
                    '</tr>'
                );
            });

            // Initialize DataTable
            var table = $('#datatable').DataTable({
                "paging": true,
                "info": false,
                "searching": true, // Enable global search
                "lengthChange": false, // Disable length change dropdown  
                "dom": 'lrtip', // Removes the global search box
                "columnDefs": [
                    {
                        targets: 6, // The "Overall" column index
                        type: 'num', // Ensure sorting treats it as a number
                        orderData: [6], // Sort by the overall score
                    }
                ]
            });

            // Custom filtering by naam and staddorp
            $('#naamFilter').on('change', function () {
                table.column(1).search(this.value).draw();
            });

            $('#staddorpFilter').on('change', function () {
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
            $('#datatable').on('click', '.thumbnail', function () {
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

    // Function to calculate the overall score (average of ratings)
    function calculateOverall(row) {
        const total = parseFloat(row.Taste) + parseFloat(row.Crunch) + parseFloat(row.Presentation) + parseFloat(row.Mayo);
        return (total / 4).toFixed(1); // Average rounded to 1 decimal
    }
});
