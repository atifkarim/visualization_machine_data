// source https://stackoverflow.com/questions/21566649/flask-button-run-python-without-refreshing-page

var python_button_function = function() {
    $(function() {
        $('a#test').bind('click', function() {
            $.getJSON('/background_process_test',
                function(data) {
                    //do nothing
                });
            return false;
        });
    });
};

var update_write_function_for_table = function() {
    $(function() {
        $('a#write_function_update_for_table').bind('click', function() {
            $.getJSON('/write_function_update_for_table',
                function(data) {
                    //do nothing
                });
            return false;
        });
    });
};

var stop_flask_server = function() {
    $(function() {
        $('a#shutdown').bind('click', function() {
            $.getJSON('/shutdown',
                function(data) {
                    //do nothing
                });
            return false;
        });
    });
};