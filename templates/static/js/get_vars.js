/** dropdown for each table  */

let oldjson_data = {}; // used for initiating and updating dropdown
let newjson_data = {}; // used to update dropdown data
let updated_json_data = {};

/** following function starts automatiacally in the beginning of the execution of the main function
 * set_dropdown_for_each_table(). The objective of this function is to check which variable is
 * selected and upate the value in the input_tag box. It also execute whenever any variable is selected
 * from dropdown menu with onChange function of selectTag element
 */

let get_dropdown_key_value = function(select_tag_id, input_tag_id, json_unique_key_data) {
    oldjson_data = json_unique_key_data;
    let select_tag_element = document.getElementById(select_tag_id); /** JS object of selectTag */
    let input_tag_element = document.getElementById(input_tag_id); /** JS object of inputTag */

    let jquery_select_tag_element = $(select_tag_element); /** jquery object of selectTag */
    let jquery_input_tag_element = $(input_tag_element); /** jquery object of inputTag */
    let selectd_variable = $('#' + jquery_select_tag_element.attr("id") + ' option:selected').val(); /** get string val of which variable is selected */

    if (selectd_variable in newjson_data) {
        /** this condition will run if any variable is updated more than 1 time before doing any POST method
         * eg: variable a is set to 1 and then again set to something else
         */
        $('#' + jquery_input_tag_element.attr("id")).val(newjson_data[selectd_variable]);
        // console.log("in get_dropdown_key_value func IF condition assigned val: ", $('#' + jquery_input_tag_element.attr("id")).val());
    } else {
        /** this condition is TRUE by default. If a value is set only once OR take default value till POST method
         * this condition will be TRUE for that variable
         */
        $('#' + jquery_input_tag_element.attr("id")).val(oldjson_data[selectd_variable]);
        // console.log("in get_dropdown_key_value func ELSE condition assigned val: ", $('#' + jquery_input_tag_element.attr("id")).val());
    }
}

/** following function is the first one which execute in this page after set_dropdown_for_each_table()
 * It make the dropdown menu and set each key's first variable by default in the selectTag element
 */
let prepare_dropdown = function(json_unique_key_data, select_element) {
    oldjson_data = json_unique_key_data; /** each unique key comes with their object value */

    for ([key, value] of Object.entries(json_unique_key_data)) {
        /** option tag to get the variable name for dropdown after starting the process */
        option = $("<option>")
            .attr({
                text: key,
                value: key
            }).html(key);
        select_element.append(option);
    }
}

/** following function update variable value of dropdown */
function update_dropdown(select_tag_id, input_tag_id, sub_key_name) {
    let temp_json = {};

    let update_data_select_tag_element = document.getElementById(select_tag_id); /** JS object of selectTag */
    let update_data_jquery_select_tag_element = $(update_data_select_tag_element); /** jquery object of selectTag */
    /** get string val of which variable is selected */
    let variableToUpdate = $('#' + update_data_jquery_select_tag_element.attr("id") + ' option:selected').val();

    let update_data_input_tag_element = document.getElementById(input_tag_id); /** JS object of inputTag */
    let update_data_jquery_input_tag_element = $(update_data_input_tag_element); /** jquery object of inputTag */
    /** get the value of the selected variable */
    let updatedValue = $('#' + update_data_jquery_input_tag_element.attr("id")).val();

    newjson_data[variableToUpdate] = updatedValue;
    /** it store the updated variable and used again 
       in get_dropdown_key_value() function to update the value of the selected variable */

    /** following portion helps to make a JSON object with the updated data only(unique key) to send
     * to the BackEnd for updating config_val via POST method. POST method occurs in another function
     */
    temp_json[variableToUpdate] = updatedValue; /** it gets variable and associated value and make a object */
    if (!(sub_key_name in updated_json_data)) {
        /** this condition check already main key (Table name is main key, will be found in BackEnd code
         * , name is config_val) is present or not. If not then make a JSON object */
        updated_json_data[sub_key_name] = temp_json;
        console.log("1st time when sub_key: ", sub_key_name, " and temp_json: ", temp_json);
    } else {
        /** if already main key is in the JSON object then no need to replace just update or append the 
         * sub_key(a, b, c ...) for each main_key
         */
        Object.keys(temp_json).forEach(function(key) {
            updated_json_data[sub_key_name][key] = temp_json[key];
        });
        console.log("all time when sub_key: ", sub_key_name, " and temp_json: ", temp_json);
    }

    // console.log("updated_json_data: ", updated_json_data);
}

