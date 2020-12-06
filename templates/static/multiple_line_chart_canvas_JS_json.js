var dataPoints = [];

function getDataPointsFromCSV(data) {
    var dataPoints = [];
    for (var i = 0; i < data.length; i++) {
        dataPoints.push({
            x: data[i].x,
            y: data[i].y
        });
    }
    return dataPoints;
}

function getDataPointsFromCSV_1(data) {
    var dataPoints = [];
    for (var i = 0; i < data.length; i++) {
        dataPoints.push({
            x: data[i].x,
            y: data[i].z
        });
    }
    return dataPoints;
}
// var chart = new CanvasJS.Chart("chartContainer_bottom_left");

// $.get("https://raw.githubusercontent.com/atifkarim/Time-Series-Forecasting-Using-Machine-Learning-Algorithm/develop/csv_column_2.csv", function(data)
var getData = function test() {
    $.get("/auto_update", function (data) {
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