
var dataPoints = [];

function getDataPointsFromCSV(csv) {
    var dataPoints = csvLines = points = [];
    csvLines = csv.split(/[\r?\n|\r|\n]+/);

    for (var i = 0; i < csvLines.length; i++)
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");
            dataPoints.push({
                x: parseFloat(points[0]),
                y: parseFloat(points[1])
            });
        }
    return dataPoints;
}

function getDataPointsFromCSV_1(csv) {
    var dataPoints = csvLines = points = [];
    csvLines = csv.split(/[\r?\n|\r|\n]+/);

    for (var i = 0; i < csvLines.length; i++)
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");
            dataPoints.push({
                x: parseFloat(points[0]),
                y: parseFloat(points[2])
            });
        }
    return dataPoints;
}
var chart = new CanvasJS.Chart("chartContainer_bottom_left");
// $.get("https://raw.githubusercontent.com/atifkarim/Time-Series-Forecasting-Using-Machine-Learning-Algorithm/develop/csv_column_2.csv", function(data)
function test() {
    $.get("static/json_files/csv_column_2.csv", function (data) {
        var chart = new CanvasJS.Chart("chartContainer_bottom_left", {
            title: {
                text: "Chart from CSV",
            },
            data: [{
                type: "line",
                dataPoints: getDataPointsFromCSV(data)
            },
            {
                type: "line",
                dataPoints: getDataPointsFromCSV_1(data)
            }
            ]
        });

        chart.render();

    });
}

function testUpdate() {
    dataPoints = [];

    $.get("static/json_files/csv_column_2.csv", function (data) {
        chart.options.data = []
        chart.options.data.dataPoints = [];
        
        
            chart.options.data.dataPoints.push(getDataPointsFromCSV(data));
            chart.render();

    })
}
// $("#addDataPoint").click(function () {

// 	var length = chart.options.data[0].dataPoints.length;
// 	chart.options.title.text = "New DataPoint Added at the end";
// 	chart.options.data[0].dataPoints.push({ y: 25 - Math.random() * 10});
// 	chart.render();

// 	});

////////////////////////////////////////////////////////////////////////

// create initial empty chart
var ctx = document.getElementById("mycanvas");
var myChart =  new Chart(ctx, {
  type: 'line',
  color: 'red',
  data: {
      datasets: [{
          label: 'Scatter Dataset',
          data: [],
          data2:[]
      }]
  },
  options: {
      scales: {
          xAxes: [{
              type: 'linear',
              position: 'top'
          }]
      }
  }
});

// logic to get new data
var getData = function() {
  $.get("/atif", function (data) {
      let xy = [];
      let xz = [];
      console.log('data: ',data);
      data.forEach (e =>{
          xy.push({'x': e.x, 'y': e.y});

          xz.push({'x': e.x, 'z': e.z});
      })
      
      myChart.data.datasets[0].data = xy;
      myChart.data.datasets[0].data2 = xz;

      // re-render the chart
      myChart.update();
    })

};