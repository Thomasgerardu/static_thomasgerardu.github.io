$(document).ready(function () {

    // Full-screen image fade-out logic
    $('#image-container').css('opacity', '1'); // Ensure the image is visible initially
    setTimeout(function () {
        $('#image-container').addClass('hidden');
    }, 2000);
    // Load the CSV file
    Papa.parse("chips.csv", {
        download: true,
        header: true,
        complete: function (results) {
            var data = results.data;
            var tasteOptions = new Set();
            var brandOptions = new Set();

            // Populate the table
            data.forEach(function (row) {
                $('#myTable tbody').append(
                    '<tr>' +
                    '<td>' + row.Name + '</td>' +
                    '<td>' + row.Brand + '</td>' +
                    '<td>' + row.Taste + '</td>' +
                    '<td>' + row.Date + '</td>' +
                    '<td><img src="' + row.Pic + '" alt="' + row.Name + '" class="thumbnail"></td>' +
                    '</tr>'
                );

                // Collect options for filtering
                tasteOptions.add(row.Taste);
                brandOptions.add(row.Brand);
            });

            // Populate the filter dropdowns
            tasteOptions.forEach(function (option) {
                $('#tasteFilter').append('<option value="' + option + '">' + option + '</option>');
            });

            brandOptions.forEach(function (option) {
                $('#brandFilter').append('<option value="' + option + '">' + option + '</option>');
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

            // Modal logic
            var modal = $('#imageModal');
            var modalImg = $('#img01');
            var span = $('.close');

            // When the user clicks on the image, open the modal
            $('#myTable').on('click', '.thumbnail', function () {
                modal.css("display", "block");
                modalImg.attr('src', $(this).attr('src'));
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
});
