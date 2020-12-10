var inactivityTime = function () {
	var timer;

	window.onload = timerReset;
	document.onkeypress = timerReset;
	document.onmousemove = timerReset;
	document.onmousedown = timerReset; 
	document.ontouchstart = timerReset;
	document.onclick = timerReset;
	document.onscroll = timerReset;
	document.onkeypress = timerReset;

	function timerElapsed() {
		 console.log("Timer elapsed");
		 location.reload();
	};

	function timerReset() {
		 console.log("Reseting timer");
		 clearTimeout(timer);
		 timer = setTimeout(timerElapsed, 5000); // unit in seconds
	}
};


// formula of time unit
// number -- is it min/sec/hr
// conversion_unit_to_sec -- for sec it is 1, for min it is 60, for hr it is 60*60
// factor -- 1000
// eg --> 10 min will be -> 10*60*1000
// 5 sec will be -> 5*1*1000