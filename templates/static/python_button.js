var python_button_function = function () {
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