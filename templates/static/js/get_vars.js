let selectvar = $("#varselect")[0];
let varval = $("#varvalue")[0];

console.log("selectvar: ", selectvar);
console.log("varval: ", varval);

let olddict = {};
let newdict = {};

let olddict_1 = {};
let newdict_1 = {};
var final_dict = {};
console.log("1st time final_dict: ", final_dict);

let get_val = function() {
    // console.log("in get_val func olddict: ", olddict);
    let varname = selectvar.value;
    // console.log("in get_val func varname: ", varname);

    if (varname in newdict) {
        varval.value = newdict[varname]
            // console.log("in get_val func IF condition varval.value: ", varval.value);
    } else {
        varval.value = olddict[varname];
        // console.log("in get_val func ELSE condition varval.value: ", varval.value);
    }
}

let prepare = function(var_dict) {
    olddict = var_dict;
    // console.log("old_dict: ", var_dict)

    for ([key, value] of Object.entries(var_dict)) {
        let option = document.createElement("option");
        option.text = key;
        option.value = key;
        selectvar.add(option);
        // console.log("option: ", option);
        // console.log("in prepare func selectvar: ", selectvar);
    }
}

/** dropdown for each table  */

let get_val_1 = function(selectvar_id, varval_id) {
    // console.log("in get_val_1 func olddict_1: ", olddict_1);
    // selectvar_1 = $("#varselect_1")[0];
    // varval_1 = $("#varvalue_1")[0];
    selectvar_elem = document.getElementById(selectvar_id);
    varval_elem = document.getElementById(varval_id);

    // selectvar_1 = $("#" + selectvar_id)[0];
    jqr_selectvar_1 = $(selectvar_elem);
    // varval_1 = $("#" + varval_id)[0];
    jqr_varval_1 = $(varval_elem);
    varname_1 = $('#' + jqr_selectvar_1.attr("id") + ' option').val()
        // console.log("in get_val_1 func varname_1: ", varname_1);

    if (varname_1 in newdict_1) {
        // console.log("in if");
        $('#' + jqr_varval_1.attr("id")).val(newdict_1[varname_1]); // = newdict_1[varname_1];
        console.log("in get_val_1 func IF condition assigned val: ", $('#' + jqr_varval_1.attr("id")).val());
    } else {
        // console.log("In else");
        $('#' + jqr_varval_1.attr("id")).val(olddict_1[varname_1]); // = olddict_1[varname_1];
        console.log("in get_val_1 func ELSE condition assigned val: ", $('#' + jqr_varval_1.attr("id")).val());
    }
}

let prepare_1 = function(var_dict_1, selectvar_1) {
    olddict_1 = var_dict_1;
    // console.log("in prepare_1 old_dict_1: ", olddict_1);

    for ([key, value] of Object.entries(var_dict_1)) {
        // let option_1 = document.createElement("option_1");
        option_1 = $("<option>")
            .attr({
                text: key,
                value: key
            }).html(key);

        // option_1.text = key;
        // option_1.value = key;
        // selectvar_2 = $("#" + selectvar_1.attr("id"))[0];
        selectvar_1.append(option_1);
        // console.log("in prepare_1 option_1: ", option_1);
        // console.log("in prepare_1 func selectvar_1: ", selectvar_1);
    }
}


function updatedata() {
    var variableToUpdate = selectvar.value;
    var updatedValue = varval.value;

    newdict[variableToUpdate] = updatedValue;
    console.log("newdict: ", newdict);
}

function updatedata_1(selectvar_id, varval_id, sub_key_name) {

    update_data_selectvar_elem = document.getElementById(selectvar_id);
    update_data_jqr_selectvar_1 = $(update_data_selectvar_elem);
    var variableToUpdate_1 = $('#' + update_data_jqr_selectvar_1.attr("id") + ' option').val();

    update_data_varval_elem = document.getElementById(varval_id);
    update_data_jqr_varval_1 = $(update_data_varval_elem);
    var updatedValue_1 = $('#' + update_data_jqr_varval_1.attr("id")).val();

    newdict_1[variableToUpdate_1] = updatedValue_1;
    // final_dict[sub_key_name] = newdict_1;
    final_dict[sub_key_name][variableToUpdate_1] = newdict_1[variableToUpdate_1];

    // console.log("newdict_1 from update_1: ", newdict_1);
    console.log("final_dict from update_1: ", final_dict);
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
        console.log("i.name: ", i.name, " , i.value: ", i.value);
        hiddenform.appendChild(i);
    }

    document.getElementById("body").appendChild(hiddenform);
    hiddenform.submit();
}

function submitPOST_1() {
    hiddenform = document.createElement("form")
    hiddenform.style.visibility = "hidden";
    hiddenform.method = "POST";

    for ([key, value] of Object.entries(final_dict)) {
        console.log("k: ", key, " ,v: ", value);
        i_1 = document.createElement("input");
        i_1.name = key;
        i_1.value = value;
        console.table("i_1.name: ", i_1.name, " , i_1.value: ", i_1.value);
        hiddenform.appendChild(i_1);
    }

    document.getElementById("body").appendChild(hiddenform);
    hiddenform.submit();
}

let get_dropdown = function() {
    $.get('/update_dropdown',
        function(data) {
            console.log("data: ", data);
            prepare(data);
            get_val();
        });
}

let multi_get_dropdown = function() {
    $.getJSON('/update_multi_dropdown',
        function(data) {
            final_dict = data;
            console.log("2nd time final_dict: ", final_dict);
            for (let i in data) {
                console.log("multi data: ", data[i]);
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
                    .text("Variable ")
                    .addClass("all_label_class");

                label_1 = $("<label>")
                    .attr('for', "vars")
                    .text("Value ")
                    .addClass("all_label_1_class");

                id_for_input = "varvalue_" + i;
                id_for_select = "varselect_" + i;
                input = $("<input>")
                    .attr("id", id_for_input)
                    .attr('type', 'number')
                    .attr('name', 'value')
                    .addClass("all_input_class");

                select = $("<select>")
                    .attr("name", "var")
                    .attr("id", id_for_select)
                    .css({ "margin-right": "20px" })
                    .addClass("all_select_class");
                // .on('change', get_val_1(id_for_select, id_for_input));

                line_break = $("<br>");

                update_dropdown_div.append(label, select, line_break, label_1, input);
                get_family_div_element.append(update_dropdown_div);

                prepare_1(data[i], select);

                // var contents = $('#' + id_for_select);
                $('#' + id_for_select).attr('onchange', 'get_val_1(id_for_select, id_for_input)');
                // $('select').on('change', get_val_1(id_for_select, id_for_input));

                get_val_1(id_for_select, id_for_input);

                button_1 = $("<button>")
                    .addClass("class_button_1")
                    .text('Update')
                    .click(function() {
                        // x = $(this).closest('select').find('id').attr("id");
                        var update_select_id = $(this).prevAll('.all_select_class').attr('id');
                        var update_input_id = $(this).prevAll('.all_input_class').attr('id');

                        element_name = update_select_id.slice(0, 10);
                        pass_element_name = update_select_id.replace(element_name, "");
                        // console.log("get_Notslice: ", pass_element_name);

                        updatedata_1(update_select_id, update_input_id, pass_element_name);
                    });

                update_dropdown_div.append(button_1);

                submit_button = $("<button>")
                    .addClass("class_button_1")
                    .text('Submit')
                    .click(function() {
                        submitPOST_1();
                        console.log("passed");
                    });
                update_dropdown_div.append(submit_button);

            }
        });
}