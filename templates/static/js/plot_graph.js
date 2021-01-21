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
    // console.log("lines len: ", lines.length);
    // console.log("lines: ", lines);

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
    /** this will count how many child key is there.
     * eg. x,y1,y2 -- then obtained_child_key = 3.
     * i,q then obtained_child_key = 2 */
    let obtained_child_key = Object.keys(data[0]).length;

    z = [];
    for (let i = 0; i < obtained_child_key; i++) {
        tmp = [];
        for (let j in data) {
            tmp.push(data[j][Object.keys(data[j])[i]]);
        }
        z.push(tmp);
    }
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

        let generic_lay = {
            title: 'generic plot',
            showlegend: true
        };

        /** x vs y1, y2 plot */
        let data_x_y1_y2 = make_2D_hist_container(data[0]);
        data_x_y1_y2_traces = [];
        for (let j = 1; j < data_x_y1_y2.length; j++) {
            data_x_y1_y2_traces.push({
                x: data_x_y1_y2[0],
                y: data_x_y1_y2[j],
                type: 'scatter',
                name: 'y_' + j
            });
        }
        Plotly.react('plot_container_first_plotly', data_x_y1_y2_traces, generic_lay);

        /** x1 vs y1, x2 vs y2 ... xn vs yn plot */
        let data_xn_yn = make_2D_hist_container(data[1]);
        console.log("data_xn_yn len: ", data_xn_yn.length);
        console.log("data_xn_yn: ", data_xn_yn);
        if (data_xn_yn.length % 2 == 1) {
            throw new Error("Length of data_xn_yn has to be even!");
        }

        data_xn_yn_traces = [];
        mid = data_xn_yn.length / 2;
        for (let j = 0; j < mid; j++) {
            data_xn_yn_traces.push({
                x: data_xn_yn[j],
                y: data_xn_yn[mid + j],
                type: 'scatter',
                name: 'y_' + j
            });
        }
        Plotly.react('plot_container_second_plotly', data_xn_yn_traces, generic_lay);

        /** x vs y plot. Histogram also */
        let data_xy = make_2D_hist_container(data[2]);
        data_x_y_traces_hist = [];

        for (let j = 1; j < data_xy.length; j++) {
            data_x_y_traces_hist.push({
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
                type: 'histogram2d'
            });
        }

        let two_d_hist_data_layout = {
            title: {
                text: 'i vs q 2D Histogram',
            }
        };

        let i_q_linechart = [{
            x: data_xy[0],
            y: data_xy[1],
            name: 'q',
            mode: 'markers'
        }];

        let i_q_linechart_layout = {
            showlegend: true,
            title: 'i vs q line plot',
            xaxis: {
                range: [-2, 8],
                title: 'value of i'
            },
            yaxis: {
                range: [-3, 8],
                title: 'value of q'
            }
        };

        Plotly.react('heatmap_container', data_x_y_traces_hist, two_d_hist_data_layout);
        Plotly.react('heatmap_container_linechart', i_q_linechart, i_q_linechart_layout);
    });
}

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