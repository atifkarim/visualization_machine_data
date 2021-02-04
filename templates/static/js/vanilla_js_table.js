function createTable(caption, data, family_table_div_val, addbutton = true) {
    let table = $("<table class='test_table'>");
    table
        .html("<caption>" + caption + "</caption>")
        .attr("id", caption);

    let headers = getColumns(data[Object.keys(data)[0]]);
    let tr = $("<tr>");
    for (let i in headers) {
        tr.append("<th>" + headers[i] + "</th>");
    }
    if (addbutton) {
        let btn_toggle_child_table = $("<td>")
            .addClass("table_button")
            .text("Toggle")
            .click(function() {
                $("#" + family_table_div_val + "_Child").toggle();
            });

        tr.append(btn_toggle_child_table);
    }
    table.append(tr);

    for (let row in data) {
        let tr = $("<tr>");
        for (let col in data[row]) {
            let format_data = check_input_val_type(data[row][col], 1);
            let td = $("<td>").text(format_data);
            tr.append(td);
        }

        if (addbutton) {
            let td_btn = $("<td>")
                .addClass("table_button")
                .text("Add")
                .click(function() {
                    clicked_parent_tbl_id = $(this).closest('table').attr('id');
                    child_div_id = family_table_div_val + "_Child";
                    tbl_div_child = $("<div>")
                        .attr("id", child_div_id)
                        .addClass("child_table_class");

                    if ($('#' + tbl_div_child.attr("id")).contents().length == 0) {
                        new_tbl_1 = createTable(caption + "_Child", { row: data[row] }, 0, false);
                        //console.log("new_tbl_1 id: ", typeof new_tbl_1.attr("id"), " tagname: ", new_tbl_1.prop("tagName"));

                        tbl_div_child.append(new_tbl_1);
                        $('#' + family_table_div_val).prepend(tbl_div_child);
                        //console.log("if: ", new_tbl_1.attr("id"));

                    }
                    // var id = $(this).closest("tr").find("td");
                    // $('#' + new_tbl_1.attr("id") + " > tbody").append(id);
                    else {
                        var values = [];
                        var count = 0;
                        $(this).closest("tr").find("td").each(function() {
                            values[count] = $(this).text();
                            count++;
                        });
                        my_tr = $('<tr/>');
                        for (var j = 0; j < values.length - 1; j++) {
                            my_tr.append("<td>" + values[j] + "</td>");
                        }
                        var arr = [];
                        $('#' + clicked_parent_tbl_id + "_Child" + " tr").each(function() {
                            arr.push($(this).find("td:first").text());
                        });
                        //for (i = 0; i < arr.length; i++) {
                        //console.log("arr[", i, "]: ", arr[i]);
                        //}
                        validity = arr.includes(values[0]);
                        //console.log("type: ", typeof validity, " , val: ", validity);
                        if (validity === false) {
                            $('#' + clicked_parent_tbl_id + "_Child" + " > tbody").append(my_tr);
                        }
                    }
                    //console.log("out else: ", new_tbl_1.attr("id"));
                });

            tr.append(td_btn);
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

/** following function helps to track old child info. Here old means
 * while function table_with_vanilla_js() is called with a given interval
 * then new data came from the FLask endpoint to JS endpoint and whole page refresh
 * to update parent table. For the firts time(while no chold table is created) then
 * histoy of chold table is undoubtedly ZERO/ NULL. But if any child table is cretaed
 * by clicking the ADD button of the parent table then it is necessary to track child
 * table history. The following function does it properly
 * */
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

function updateParent(parent_table_div, data) {
    let p_id = parent_table_div.attr("id"); /** parent table's div id */
    let first_table_parent_div = $("#" + parent_table_div.attr("id")).children(":first"); /** Each parent table element as an object */
    let get_parent_table_id = first_table_parent_div.attr("id"); /** Each parent table id */

    /** get table row and col length. it is now also count header as a tr */
    var get_parent_table = document.getElementById(get_parent_table_id); /** get parent table. HTML format */
    let parent_table_row = get_parent_table.rows.length /** parent table row length */
    let parent_table_col = get_parent_table.rows[0].cells.length; /** parent table column length */

    /** Work with passed data which will be used to update parent table data */
    let tbl_1 = data;
    let tbl_1_keys = Object.keys(data);
    for (let a = 0; a < tbl_1_keys.length; a++) {
        for (let b = 1; b < (Object.keys(tbl_1[tbl_1_keys[0]])).length; b++) {
            // console.log("[", a, "][", b, "]: ", tbl_1[tbl_1_keys[a]][Object.keys(tbl_1[tbl_1_keys[0]])[b]]);
            // console.log("[", a, "][", b, "]: ", typeof get_parent_table.rows[a + 1].cells[b].textContent)
            get_parent_table.rows[a + 1].cells[b].textContent = tbl_1[tbl_1_keys[a]][Object.keys(tbl_1[tbl_1_keys[0]])[b]];
        }
    }


    // for (let i = 1; i < parent_table_row; i++) {
    //     for (let j = 1; j < parent_table_col - 1; j++) {
    //         console.log("[", i, "][", j, "]: ", data[Object.keys(data)[i]][Object.keys(data[Object.keys(data)[0]])[j]]);
    //         // get_parent_table.rows[i].cells[j].textContent = tbl_1[tbl_1_keys[i]][Object.keys(tbl_1[tbl_1_keys[0]])[j]].toString();
    //     }
    // }
}

function updateChild(child) {

    let first_table_child_div = $("#" + child.attr("id")).children(":first"); /** Each parent table element as an object */
    let child_table_id = first_table_child_div.attr("id"); /** Each parent table id */

    /** get table row and col length. it is now also count header as a tr */
    var get_child_table = document.getElementById(child_table_id); /** get parent table. HTML format */

    // console.log("child_nodes id: ", child.childNodes[0].id);
    // let child_table_id = child.childNodes[0].id;
    let parent_table_id = child_table_id.slice(0, -6);
    console.log("child_table_id: ", child_table_id);
    console.log("parent_table_id: ", parent_table_id);

    // var td_content = $('#' + child_table_id + ' tr td:first-child').text();
    //console.log("td_content: ", typeof td_content);

    /** get table row and col length. it is now also count header as a tr */
    // var get_child_table = document.getElementById(child_table_id); /** get child table */
    // also correct table.tBodies[0].rows.length
    let child_table_row = get_child_table.rows.length /** child table row length */
    console.log("child_table_row len: ", child_table_row);
    let child_table_col = get_child_table.rows[0].cells.length; /** child table column length */
    // let r = $('#' + child_table_id + ' tbody tr').length; /** also correct */
    console.log("child_table_col len", child_table_col);

    // console.log("data child: ", get_child_table.rows[1].cells[2].textContent);

    /** traversing hrough the child table */
    for (let i = 0; i < child_table_row; i++) {
        for (let j = 0; j < child_table_col; j++) {
            // console.log("data[", i, "][", j, "]: ", get_child_table.rows[i].cells[j].textContent)
        }
    }
    /** get the data of first col from child table */
    let first_col_data_child_table = [];
    for (let i = 1; i < child_table_row; i++) { /** initiate at 1 because then column header which is also a row we can omit */
        for (let j = 0; j < 1; j++) { /** only 1 time iteration keeps us on the first cell of each row */
            first_col_data_child_table.push(get_child_table.rows[i].cells[j].textContent);
        }
    }

    let dict_for_child = {}; /** contain at a time only 1 child table data where any row's first cell val is key and the rest are value  */
    let key_first_col_data_child_table = []; /** the key for the dictionary. All rows' first cell value will go there */
    let val_each_row_child_table = [];
    /** All rows' value will go there except first cell value. Each rows' value(except first cell)
                                           will reside in seperate array. So it's an stack of array */

    for (let i = 0; i < child_table_row; i++) { /** initiate at 0 so, column header will also come. safety purpose */
        for (let j = 0; j < 1; j++) {
            key_first_col_data_child_table.push(get_child_table.rows[i].cells[j].textContent);
        }
    }
    // console.log("key_first_col_data_child_table: ", key_first_col_data_child_table);

    for (let i = 0; i < child_table_row; i++) { /** initiate at 1 because then column header which is also a row we can omit */
        let temp_data = [];
        for (let j = 1; j < child_table_col; j++) {
            temp_data.push(get_child_table.rows[i].cells[j].textContent);
        }
        val_each_row_child_table.push(temp_data);
    }
    // console.log("val_each_row_child_table: ", val_each_row_child_table);

    for (let i in key_first_col_data_child_table) {
        dict_for_child[key_first_col_data_child_table[i]] = val_each_row_child_table[i];
    }

    // console.log("dict_for_child: ", dict_for_child);

    /** All story about parent table */

    var get_parent_table = document.getElementById(parent_table_id); /** get parent table */
    let parent_table_row = get_parent_table.rows.length /** parent table row length */
    let parent_table_col = get_parent_table.rows[0].cells.length; /** parent table column length */
    // console.log("data parent: ", get_parent_table.rows[1].cells[2].textContent);

    /** traversing hrough the parent table */
    for (let i = 0; i < parent_table_row; i++) {
        for (let j = 0; j < parent_table_col; j++) {
            // console.log("data[", i, "][", j, "]: ", get_parent_table.rows[i].cells[j].textContent)
        }
    }
    /** get the data of first col from parent table */
    let first_col_data_parent_table = [];
    for (let i = 1; i < parent_table_row; i++) { /** initiate at 1 because then column header which is also a row we can omit */
        for (let j = 0; j < 1; j++) { /** only 1 time iteration keeps us on the first cell of each row */
            first_col_data_parent_table.push(get_parent_table.rows[i].cells[j].textContent);
        }
    }

    let dict_for_parent = {}; /** contain at a time only 1 parent table data where any row's first cell val is key and the rest are value  */
    let key_first_col_data_parent_table = []; /** the key for the dictionary. All rows' first cell value will go there */
    let val_each_row_parent_table = [];
    /** All rows' value will go there except first cell value. Each rows' value(except first cell)
                                           will reside in seperate array. So it's an stack of array */

    for (let i = 0; i < parent_table_row; i++) { /** initiate at 0 so, column header will also come. safety purpose */
        for (let j = 0; j < 1; j++) {
            key_first_col_data_parent_table.push(get_parent_table.rows[i].cells[j].textContent);
        }
    }
    // console.log("key_first_col_data_parent_table: ", key_first_col_data_parent_table);

    for (let i = 0; i < parent_table_row; i++) { /** initiate at 1 because then column header which is also a row we can omit */
        let temp_data = [];
        for (let j = 1; j < parent_table_col; j++) {
            temp_data.push(get_parent_table.rows[i].cells[j].textContent);
        }
        val_each_row_parent_table.push(temp_data);
    }
    // console.log("val_each_row_parent_table: ", val_each_row_parent_table);

    for (let i in key_first_col_data_parent_table) {
        dict_for_parent[key_first_col_data_parent_table[i]] = val_each_row_parent_table[i];
    }

    // console.log("dict_for_parent: ", dict_for_parent);

    /**try to change value with dummy things, Later it will be follwed by the Real Data from Parent Table */
    for (let i = 0; i < child_table_row; i++) {
        for (let j = 1; j < child_table_col; j++) {
            // console.log("data[", i, "][", j, "]: ", get_child_table.rows[i].cells[j].textContent)
            get_child_table.rows[i].cells[j].textContent = dict_for_parent[key_first_col_data_child_table[i]][j - 1];
            // data[key_data[0]][3]
            // console.log("child: ", get_child_table.rows[i].cells[j].textContent);
            // console.log("parent: ", dict_for_parent[key_first_col_data_child_table[i]][j]);
        }
    }

    // for (let i = 0; i < key_first_col_data_child_table.length; i++) {
    //     for (let j = 0; j < 3; j++) {
    //         console.log("key_first_col_data_child_table[", i, "]: ", key_first_col_data_child_table[i]);
    //         console.log("dict for parent data: ", dict_for_parent[key_first_col_data_child_table[i]][j]);
    //     }
    // }

}

let tbl_div = $("#table_div");
// console.log("id: ", tbl_div.attr("id"));
// let children = $("div:regex(id, .*_child)");
tbl_div.html("");

function table_with_vanilla_js() {
    $.get("/auto_update_table", function(data) {
        // let tbl_div = $("#table_div");
        let children = $("div:regex(id, .*_child)");
        // tbl_div.html("");

        for (let t in data) {
            family_table_div = $("<div>")
                .attr("id", "Family_" + t)
                .addClass("family_table_class");

            parent_table_div = $("<div>")
                .attr("id", family_table_div.attr("id") + "_Parent")
                .addClass("parent_table_class");

            child_table_div = $("<div>")
                .attr("id", family_table_div.attr("id") + "_Child")
                .addClass("child_table_class");

            if ($('#' + parent_table_div.attr("id")).contents().length == 0) {
                new_tbl = createTable("Table_" + t, data[t], family_table_div.attr("id"));

                tbl_div.append(family_table_div);
                family_table_div.append(parent_table_div);
                parent_table_div.append(new_tbl);
            } else {
                updateParent(parent_table_div, data[t]);
            }

            // let here_child_table_div = family_table_div.attr("id") + "_Child";
            if ($('#' + child_table_div.attr("id")).contents().length != 0) {
                console.log("parent div: ", parent_table_div.attr("id"));
                console.log("child div: ", child_table_div.attr("id"));
                updateChild(child_table_div);
            }
        }

        // for (let i = 0; i < children.length; i++) {
        //     let child = children[i];
        //     let parent = child.id.slice(0, -6);

        //     $("#" + parent).prepend(child);
        //     updateChild(child, parent);
        // }


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