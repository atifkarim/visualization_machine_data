function createTable_1(caption, data) {
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

function createTable(caption, data) {
    // console.log("here_cap: ", here_cap, "  --  ", caption, " and type: ", typeof here_cap);
    let table = $("<table class='test_table'>");
    table
        .html("<caption>" + caption + "</caption>")
        .attr("id", caption);

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
            tr.append(td);
        }
        let td_btn = $("<td>")
            .addClass("table_button")
            .text("Add")
            .click(function() {
                let tbl_div_child = $("#table_div_child");

                if (tbl_div_child.html() == "") {
                    new_tbl = createTable(caption + "_Child", { row: data[row] });
                    tbl_div_child.append(new_tbl);
                } else {
                    //child_tbl = $("#table_div_child")

                }
            });


        tr.append(td_btn);
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

function table_with_vanilla_js_1() {
    $.get("/auto_update_table", function(data) {
        let tbl_div = $("#table_div");
        tbl_div.html("");
        for (let t in data) {
            new_tbl = createTable("Table " + t, data[t]);
            tbl_div.append(new_tbl);
        }
    });
}

function table_with_vanilla_js() {
    $.get("/auto_update_table", function(data) {
        let tbl_div = $("#table_div");
        tbl_div.html("");
        for (let t in data) {
            sub_div = $("<div>")
                .attr("id", "Table_" + t)
                .addClass("sub_div");

            new_tbl = createTable("Table " + t, data[t]);
            tbl_div.append(sub_div);
            sub_div.append(new_tbl);
        }
    });
}

$(document).ready(function() {
    $("button[name='do_hide']").click(function() {
        $("#update_dict").toggle();
    });
});

/** function for stop hiding the Button div whie scrolling the page */

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