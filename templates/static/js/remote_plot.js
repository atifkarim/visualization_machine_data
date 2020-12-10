// window.onload = function() {

function remote_plot()  {

	var dataPoints_1 = [];

	var chart_1 = new CanvasJS.Chart("chartContainer_right", {
		zoomEnabled: true,
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Daily Sales Data"
		},
		axisY: {
			title: "Units",
			titleFontSize: 24,
			includeZero: true
		},

		// legend: {
		// 	horizontalAlign: "left", // left, center ,right 
		// 	verticalAlign: "center",  // top, center, bottom
		//  },
		data: [{
			type: "column",
			yValueFormatString: "#,### Units",
			dataPoints: dataPoints_1
		}]
	});
	
	function addData_1(data_1) {
		console.log(data_1)
		for (var i = 0; i < data_1.length; i++) {
			dataPoints_1.push({
				x: new Date(data_1[i].date),
				y: data_1[i].units
			});
		}
		chart_1.render();
	
	}
	
	$.getJSON("https://raw.githubusercontent.com/atifkarim/Time-Series-Forecasting-Using-Machine-Learning-Algorithm/develop/daily-sales-data.json", addData_1);

	// $.getJSON("http://192.168.1.77:8080/js_py_test_proj/a.json", addData_1);

	// $.getJSON("../../json_files/daily-sales-data.json", addData_1);

	
	}