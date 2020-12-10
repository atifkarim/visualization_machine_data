// window.onload = function() {
function remote_graph()  {

	var dataPoints = [];
	
	var chart = new CanvasJS.Chart("chartContainer", {
		zoomEnabled: true,
		animationEnabled: true,
		theme: "light2",
		title: {
			text: "Machine Data"
		},
		axisX: {
			title: "Sample",
			titleFontSize: 24,
			includeZero: true
		},
		axisY: {
			title: "Value",
			titleFontSize: 24,
			includeZero: true
		},
		legend: {
			cursor: "default",
			fontSize: 15,
			fontFamily: "tamoha",
			fontColor: "Sienna",
			horizontalAlign: "center", // left, center ,right 
			verticalAlign: "bottom",  // top, center, bottom
		 },
	 
		data: [{
			type: "line",
			yValueFormatString: "#,### Units",
			showInLegend: true,
			dataPoints: dataPoints
		}]
	});
	
	function addData(data) {
		console.log(data)
		for (var i = 0; i < data.length; i++) {
			dataPoints.push({
				x: data[i].x_axis,
				y: data[i].y_axis
			});
		}
		chart.render();
	
	}
	
	$.getJSON("https://raw.githubusercontent.com/atifkarim/Time-Series-Forecasting-Using-Machine-Learning-Algorithm/develop/abc.json", addData);

	// $.getJSON("http://192.168.1.77:8080/js_py_test_proj/b.json", addData);

	// $.getJSON("../../json_files/abc.json", addData);

}