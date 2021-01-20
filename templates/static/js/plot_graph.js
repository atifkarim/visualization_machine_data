/*
the following function takes the information from the JSON file if the goal is to
plot graph x vs i,q,k,l......... So here the problem is y axis key value is different.
*/

var key_name_array = ["x", "y1", "y2"] // make the array by observing your JSON file. Could be improved.

function getDataPoints_fix_x_random_y_name(data, j) {
    let dataPoints = [];

    for (let i = 0; i < data.length; i++) {
        row = { x: data[i]["x"] };
        // following line could be one solution though it requires an extra making of array manually(here key_name_array)
        // row["y"] = data[i][key_name_array[j]];

        /* following line could be a better solution. It doesn't require any making of extra array. Just be sure your json key will not change their order
        eg: one time x,y,z,w and next time x,z,w,y. it will make problem. if it happens then choose the former line's solution. make an explicit array
        and give there key pair value and you know which index will go for 1st,2nd,3rd ...... nth line plot
        */

        row["y"] = data[i][Object.keys(data[i])[j]];
        // console.log("index j: ",j," and val is: ",Object.keys(data[i])[j]);  // you can see the right name of y axis

        dataPoints.push(row);
    }
    return dataPoints;
}


/*
the following function takes the information from the JSON file if the goal is to
plot graph x vs y1,y2,y3....... yn.
*/

var y_name_list = []

function getDataPoints_fix_x_diff_y(data, j) {
    let dataPoints = [];

    for (let i = 0; i < data.length; i++) {
        row = { x: data[i]["x"] };
        row["y"] = data[i]["y" + j];

        dataPoints.push(row);
    }
    return dataPoints;
}
/*
the following function takes the information from the JSON file if the goal is to
plot graph x1 vs y1, x2 vs x2, ....... , xn vs yn.
*/
function getDataPoints_diff_x_diff_y(data, j) {
    let dataPoints = [];

    for (let i = 0; i < data.length; i++) {
        row = {};
        row["x"] = data[i]["x" + j];
        row["y"] = data[i]["y" + j];

        dataPoints.push(row);
    }
    return dataPoints;
}

/*
the following function takes the information from the JSON file if the goal is to plot graph
x vs i,q,k,l...... yn. For this it calls getDataPoints_fix_x_random_y_name this function.
*/

function createMultilpleLines_fix_x_random_y_name(data) {
    lines = [];

    ys = Object.keys(data[0]).length - 1;
    for (let j = 1; j <= ys; j++) {
        //console.log("check legend when j: ", j, " is: ", Object.keys(data[j - 1])[j])
        lines.push({
            type: "line",
            showInLegend: true,
            legendText: Object.keys(data[j - 1])[j],
            dataPoints: getDataPoints_fix_x_random_y_name(data, j)
        });
    }

    return lines;
}

/*
the following function takes the information from the JSON file if the goal is to plot graph
x vs y1,y2,y3....... yn. For this it calls getDataPoints_fix_x_diff_y this function.
*/

function createMultilpleLines_fix_x_diff_y(data) {
    lines = [];

    ys = Object.keys(data[0]).length - 1;
    for (let j = 1; j <= ys; j++) {
        lines.push({
            type: "line",
            dataPoints: getDataPoints_fix_x_diff_y(data, j)
        });
    }

    return lines;
}

/*
the following function takes the information from the JSON file if the goal is to plot graph 
x1 vs y1, x2 vs x2, ....... , xn vs yn. For this it calls getDataPoints_diff_x_diff_y function 
*/

function createMultilpleLines_diff_x_diff_y(data) {
    lines = [];

    ts = Object.keys(data[0]).length / 2;
    // console.log("data val: ", data[0])
    for (let j = 1; j <= (Object.keys(data[0]).length / 2); j++) {
        // console.log("NOW check legend when j: ",(j)," is: ",Object.keys(data[0])[30+j-1]);
        lines.push({
            type: "line",
            showInLegend: true,
            legendText: "y" + j,
            dataPoints: getDataPoints_diff_x_diff_y(data, j)
        });
    }

    return lines;
}

