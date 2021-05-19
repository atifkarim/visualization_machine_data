// https://jsfiddle.net/atifkarim/7wgaLpe6/
// https://stackoverflow.com/questions/10570904/use-jquery-to-change-a-second-select-list-based-on-the-first-select-list-option
// https://stackoverflow.com/questions/7697936/jquery-show-hide-options-from-one-select-drop-down-when-option-on-other-select

var data_new = {}; // will be used to store json data passed from backend and later to provide in different function in JS
var json_for_backend = {}; // json container to stoe and pass data from client side to backend


function get_json_for_form() {
    $.get("/get_json_for_form", function(data) {
        // make_dropdown(data);
        make_dropdown_1(data);
    });
}

// following function works for method 1 where key_1, key_2, key_3 introduced
// https://jsfiddle.net/atifkarim/m9hun6zb/40/
function make_dropdown(data) {
    let select_device = document.getElementById("device_n");
    let select_value = document.getElementById("value_n");
    let select_name = document.getElementById("name_n");

    let jqr_select_device = $(select_device);
    let jqr_select_value = $(select_value);
    let jqr_select_name = $(select_name);

    key_list = []
    for (let a in data) {
        key_list.push(a);
    }
    main_key_len = Object.keys(data[key_list[0]]).length; // all time 4

    // len of first list inside key_2
    first_list_key_2_len = Object.keys(data[key_list[1]][0]).length;

    // following for loop can be used to make dropdown
    num = 0
    for (let x = 0; x < main_key_len; x++) {
        // key = data[key_list[num]][x];
        option = $("<option>")
            .attr({
                text: data[key_list[num]][x],
                value: data[key_list[num]][x]
            }).html(data[key_list[num]][x]);
        // console.log(data[key_list[num]][x])
        jqr_select_device.append(option);
        for (let y = 0; y < Object.keys(data[key_list[num + 1]][x]).length; y++) {
            option = $("<option>")
                .attr({
                    text: data[key_list[num + 1]][x][y],
                    value: data[key_list[num + 1]][x][y]
                }).html(data[key_list[num + 1]][x][y]);
            jqr_select_value.append(option);

            option = $("<option>")
                .attr({
                    text: data[key_list[num + 2]][x][y],
                    value: data[key_list[num + 2]][x][y]
                }).html(data[key_list[num + 2]][x][y]);
            jqr_select_name.append(option);
            // console.log(data[key_list[num + 1]][x][y], "**", data[key_list[num + 2]][x][y]);
        }
    }
}

function make_option_1(data, select, value, value_1 = null) {
    option = $("<option>")
        .attr({
            text: data,
            value: value,
            value_1: value_1,
            // style: { backgroundColor: gray }
        }).html(data);
    select.append(option);
}

function make_dropdown_1(data) {
    var select_device = document.getElementById("device_n");
    var select_name = document.getElementById("name_n");
    var select_value = document.getElementById("value_n");

    var jqr_select_device = $(select_device);
    var jqr_select_name = $(select_name);
    var jqr_select_value = $(select_value);

    for (let a in data) {
        make_option_1(a, jqr_select_device, a);
        for (let b = 0; b < Object.keys(data[a]["param"]).length; b++) {
            make_option_1(data[a]["param"][b], jqr_select_name, a, b);
            make_option_1(data[a]["value"][b], jqr_select_value, a, b);
        }
    }
    data_new = data;
    $("#device_n").trigger('change') //call first select
}

$("#device_n").change(function() {
    var id = $(this).val();
    let init_name_n_val = $("#name_n option:selected").val();
    $("#name_n option").hide() //hide all options
    $("#name_n option[value='" + id + "']").show(); //show options where value matches
    $("#name_n option[value_1=0][value='" + id + "']").prop('selected', true); //set second value selected

    var s = $("#device_n option:selected").val();
    if ($(this).val() == "select device") { // to set default name in two select
        $("#name_n").val("select parameter");
    } else {
        $("#device_n option").removeClass("selected") //remove from others
        $(this).find("option:selected").addClass("selected") //add selected 
        $("#name_n").trigger('change'); //call second select
    }
});

