$(document).ready(function() {

    $('form').on('submit', function(event) {

        $.ajax({
                data: {
                    name: $('#nameInput').val(),
                    email: $('#emailInput').val()
                },
                type: 'POST',
                url: '/post_for_db',
                success: function(data) {
                    console.log(data)
                    $("body").html(data);
                    // This will navigate to your preferred location
                    document.location = 'render_table_from_db';
                    // window.location.href = url;
                },
            })
            .done(function(data) {
                console.log("data done: ", data);
                if (data.error) {
                    $('#errorAlert').text(data.error).show();
                    $('#successAlert').hide();
                } else {
                    $('#successAlert').text(data.name).show();
                    $('#errorAlert').hide();
                }

            });
    });
});