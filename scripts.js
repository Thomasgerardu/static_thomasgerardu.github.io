$(document).ready(function () {
    // console.log("Document is ready."); // Check if the document is ready
    // $('#overlay').on('click', function () {
    //     $(this).fadeOut('slow');
    // });
    // $(document).on('keydown', function (event) {
    //     if (event.key === "Escape") { // Check if the Escape key was pressed
    //         $('#overlay').fadeOut('slow'); // Hide the overlay
    //     }
    // });
    // Load the CSV file
    Papa.parse("chips.csv", {
        download: true,
        header: true,
        complete: function (results) {
            var data = results.data;
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
                    '<td>' + row.Name + '</td>' +
                    '<td>' + row.Brand + '</td>' +
                    '<td>' + row.Taste + '</td>' +
                    '<td>' + row.Date + '</td>' +
                    '<td><img src="' + row.Pic + '" alt="' + row.Name + '" class="thumbnail"></td>' +
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

            // Custom filtering by Taste and Brand
            $('#tasteFilter').on('change', function () {
                table.column(2).search(this.value).draw();
            });

            $('#brandFilter').on('change', function () {
                table.column(1).search(this.value).draw();
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

