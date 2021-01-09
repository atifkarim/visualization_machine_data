let selectvar = document.getElementById("varselect");
let varval = document.getElementById("varvalue");
let dict = {};
//let newdict = {};

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

let prepare = function(var_dict) {
    selectvar.innerHTML = '<option selected="true" disabled="disabled">Choose variable</option>';
    dict = var_dict;

    for ([key, value] of Object.entries(var_dict)) {
        let option = document.createElement("option");
        option.text = key;
        option.value = key;
        selectvar.add(option);
    }
}

let get_dropdown = function() {
    $.getJSON('/update_dropdown',
        function(data) {
            prepare(data);
        });
    return false;
};