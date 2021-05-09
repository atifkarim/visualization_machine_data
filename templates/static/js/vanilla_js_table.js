function createTable(new_caption, caption, data, family_table_div_val, addbutton = true) {
    /** any table element is set here. caption name sets the table's id name */
    let table = $("<table class='test_table'>");
    table
        .html("<caption>" + new_caption + "</caption>")
        .attr("id", caption);

    let headers = getColumns(data[Object.keys(data)[0]]); /** create the column name */
    let tr = $("<tr>"); /** create tr (tr means row. column name also stays in row) */
    for (let i in headers) {
        tr.append("<th>" + headers[i] + "</th>");
    }
    if (addbutton) { /** it is by default TRUE for parent table as they need to add button */
        /** toggle button to show/hide chld table div */
        let btn_toggle_child_table = $("<th>")
            .addClass("table_button")
            .text("Toggle")
            .click(function() {
                $("#" + family_table_div_val + "_Child").toggle();
            });

        tr.append(btn_toggle_child_table);
    }
    let thead = $("<thead>");
    thead.append(tr);
    table.append(thead);

    for (let row in data) {
        /** traversing through the main data. It came from FLask EndPoint to JS. And it is information of
               only 1 table */
        let tr = $("<tr>");
        for (let col in data[row]) {
            let format_data = check_input_val_type(data[row][col], 1);
            let td = $("<td>").text(format_data);
            tr.append(td);
        }

        if (addbutton) { /** here creating and appending Add button only to Parent Table */
            let td_btn = $("<td>")
                .addClass("table_button")
                .text("Add")
                .click(function() {
                    clicked_parent_tbl_id = $(this).closest('table').attr('id');
                    child_div_id = family_table_div_val + "_Child";
                    tbl_div_child = $("<div>")
                        .attr("id", child_div_id)
                        .addClass("child_table_class");

                    /** the following condition will be TRIE for 1 time only while there is no Child Table div
                     * for each child table there is 1 seperate div
                     */
                    if ($('#' + tbl_div_child.attr("id")).contents().length == 0) {
                        new_tbl_1 = createTable(new_caption, caption + "_Child", { row: data[row] }, 0, false);
                        //console.log("new_tbl_1 id: ", typeof new_tbl_1.attr("id"), " tagname: ", new_tbl_1.prop("tagName"));

                        tbl_div_child.append(new_tbl_1);
                        $('#' + family_table_div_val).prepend(tbl_div_child);

                    }
                    // var id = $(this).closest("tr").find("td");
                    // $('#' + new_tbl_1.attr("id") + " > tbody").append(id);

                    /** following condion will be TRUE if there is already child table(1 specific child table for
                     * 1 specific parent table)
                     * */
                    else {
                        let each_row_info = [];
                        let count = 0;
                        /** following jquery function fetch the td value of the row which ADD button is clicked
                         * and then it fill up the each_row_info array
                         */
                        $(this).closest("tr").find("td").each(function() {
                            each_row_info[count] = $(this).text();
                            count++;
                        });
                        my_tr = $('<tr/>'); /** it is a tr(row) which will contain each_row_info array's info in seperate td */
                        for (var j = 0; j < each_row_info.length - 1; j++) {
                            my_tr.append("<td>" + each_row_info[j] + "</td>");
                        }
                        /** still all the time values are fetching from parent table to add with child table but not appended.
                         * one problem occurs here and that is multiple tim same row is appended. To solve it following lines
                         * will help
                         */
                        let existing_child_table_first_col = [];
                        /** this array will contain the first td of the each tr(row) which ADD button is clicked
                         * from the already created Child Table */
                        $('#' + clicked_parent_tbl_id + "_Child" + " tr").each(function() {
                            existing_child_table_first_col.push($(this).find("td:first").text());
                        });

                        validity = existing_child_table_first_col.includes(each_row_info[0]);
                        /** it will check first data of values array is included or not in existing_child_table_first_col array.
                         * What does it mean? "existing_child_table_first_col" has all first td of each row. That means the 
                         * first column which is alltime fixed. And "each_row_info" array is the info array which is just clicked.
                         * So if it is already appended in the Child table then it just need to chekc whether it's
                         * ("each_row_info" array)
                         * */
                        if (validity === false) { /** if not present then append */
                            $('#' + clicked_parent_tbl_id + "_Child" + " > tbody").append(my_tr);
                        }
                    }
                });

            tr.append(td_btn); /** ADD button appends only in Parent Table */
        }
        table.append(tr); /** Parent table creation */
    }
    return table;
}

