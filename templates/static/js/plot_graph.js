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

/** function for Plotly JS */

function create_dataPoint_array(data) {
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

/** trying to make a generic layout for all kind of plot */
function generic_layout({ given_title = "the title is not provided", x_min = 0, x_max = 15, x_axis_title = "x_axis", y_min = 0, y_max = 15, y_axis_title = "y_axis" } = {}) {
    let layout_object = {
        title: {
            text: given_title
        },
        showlegend: true,
        xaxis: {
            range: [x_min, x_max],
            title: x_axis_title
        },
        yaxis: {
            range: [y_min, y_max],
            title: y_axis_title
        },
    };
    return layout_object;
}

/** x vs y1, y2 plot */
/** x vs i,q */
/** i vs q */
function dataPoint_x_vs_random_y({ data, set_type = "scatter", set_mode = "lines" } = {}) {
    let data_x_y1_y2 = create_dataPoint_array(data); /** this one make the data array. no key is there */
    data_x_y1_y2_traces = [];
    for (let j = 1; j < data_x_y1_y2.length; j++) {
        data_x_y1_y2_traces.push({
            x: data_x_y1_y2[0],
            y: data_x_y1_y2[j],
            mode: set_mode,
            type: set_type,
            name: Object.keys(data[0])[j]
        });
    }
    return data_x_y1_y2_traces;
}

/** x1 vs y1, x2 vs y2 ... xn vs yn plot */
/** so be concern about the datastyle. 1 vs 1, n vs n */
/** so divide the data in the mid */
/** and also place in main dataset all X together and all Y together */

function dataPoint_xn_vs_yn({ data, set_type = "scatter", set_mode = "lines" } = {}) {
    let data_xn_yn = create_dataPoint_array(data);
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
            name: Object.keys(data[0])[mid + j]
        });
    }
    return data_xn_yn_traces;
}

/** x vs y plot. Histogram also */
function make_2D_histogram(data) {
    let data_xy = create_dataPoint_array(data);
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
    return data_x_y_traces_hist;
}


let getData_json = function test() {
    $.get("/auto_update_plot", function(data) {
        // console.log("data val type here: ", data[2])
        /* just change in the following line the function name to get your desired result*/
        chart.options.data = createMultilpleLines_fix_x_random_y_name(data[0]);
        chart_1.options.data = createMultilpleLines_diff_x_diff_y(data[1]);
        chart.render();
        chart_1.render();

        // heatmap_chart.data(data[2]);
        // heatmap_chart.draw();

        let layout_dataPoint_a_vs_i_q = generic_layout({
            given_title: "x vs y1, y2 presentation",
            x_min: 0,
            x_max: 600,
            x_axis_title: "x",
            y_min: -20,
            y_max: 20,
            y_axis_title: "y1,y2"
        });
        Plotly.react('a_vs_i_q_plot_line', dataPoint_x_vs_random_y({ data: data[0], set_type: "scatter", set_mode: "lines" }), layout_dataPoint_a_vs_i_q, { editable: true });

        let layout_dataPoint_xn_vs_yn = generic_layout({
            given_title: "xn vs yn presentation",
            x_min: 0,
            x_max: 600,
            x_axis_title: "x1, x1",
            y_min: -20,
            y_max: 20,
            y_axis_title: "y1,y2"
        });
        Plotly.react('xn_vs_yn_plot_line', dataPoint_xn_vs_yn({ data: data[1], set_type: "scatter", set_mode: "lines" }), layout_dataPoint_xn_vs_yn, { editable: true });


        let layout_dataPoint_i_vs_q = generic_layout({
            given_title: "i vs q data presentation(in pyfile df_iq_data)",
            x_min: -40,
            x_max: 40,
            x_axis_title: "i",
            y_min: -40,
            y_max: 40,
            y_axis_title: "q"
        });
        Plotly.react('i_vs_q_plot_line', dataPoint_x_vs_random_y({ data: data[2], set_type: "scatter", set_mode: "lines" }), layout_dataPoint_i_vs_q, { editable: true });
        Plotly.react('i_vs_q_plot_scatter', dataPoint_x_vs_random_y({ data: data[2], set_type: "scatter", set_mode: "markers" }), layout_dataPoint_i_vs_q, { editable: true });


        // Plotly.react('plot_container_second_plotly', dataPoint_xn_vs_yn(data[1]), generic_layout({given_title:"NEW xn vs yn plot"}));


        Plotly.react('i_vs_q_2D_hist', make_2D_histogram(data[2]), { title: 'i_q 2D Histogram' });
    });
}

// var fixmeTop = $('#all_button').offset().top;
// $(window).scroll(function() {
//     var currentScroll = $(window).scrollTop();
//     if (currentScroll >= fixmeTop) {
//         $('#all_button').css({
//             position: 'fixed',
//             top: '0',
//             left: '0'
//         });
//     } else {
//         $('#all_button').css({
//             position: 'static',
//             top: '0',
//             left: '0'
//         });
//     }
// });

// following function fetch real time data from flask's endpoint "real_time_data_plot"
// and plotting a real time data plot using plotlyJS
// Source: https://redstapler.co/javascript-realtime-chart-plotly/

var layout_dataPoint_realTime = generic_layout({
    given_title: "Real Time Data Presentation Test",
    x_min: 0,
    x_max: 100,
    x_axis_title: "Sample",
    y_min: 0,
    y_max: 7,
    y_axis_title: "Real Time DataSet"
});

var cnt = 0;
var real_time_data_array = [];

let realTimePlot = function realTimeDataPlot() {
    $.get("/real_time_data_plot", function(real_data) {
        // console.log("NEW real_time_data: ", real_data);
        real_time_data_array.push(real_data);
        if (real_time_data_array.length > 20)
        {
            real_time_data_array.shift();
        }

        console.log(real_time_data_array);
        Plotly.react('real_time_data', [{y:real_time_data_array, type:'line'}], { title:'real time data', editable: true });

        // Plotly.restyle('real_time_data', {y:[[real_time_data_array]]});

        // var cnt = 0;
        // var interval = setInterval(function() {
        //     Plotly.extendTraces('real_time_data', {
        //                         y: [[real_data]]
        //                         }, [0])
        // if(++cnt === 100) clearInterval(interval);
        // }, 300);

        // console.log("cnt: ", cnt);
        // setInterval(function(){
        //     Plotly.extendTraces('real_time_data',{ y:[[real_data]]}, [0]);
        //     cnt++;
        //     // if(cnt > 500) {
        //     //     Plotly.relayout('real_time_data',{
        //     //         xaxis: {
        //     //             range: [cnt-500,cnt]
        //     //         }
        //     //     });
        //     // }
        // },600);
    });
}