let chart = new CanvasJS.Chart("plot_container_first", {
    legend: {
        cursor: "default",
        fontSize: 15,
        fontFamily: "tamoha",
        fontColor: "Sienna",
        horizontalAlign: "right", // left, center ,right
        verticalAlign: "top", // top, center, bottom
    },
    theme: "light1",
    title: {
        text: "x vs y1, y2 data presentation",
    },
    axisX: {
        title: "x",
        titleFontSize: 24,
        includeZero: false,
        interlacedColor: "#F0F8FF"
    },

    axisY: {
        title: "y1, y2",
        titleFontSize: 24,
        includeZero: true
    },
    data: []
});

let chart_1 = new CanvasJS.Chart("plot_container_second", {
    legend: {
        cursor: "default",
        fontSize: 15,
        fontFamily: "tamoha",
        fontColor: "Sienna",
        horizontalAlign: "right", // left, center ,right
        verticalAlign: "top", // top, center, bottom
    },
    theme: "light1",
    title: {
        text: "x(1,2) vs y(1,2) data presentation",
    },
    axisX: {
        title: "x1, x2",
        titleFontSize: 24,
        includeZero: false,
        interlacedColor: "#F0F8FF"
    },

    axisY: {
        title: "y1, y2",
        titleFontSize: 24,
        includeZero: true
    },
    data: []
});

/************************************************** */
/********************** Heat Map ********************/
/************************************************** */
// // create the chart and set the data
// let heatmap_chart = anychart.heatMap(data = []); /** omit data is also possible */


// heatmap_chart.title("Test HeatMap Data");

// // create and configure the color scale.
// var customColorScale = anychart.scales.linearColor();
// customColorScale.colors(["#ACE8D4", "#00726A"]);

// // set the color scale as the color scale of the chart
// heatmap_chart.colorScale(customColorScale);
// // set the container id
// heatmap_chart.container("heatmap_container");

// heatmap_chart.xAxis().title("Sample X-Axis Name");
// heatmap_chart.yAxis().title("Sample Y-Axis Name");

/************************************************** */
/********************** 2D histogram ****************/
/************************************************** */

function make_2D_hist_container(data) {
    let x = [];
    let y = [];
    let z = [];
    for (let i in data) {
        x.push(data[i][Object.keys(data[i])[0]]);
        y.push(data[i][Object.keys(data[i])[1]]);
    }
    z = [x, y];
    return z;
}

let getData_json = function test() {
    $.get("/auto_update", function(data) {
        // console.log("data val type here: ", data[2])
        /* just change in the following line the function name to get your desired result*/
        chart.options.data = createMultilpleLines_fix_x_random_y_name(data[0]);
        chart_1.options.data = createMultilpleLines_diff_x_diff_y(data[1]);
        chart.render();
        chart_1.render();

        // heatmap_chart.data(data[2]);
        // heatmap_chart.draw();

        data_xy = make_2D_hist_container(data[2]);
        // data_xy = data[2];
        two_d_hist_data = [{
            x: data_xy[0],
            y: data_xy[1],
            xbins: {
                end: 10,
                size: 1,
                start: 0
            },
            ybins: {
                end: 10,
                size: 1,
                start: 0
            },
            type: 'histogram2d',
        }];

        Plotly.newPlot('heatmap_container', two_d_hist_data);
    });
}


// $(document).scroll(function() {
//     var y = $(document).scrollTop(), //get page y value 
//         header = $("#all_button"); // your div id
//     if (y >= 400) {
//         header.css({ position: "fixed", "top": "0", "left": "0" });
//     } else {
//         header.css("position", "static");
//     }
// });

var fixmeTop = $('#all_button').offset().top;
$(window).scroll(function() {
    var currentScroll = $(window).scrollTop();
    if (currentScroll >= fixmeTop) {
        $('#all_button').css({
            position: 'fixed',
            top: '0',
            left: '0'
        });
    } else {
        $('#all_button').css({
            position: 'static',
            top: '0',
            left: '0'
        });
    }
});