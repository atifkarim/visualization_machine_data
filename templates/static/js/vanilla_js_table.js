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

function createTable(caption, data, family_table_div_val) {
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
                child_div_id = family_table_div_val + "_Child";
                // console.log("xx: ", child_div_id);
                // let tbl_div_child = $("#" + xx);
                // console.log("my id noww: ", tbl_div_child.attr("id"));

                let id_sub_div_child = family_table_div_val + "_child";
                tbl_div_child = $("<div>")
                    .attr("id", child_div_id)
                    .addClass("child_table_class").appendTo('#' + family_table_div_val);

                if (tbl_div_child.html() == "") {
                    new_tbl = createTable(caption + "_Child", { row: data[row] }, 0);
                    tbl_div_child.append(new_tbl);
                    // console.log("now family div id: ", family_table_div_val);
                    // $('#' + id_sub_div).append('#' + tbl_div_child.attr("id"));
                } else {
                    // console.log("I am already here");
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
// let tbl_div = $("#table_div");
// tbl_div.html("");
// function create_main_table_body() {
//     var tbl_div = $("#table_div");
//     tbl_div.html("");
//     return tbl_div;
// }

// var tbl_div;
// var num = 2;

function table_with_vanilla_js() {
    $.get("/auto_update_table", function(data) {
        let tbl_div = $("#table_div");
        tbl_div.html("");
        // if (num < 3) {
        //     tbl_div = create_main_table_body();
        //     num++;
        //     console.log("hello eiiiii");
        // }

        for (let t in data) {

            /** in  family_table_div firstly parent_table_div will stay. then if
            any button of any row of the parent table is pressed then child table will create
            and it will stay on top of it's parent.
            On first click child table will cteate(with col name and clicked row)
            On second .... nth click only nth row will be appended. So there is a checking of
            child_table_div will come.
            */

            /**
            -- if family_table_div exist then don't create it. Work will be done with it's content
            only
            -- if parent_table_div exist don't create it JUST replace the former content. 
            It will AUTO happen as for loop is running(data coming from Flask End)
            -- if child_table_div exist don't create again. Just instead of appending child_table
            replace former child table

            --^^^-- Another XYZ approach could be -- copy all the time all childtable_div content
            with all info and when any refresh will occur just replace/ fetch the div with that
            copied content. If any POST occur then no need to do this(or if you think you can pass
            the OLD val also. A POST means a major change in parent table so Existence of Child_Table
            is not necessary). Also before POST(that means only the creation of Child Table(whatever Row))
            you have to always keep in mind that Child will be pointed to the Parent Table(Any AUTO change
            due to iteration of for loop in Parent Table should be done in Child Table)
            */
            family_table_div = $("<div>")
                .attr("id", "Family_" + t)
                .addClass("family_table_class");

            parent_table_div = $("<div>")
                .attr("id", family_table_div.attr("id") + "_Parent")
                .addClass("parent_table_class");
            // id_sub_div = "Table_" + t;
            // console.log("id: --- ", parent_table_div.attr("id"));
            new_tbl = createTable("Table_" + t, data[t], family_table_div.attr("id"));
            tbl_div.append(family_table_div);
            family_table_div.append(parent_table_div);
            parent_table_div.append(new_tbl);
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