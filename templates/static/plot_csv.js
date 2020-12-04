function plot_csv()
{
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

    // $.get("https://raw.githubusercontent.com/atifkarim/Time-Series-Forecasting-Using-Machine-Learning-Algorithm/develop/csv_column_2.csv", function(data)
$.get("static/json_files/csv_column_2.csv", function(data)
{
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