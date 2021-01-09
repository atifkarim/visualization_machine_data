let selectvar = document.getElementById("varselect");
let varval = document.getElementById("varvalue");
let dict = {};
let newdict = {};

let get_val = function() {
    let varname = selectvar.value;

    //if (varname in newdict) {
    //varval.value = newdict[varname]
    //} else {
    varval.value = dict[varname];
    //}
}

/*
let saveindict = function() {
    let varname = selectvar.value;
    let val = varval.value;

    dict[varname] = val;
}
*/

// let prepare = function(var_dict) {
//     selectvar.innerHTML = '<option selected="true" disabled="disabled">Choose variable</option>';
//     dict = var_dict;

//     for ([key, value] of Object.entries(var_dict)) {
//         let option = document.createElement("option");
//         option.text = key;
//         option.value = key;
//         selectvar.add(option);
//     }
// }

function updatedata() {
    var variableToUpdate = $("#varselect :selected").text();
    console.log("*** ", variableToUpdate);
    var updatedValue = varval.value;
    console.log("---- ", updatedValue);
    newdict[variableToUpdate] = updatedValue;
    console.log("update newdict: ", newdict);
    // setdata(dataTest);
}

function createURL() {
    let urlString = '/update_data_in_pyhton?';
    for ([key, value] of Object.entries(newdict)) {
        urlString = urlString + key + '=' + value + '&';
    }
    document.getElementById("createURL").innerHTML = urlString.slice(0, -1);
}

let prepare = function(var_dict) {

    // selectvar.innerHTML =
    '<option selected="true" disabled="disabled">Choose variable</option>';

    for ([key, value] of Object.entries(var_dict)) {
        var daySelect = document.getElementById('varselect');
        daySelect.options[daySelect.options.length] = new Option(key, value);
    }
};

let get_dropdown = function() {
    $.getJSON('/update_dropdown',
        function(data) {
            newdict = data;
            prepare(data);
            varval.value = selectvar.value
        });
    return false;
};