/** following function send the updated JSON object to the BackEnd via POST method */
function POST_dropdown_data() {
    hiddenform = document.createElement("form")
    hiddenform.style.visibility = "hidden";
    hiddenform.method = "POST";

    for ([key, value] of Object.entries(updated_json_data)) {
        i_1 = document.createElement("input");
        i_1.name = key;
        i_1.value = JSON.stringify(value);
        hiddenform.appendChild(i_1);
    }

    document.getElementById("body").appendChild(hiddenform);
    hiddenform.submit();
}


/** following function is the starting point of this file. */
let set_dropdown_for_each_table = function() {
    $.getJSON('/dropdown_for_each_table', /** this endpoint take the config_val from BackEnd */
        function(data) {
            for (let i in data) {
                let get_family_div = document.getElementById("Family_" + i);
                /** Naming of family_div is set in such way which will be easy to fetch the div 
                 * where Parent, Child Table and their corresponding dropdown menu will go */
                let get_family_div_element = $(get_family_div);

                let update_dropdown_div = $("<div>")
                    .attr("id", "Family_dropdown_" + i)
                    .addClass("family_dropdown_class");

                let label = $("<label>")
                    .attr('for', "var")
                    .text("Variable ")
                    .addClass("all_label_class");

                let label_1 = $("<label>")
                    .attr('for', "vars")
                    .text("Value ")
                    .addClass("all_label_1_class");

                let id_for_input = "varvalue_" + i;
                let id_for_select = "varselect_" + i;
                let input = $("<input>")
                    .attr("id", id_for_input)
                    .attr('type', 'number')
                    .attr('name', 'value')
                    .addClass("all_input_class");

                let select = $("<select>")
                    .attr("name", "var")
                    .attr("id", id_for_select)
                    .css({ "margin-right": "20px" })
                    .addClass("all_select_class");

                let line_break = $("<br>");

                update_dropdown_div.append(label, select, line_break, label_1, input);
                get_family_div_element.append(update_dropdown_div);

                prepare_dropdown(data[i], select); /** prepare dropdown after running the script */

                $('#' + id_for_select).on('change', function() {
                    let update_select_id = $(this).closest("select").attr("id");
                    let input_prefix = "varvalue_";
                    let update_input_id = input_prefix + update_select_id.replace("varselect_", "");
                    console.log("update_select_id: ", update_select_id);
                    console.log("update_input_id: ", update_input_id);
                    get_dropdown_key_value(update_select_id, update_input_id, data[update_select_id.replace("varselect_", "")])
                });

                get_dropdown_key_value(id_for_select, id_for_input, data[i]);

                let update_button = $("<button>")
                    .addClass("dropdown_button_class")
                    .text('Update')
                    .click(function() {
                        var update_select_id = $(this).prevAll('.all_select_class').attr('id');
                        var update_input_id = $(this).prevAll('.all_input_class').attr('id');

                        element_name = update_select_id.slice(0, 10);
                        pass_element_name = update_select_id.replace(element_name, "");

                        update_dropdown(update_select_id, update_input_id, pass_element_name);
                    });

                update_dropdown_div.append(update_button);

                submit_button = $("<button>")
                    .addClass("dropdown_button_class")
                    .text('Submit')
                    .click(function() {
                        POST_dropdown_data();
                    });
                update_dropdown_div.append(submit_button);

            }
        });
}