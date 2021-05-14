// https://jsfiddle.net/atifkarim/7wgaLpe6/
// https://stackoverflow.com/questions/10570904/use-jquery-to-change-a-second-select-list-based-on-the-first-select-list-option
// https://stackoverflow.com/questions/7697936/jquery-show-hide-options-from-one-select-drop-down-when-option-on-other-select

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
            value_1: value_1
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
    $("#device_n").trigger('change') //call second select
}

$("#device_n").change(function() {
    var id = $(this).val();
    $("#name_n option").hide() //hide all options
    $("#name_n option[value='" + id + "']").show(); //show options where value matches
    $("#name_n option[value_1=0][value='" + id + "']").prop('selected', true); //set first value selected
    $("#name_n").trigger('change') //call other select
});

$("#name_n").change(function() {
    var values = $("#device_n").val();
    var value_1 = $(this).find("option:selected").attr("value_1")
        //same ...as before
    $("#value_n option").hide()
    $("#value_n option[value_1='" + value_1 + "'][value='" + values + "']").show();
    $("#value_n option[value_1='" + value_1 + "'][value='" + values + "']").prop('selected', true);


})


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