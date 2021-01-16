let selectvar = $("#varselect")[0];
let varval = $("#varvalue")[0];
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