/** following function helps to get the column name for the creation of the table */

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

/** following function is used to update Parent Table */
function updateParent(parent_table_div, data) {
    let p_id = parent_table_div.attr("id"); /** parent table's div id */
    let first_table_parent_div = $("#" + parent_table_div.attr("id")).children(":first"); /** Each parent table element as an object */
    let get_parent_table_id = first_table_parent_div.attr("id"); /** Each parent table id */

    /** get table row and col length. it is now also count header as a tr */
    var get_parent_table = document.getElementById(get_parent_table_id); /** get parent table. HTML format */

    /** Work with passed data which will be used to update parent table data */
    let tbl_1 = data; /** information of only 1 parent table */
    let tbl_1_keys = Object.keys(data); /** First set of keys of only 1 parent table */
    /**
     * 1/ following for loop fetch data from the passed information (data[t]).
     * firts for loop iterate every row OR every  key(values_00, values_01 .... values_nn). Every values_nn has their own object
     * which are nothing but the presentable information. Those object keys are same(column name). Values are rows' data
     * 
     * 2/ second for loop starts at 1. Because values_nn first key's data is nothing but the first column's data(values_nn's
     * first key's value) which are alltime same. So no need to update it. It is already in the Parent Table.
     * You have to update the remaining columns as they are nothing but Data(changing). And this for loop iterates till the 
     * length of values_nn
     * 
     * 3/ get_parent_table.rows[a + 1].cells[b].textContent here "a+1" is written because then it will not go to the
     * first column which is nothing but values_nn's first key's value(Read point 2 again). Also keep in mind that parent
     * table has a fourth column which is nothing but stack of Buttons. No Need of updating that also
     */

    for (let a = 0; a < tbl_1_keys.length; a++) {
        for (let b = 1; b < (Object.keys(tbl_1[tbl_1_keys[0]])).length; b++) {
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

/** following function is used to update Child Table */

function updateChild(child_table_div) {

    let first_table_child_div = $("#" + child_table_div.attr("id")).children(":first"); /** Each child table element as an object */
    let child_table_id = first_table_child_div.attr("id"); /** Each child table id */
    var get_child_table = document.getElementById(child_table_id); /** get child table. HTML format */

    /** get table row and col length. it is also count header as a tr */
    let child_table_row = get_child_table.rows.length /** child table row length */
    let child_table_col = get_child_table.rows[0].cells.length; /** child table column length */

    /** get the data of first col from child table */

    let dict_for_child = {}; /** contain at a time only 1 child table data where any row's first cell val is key and the rest are value  */
    let key_first_col_data_child_table = []; /** All rows' first cell value will go there(first column with column header) */
    let val_each_row_child_table = [];
    /** All rows' value will go there except first cell value. Each rows' value(except first cell)
                                           will reside in seperate array. So it's an stack of array */

    for (let i = 0; i < child_table_row; i++) { /** initiate at 0 so, column header will also come. safety purpose */
        for (let j = 0; j < 1; j++) { /** initiate at 0 and ends before 1 so only the first column's data came here */
            key_first_col_data_child_table.push(get_child_table.rows[i].cells[j].textContent);
        }
    }

    for (let i = 0; i < child_table_row; i++) { /** count first row(column name) also */
        let temp_data = []; /** take 1 row's data except first cell */
        for (let j = 1; j < child_table_col; j++) { /** initiate at 1 so omitting first column's data is possible */
            temp_data.push(get_child_table.rows[i].cells[j].textContent);
        }
        val_each_row_child_table.push(temp_data); /** after finishing 1 row push it in main container */
    }

    /** making the json object with child table data */
    for (let i in key_first_col_data_child_table) {
        dict_for_child[key_first_col_data_child_table[i]] = val_each_row_child_table[i];
    }

    /** fetching data from parent table */

    let parent_table_id = child_table_id.slice(0, -6);
    let get_parent_table = document.getElementById(parent_table_id); /** get parent table */
    let parent_table_row = get_parent_table.rows.length /** parent table row length */
    let parent_table_col = get_parent_table.rows[0].cells.length; /** parent table column length */

    let dict_for_parent = {};
    /** contain at a time only 1 parent table data where any row's first cell val is key 
       and the rest are value  */
    let key_first_col_data_parent_table = []; /** All rows' first cell value will go there(first column with column header) */
    let val_each_row_parent_table = [];
    /** All rows' value will go there except first cell value. Each rows' value(except first cell)
                                           will reside in seperate array. So it's an stack of array */

    for (let i = 0; i < parent_table_row; i++) { /** initiate at 0 so, column header will also come. safety purpose */
        for (let j = 0; j < 1; j++) { /** initiate at 0 and ends before 1 so only the first column's data came here */
            key_first_col_data_parent_table.push(get_parent_table.rows[i].cells[j].textContent);
        }
    }

    for (let i = 0; i < parent_table_row; i++) { /** count first row(column name) also */
        let temp_data = []; /** take 1 row's data except first cell */
        for (let j = 1; j < parent_table_col; j++) { /** initiate at 1 so omitting first column's data is possible */
            temp_data.push(get_parent_table.rows[i].cells[j].textContent);
        }
        val_each_row_parent_table.push(temp_data); /** after finishing 1 row push it in main container */
    }

    /** making the json object with parent table data */
    for (let i in key_first_col_data_parent_table) {
        dict_for_parent[key_first_col_data_parent_table[i]] = val_each_row_parent_table[i];
    }

    /**try to change value with dummy things, Later it will be follwed by the Real Data from Parent Table */
    for (let i = 0; i < child_table_row; i++) {
        for (let j = 1; j < child_table_col; j++) {
            get_child_table.rows[i].cells[j].textContent = dict_for_parent[key_first_col_data_child_table[i]][j - 1];
        }
    }
}

let tbl_div = $("#table_div"); /** fetch table_div from html */
tbl_div.html(""); /** make it empty only 1 time (safety purpose) */

function table_with_vanilla_js() {
    $.get("/auto_update_table", function(data) {
        create_whole_table(data);
        // let children = $("div:regex(id, .*_child)"); /** this line is old. It takes the child table's div info from history */
    });
}

function table_from_db() {
    $.get("/update_table_data_from_db", function(data) {
        create_whole_table(data);
        // let children = $("div:regex(id, .*_child)"); /** this line is old. It takes the child table's div info from history */
    });
}

function create_whole_table(data) {
    for (let t in data) {
        let n = t.indexOf('_');
        let new_t = t.substring(n + 1);

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
            new_tbl = createTable(new_t, "Table_" + t, data[t], family_table_div.attr("id"));
            tbl_div.append(family_table_div);
            family_table_div.append(parent_table_div);
            parent_table_div.append(new_tbl);
        } else {
            updateParent(parent_table_div, data[t]);
        }

        if ($('#' + child_table_div.attr("id")).contents().length != 0) {
            updateChild(child_table_div);
        }
    }
}

/** following lines are old. Used to update CHild. If you want to use this then you have to change a little bit
 * in updateChild function. Maybe you will find it in former commit.
 */
// for (let i = 0; i < children.length; i++) {
//     let child = children[i];
//     let parent = child.id.slice(0, -6);
//     $("#" + parent).prepend(child);
//     updateChild(child, parent);
// }


/** following function is used to set SIDEBAR/ show Update Dict function work */

$(document).ready(function() {
    $("button[name='do_hide']").click(function() {
        $(".family_dropdown_class").toggle();
    });
});

/** function for stop hiding the Button div whie scrolling the page */

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