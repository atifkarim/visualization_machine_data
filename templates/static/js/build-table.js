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
        { title: "first col", field: "00_row", width: 150 },
        { title: "second col", field: "01_add", hozAlign: "left" },
        { title: "third col", field: "02_sub" },
    ],
});

let table_2 = new Tabulator("#example-table_1", {
    height: false, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: [], //assign data to table
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [ //Define Table Columns
        { title: "first col", field: "00_row", width: 150 },
        { title: "second col", field: "01_add", hozAlign: "left" },
        { title: "third col", field: "02_sub" },
    ],
});

function table_with_tabular() {
    $.get("/auto_update_table", function(data) {
        table_1.setData(make_arr_little(data[Object.keys(data)[0]]));
        table_2.setData(make_arr_little(data[Object.keys(data)[1]]));

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