$("#name_n").change(function() {
    var values = $("#device_n").val();
    let name_n_option_text = $("#name_n option:selected").text();
    let name_n_option_index = data_new[values]["param"].indexOf(name_n_option_text);
    let updated_value = data_new[values]["value"][name_n_option_index];
    let value_key = "value";
    if ($(this).find("option:selected").attr("text") != "Select_Param" && !$(this).find("option:selected").hasClass("selected")) {
        $(this).find("option:selected").addClass("selected") //add selected
    } else {
        $(this).find("option:selected").removeClass("selected") //remove 
    }

    if (updated_value != "Select_Param") {
        create_json_for_backend(values, value_key, updated_value);
        console.log("name_n_option_text: ", name_n_option_text);
    }
});

function create_json_for_backend(main_key, value_key, updated_value) {
    if (!json_for_backend.hasOwnProperty(main_key)) {
        var value_temp_json = {};
        var value_temp_list = [];
        value_temp_list.push(updated_value);
        value_temp_json[String(value_key)] = value_temp_list;
        json_for_backend[String(main_key)] = value_temp_json;
    } else {
        if (!json_for_backend[main_key][value_key].includes(updated_value)) {
            json_for_backend[main_key][value_key].push(updated_value);
        } else {
            json_for_backend[main_key][value_key].indexOf(updated_value) !== -1 && json_for_backend[main_key][value_key].splice(json_for_backend[main_key][value_key].indexOf(updated_value), 1);
            console.log("now data: ", json_for_backend[main_key][value_key]);
        }
    }
}

/** following function send the updated JSON object to the BackEnd via POST method */
function POST_dropdown_data() {
    hiddenform = document.createElement("form")
    hiddenform.style.visibility = "hidden";
    hiddenform.method = "POST";

    for ([key, value] of Object.entries(json_for_backend)) {
        i_1 = document.createElement("input");
        i_1.name = key;
        i_1.value = JSON.stringify(value);
        hiddenform.appendChild(i_1);
    }

    // document.getElementsByClassName("container").appendChild(hiddenform);
    document.getElementById("body").appendChild(hiddenform);
    hiddenform.submit();
}

let input = $("<input>")
    .attr("id", "id_for_input")
    .attr('type', 'number')
    .attr('name', 'value')
    .attr('placeholder', 'query')
    .addClass("input_class");

let submit_button = $("<button>")
    .addClass("class_for_submit")
    .text('Submit')
    .click(function() {
        var inputVal = document.getElementById("id_for_input").value;
        json_for_backend["Query"] = inputVal;
        //json_for_backend_1 = JSON.stringify(json_for_backend);
        //console.log("js type: ", typeof(json_for_backend));
        //console.log("json type: ", typeof(json_for_backend_1));
        //for ([key, value] of Object.entries(json_for_backend)) {
        //		JSON.stringify(key);
        //	JSON.stringify(value);
        // }

        console.log("json_for_backend: ", json_for_backend);
        POST_dropdown_data();
    });

let get_div = document.getElementsByClassName("container");
let get_div_jquery = $(get_div);
get_div_jquery.append(input, submit_button);
/*
// for format json_for_db
let len_key_1 = Object.keys(data["key_1"]).length;
for (let x = 0; x<len_key_1;x++){
  console.log("key_1: ", data["key_1"][x], " , key_2: ",data["key_2"][x], " , key_3: ",data["key_3"][x]);
}
 */

/**
// for format json_for_db
 key_list = []
for (let a in data){
	key_list.push(a);
}
main_key_len = Object.keys(data[key_list[0]]).length; // all time 4

// len of first list inside key_2
first_list_key_2_len = Object.keys(data[key_list[1]][0]).length;

// following for loop can be used to make dropdown
num = 0
for (let x = 0; x < main_key_len; x++) {
    console.log(data[key_list[num]][x])
    for (let y = 0; y < Object.keys(data[key_list[num + 1]][x]).length; y++) {
        console.log(data[key_list[num + 1]][x][y], "**", data[key_list[num + 2]][x][y]);
    }
    console.log("SEASON FINISHED")
}
*/



/*

for (let a in data){
  for (let b = 0; b < Object.keys(data[a]["param"]).length; b++){
    console.log(a, " ** ", data[a]["param"][b], " ** ", data[a]["value"][b]);
  }
console.log("Season Finished");
}
}*/

/**
 * if want to pass any parameter through trigger function
 * it is the function calling -->> $("#device_n").trigger('change', [{ karim: data_new }]);


* it is teh function definition -->> $("#device_n").change(function(event, data) {
    console.log("nazmul data: ", data.karim);
    // use data.karim

}
 */