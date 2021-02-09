let selectvar = $("#varselect")[0];
let varval = $("#varvalue")[0];
let olddict = {};
let newdict = {};

let olddict_1 = {};
let newdict_1 = {};

let get_val = function() {
    let varname = selectvar.value;

    if (varname in newdict) {
        varval.value = newdict[varname]
    } else {
        varval.value = olddict[varname];
    }
}

let prepare = function(var_dict) {
    olddict = var_dict;

    for ([key, value] of Object.entries(var_dict)) {
        let option = document.createElement("option");
        option.text = key;
        option.value = key;
        selectvar.add(option);
    }
}

/** dropdown for each table  */

let get_val_1 = function(selectvar_id, varval_id) {
    // selectvar_1 = $("#varselect_1")[0];
    // varval_1 = $("#varvalue_1")[0];
    selectvar_elem = document.getElementById(selectvar_id);
    varval_elem = document.getElementById(varval_id);

    // selectvar_1 = $("#" + selectvar_id)[0];
    selectvar_1 = $(selectvar_elem);
    // varval_1 = $("#" + varval_id)[0];
    varval_1 = $(varval_elem);
    varname_1 = selectvar_1.value;

    if (varname_1 in newdict_1) {
        varval_1.value = newdict_1[varname_1]
    } else {
        varval_1.value = olddict_1[varname_1];
    }
}

let prepare_1 = function(var_dict, selectvar_1) {
    olddict_1 = var_dict;

    for ([key, value] of Object.entries(var_dict)) {
        let option = document.createElement("option_1");
        option.text = key;
        option.value = key;
        // selectvar_2 = $("#" + selectvar_1.attr("id"))[0];
        selectvar_1.add(option);
    }
}


function updatedata() {
    var variableToUpdate = selectvar.value;
    var updatedValue = varval.value;

    newdict[variableToUpdate] = updatedValue;
}

function createURL() {
    let urlString = '/update_data_in_pyhton?';
    for ([key, value] of Object.entries(newdict)) {
        urlString = urlString + key + '=' + value + '&';
    }

    urlString = urlString.slice(0, -1);

    console.log(urlString);
    state = $.getJSON(urlString, function(data) {});
}

function submitPOST() {
    hiddenform = document.createElement("form")
    hiddenform.style.visibility = "hidden";
    hiddenform.method = "POST";

    for ([key, value] of Object.entries(newdict)) {
        i = document.createElement("input");
        i.name = key;
        i.value = value;
        hiddenform.appendChild(i);
    }

    document.getElementById("body").appendChild(hiddenform);
    hiddenform.submit();
}


let get_dropdown = function() {
    $.get('/update_dropdown',
        function(data) {
            prepare(data);
            get_val();
        });
}

let multi_get_dropdown = function() {
    $.getJSON('/update_multi_dropdown',
        function(data) {
            for (let i in data) {
                console.log("data: ", data[i]);
                get_family_div = document.getElementById("Family_" + i);
                update_dropdown_div = $("<div>")
                    .attr("id", "Family_dropdown_" + i)
                    .addClass("family_dropdown_class");

                get_family_div_element = $(get_family_div);
                /*** write code here */
                p_1 = $("<p>");
                p_1.append("Hello Bro_" + i);

                label = $("<label>")
                    .attr('for', "var")
                    .text("Choose a new variable:");

                label_1 = $("<label>")
                    .attr('for', "vars")
                    .text("Choose a value (-100 to 100) new:");

                id_for_input = "varvalue_" + i;
                id_for_select = "varselect_" + i;
                input = $("<input>")
                    .attr("id", id_for_input)
                    .attr('type', 'number')
                    .attr('name', 'value');

                select = $("<select>")
                    .attr("name", "var")
                    .attr("id", id_for_select)
                    .css({ "margin-right": "20px" })
                    .on('change', get_val_1(id_for_select, id_for_input));

                update_dropdown_div.append(label, select, label_1, input);
                get_family_div_element.append(update_dropdown_div);

                prepare_1(data[i], select);
                get_val_1(id_for_select, id_for_input);

            }
        });
}