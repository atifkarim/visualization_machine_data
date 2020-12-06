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
var getData_json = function test() {
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



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// DATA FROM CSV /////////////////////////////////////////////////////

/*var dataPoints = [];

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
// var chart = new CanvasJS.Chart("chartContainer_bottom_left");

// $.get("https://raw.githubusercontent.com/atifkarim/Time-Series-Forecasting-Using-Machine-Learning-Algorithm/develop/csv_column_2.csv", function(data)
var getData_csv = function test() {
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
*/