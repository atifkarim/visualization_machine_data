function createTable(caption, data) {
    let table = $("<table class='test_table'>");
    table.html("<caption>" + caption + "</caption>");

    let headers = getColumns(data[Object.keys(data)[0]]);
    let tr = $("<tr>");
    for (let i in headers) {
        tr.append("<th>" + headers[i] + "</th>");
    }
    table.append(tr);

    for (let row in data) {
        let tr = $("<tr>");
        for (let col in data[row]) {
            let format_data = check_input_val_type(data[row][col], 1);
            let td = $("<td>").text(format_data);
            // let td = $("<td>").text(data[row][col]);
            tr.append(td);
        }
        table.append(tr);
    }

    return table;
}


function getColumns(data) {
    let headers = [];
    for (let col in data) {
        headers.push(col);
    }

    return headers;
}


/**
 * Check value is float or int or string and return value. IF ffloat then it will round to a give fixed point. You can omit it if not required
 */
function check_input_val_type(y, fixed_range) {
    if (parseFloat(y) && (Number(y) === y && y % 1 !== 0)) {
        // console.log("y is a float and val is: ", y, " and conv: ", y.toFixed(fixed_range));
        y = y.toFixed(fixed_range);
        return y;
    } else if (!parseFloat(y)) {
        //   console.log("y is a string and val is: ", y);
        return y;
    } else {
        //   console.log("y is a int and val is: ", y);
        return y;
    }
}


function getTableData_json() {
    $.get("/auto_update_table", function(data) {
        let tbl_div = $("#table_div");
        tbl_div.html("");
        for (let t in data) {
            new_tbl = createTable("Table " + t, data[t]);
            tbl_div.append(new_tbl);
        }
    });
}



/* Usage of tabular JS is started*/

function make_arr(data) {
    let demod_arr = [];
    for (let t in data) {
        for (let x in data[t]) {
            /* console.log("t: ",t," ,x: ",x);*/
            /* console.log("data[t][x]: ", data[t][x]) ;*/
            demod_arr.push(data[t][x]);
        }
    }
    return demod_arr;
}

/*
This part will do later. It will stat from the first row of each device. eg: Demodulator--- value1, value2. This value will
come at first
*/

function make_arr_little(tabledata) {
    let demod_little = [];
    for (let x in tabledata) {
        demod_little.push(tabledata[x]);
    }
    return demod_little;
}
// res_little = make_arr_little(tabledata[Object.keys(tabledata)[1]]);

//create Tabulator on DOM element with id "example-table"
let table_1 = new Tabulator("#example-table", {
    height: "630px", // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: [], //assign data to table
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "first col", field: "00_data", width: 150 },
        { title: "second col", field: "01_add", hozAlign: "left" },
        { title: "third col", field: "02_sub" },
    ],
});

let table_2 = new Tabulator("#example-table_1", {
    height: false, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: [], //assign data to table
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "first col", field: "00_data", width: 150 },
        { title: "second col", field: "01_add", hozAlign: "left" },
        { title: "third col", field: "02_sub" },
    ],
});

function table_with_tabular() {
    $.get("/auto_update_table", function(data) {
        //console.log("I am here in Tabular");
        //console.log("data: ", data);
        // for (let i=0; i< Object.keys(data).length; i++) {
        //     console.log("key: ", i, "data[i]: ", data[i][0]);
        // }s
        // table.setData(make_arr(data));
        table_1.setData(make_arr_little(data[Object.keys(data)[0]]));
        table_2.setData(make_arr_little(data[Object.keys(data)[1]]));
        // table_3.setData(make_arr_little(data[Object.keys(data)[2]]));
        // table.render();
        // console.log(data[Object.keys(data)[1]]);

    });
}

$(document).ready(function() {
    $("button[name='do_hide']").click(function() {
        $("#update_dict").toggle();
    });
});

function set_caption() {
    $.get("/auto_update_table", function(data) {
        // Object.keys(data)[0];
        $(document).ready(function() {
            $("#prop_1_span").text("Table " + Object.keys(data)[0]);
            $("#prop_2_span").text("Table " + Object.keys(data)[1]);

        });
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