let selectvar = document.getElementById("varselect");
let varval = document.getElementById("varvalue");
let olddict = {};
let newdict = {};

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

let get_dropdown = function() {
    $.getJSON('/update_dropdown',
        function(data) {
            prepare(data);
            get_val();
        });
}