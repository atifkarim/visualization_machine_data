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
                    .addClass("child_table_class");

                if ($('#' + tbl_div_child.attr("id")).contents().length == 0) {
                    new_tbl = createTable(caption + "_Child", { row: data[row] }, 0);
                    tbl_div_child.append(new_tbl);
                    $('#' + family_table_div_val).prepend(tbl_div_child);
                    console.log(child_div_id, " is created");
                    // $('#' + id_sub_div).append('#' + tbl_div_child.attr("id"));
                }
                // var id = $(this).closest("tr").find("td");
                // $('#' + new_tbl.attr("id") + " > tbody").append(id);
                else {
                    var values = [];
                    var count = 0;
                    $(this).closest("tr").find("td").each(function() {
                        values[count] = $(this).text();
                        count++;
                    });
                    console.log("arr: ", values);
                    my_tr = $('<tr/>');
                    for (var j = 0; j < values.length; j++) {
                        //my_tr = $('<tr/>');
                        my_tr.append("<td>" + values[j] + "</td>");
                    }
                    $('#' + new_tbl.attr("id") + " > tbody").append(my_tr);
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

function table_with_vanilla_js() {
    $.get("/auto_update_table", function(data) {
        let tbl_div = $("#table_div");
        let children = $("div:regex(id, .*_child)");
        tbl_div.html("");

        for (let t in data) {
            family_table_div = $("<div>")
                .attr("id", "Family_" + t)
                .addClass("family_table_class");

            parent_table_div = $("<div>")
                .attr("id", family_table_div.attr("id") + "_Parent")
                .addClass("parent_table_class");
            new_tbl = createTable("Table_" + t, data[t], family_table_div.attr("id"));
            tbl_div.append(family_table_div);
            family_table_div.append(parent_table_div);
            parent_table_div.append(new_tbl);
        }

        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let parent = child.id.slice(0, -6);
            $("#" + parent).prepend(child);
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