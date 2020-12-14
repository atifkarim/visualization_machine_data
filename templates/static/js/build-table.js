/*var my_table = [{
    "A": {
		"name": "Monte Falco",
		"height": 1658,
		"place": "Parco Foreste Casentinesi"
	},
	"B": {
		"name": "Monte Falterona",
		"height": "1654",
		"place": "Parco Foreste Casentinesi"
	},
	"C": {
		"name": "Poggio Scali",
		"height": "1520",
		"place": "Parco Foreste Casentinesi"
	},
	"D": {
		"name": "Pratomagno",
		"height": "1592",
		"place": "Parco Foreste Casentinesi"
	},
	"E": {
		"name": "Monte Amiata",
		"height": "1738",
		"place": "Siena Anisa"
	}
}];



my_key = Object.keys(my_table[0]);

// var table = document.querySelector('table');
var table = document.getElementById('test_table')
var rows = ''; var indx_1 = 0;
for (var p in my_table) {
  for (var k in my_table[p]) {
  	rows+= '<tr><th>' + k + '</th></tr>'
		for(var s in my_table[p][my_key[indx_1]]){
		//console.log("k: ",k," and val: ", my_table[p][k]);
		//console.log("main key k: ",k," secondary key s: ",s,", secondary key val: ",my_table[p][my_key[indx_1]][s]);
    	rows += '<tr><td>' + s + '</td><td>' + my_table[p][my_key[indx_1]][s] + '</td></tr>'
  	}
		indx_1++;
	}
}
indx_1=0;
table.innerHTML = rows;
*/


var len_A; //expected 2
var len_key_A; //expected 3
var all_info_A = [];
var table = document.getElementById('test_table')
var cap = table.createCaption();
cap.innerHTML = 'Observation of Machine Statistics';

function giveCaptionTable(k, table) {
   var rows = table.insertRow(-1);
   let cell1 = rows.insertCell(-1);
   cell1.innerHTML = 'Property of table ' + k;
}

function CreateColumnHeader(my_sub_sub_key, table) {
   var rows = table.insertRow(-1);
   for (var a in my_sub_sub_key) {
      //console.log(my_sub_sub_key[a]);
      let cell1 = rows.insertCell(a);
      cell1.innerHTML = my_sub_sub_key[a];
   }
}

function FillUpTable(len_A, len_key_A, all_info_A, table) {
   let count_index_all_info_A = 0;
   var rows = table.insertRow(-1);
   for (let x = 0; x < len_A; x++) {
      var rows = table.insertRow(-1);
      for (let y = 0; y < len_key_A; y++) {
         let cell1 = rows.insertCell(y);
         cell1.innerHTML = all_info_A[count_index_all_info_A];
         count_index_all_info_A++;
      }
   }
}
//console.log("name first: ",data[0][my_key[0]][my_sub_key[0]][my_sub_sub_key[0]]);
//console.log("FOR LOOP TABLE CHECKER");

function deleteOldRows(table) {
   // console.log("table row len: ",table.rows.length);
   for (var i = table.rows.length - 1; i > 0; i--) {
      // console.log("i: ",i)
      table.deleteRow(i);
   }
}

let getTableData_json = function test() {
   $.get("/auto_update_table", function (data) {
      for (var p in data) {
         //console.log(data[p]); //whole data
         for (var k in data[0]) {
            // giveCaptionTable(k, table);
            //console.log(k); // A,......
            var count_col = 0; // column header will be repeated so count them
            var col_header_name = []; // after count all 1 time then push them in an array
            //console.log("length of A's content", Object.keys(data[p][k]).length); // will be 2(value1, value2)
            len_A = Object.keys(data[p][k]).length;
            for (var s in data[0][k]) {
               //console.log(s); // value1, value2 ......
               //console.log(data[0][k][s]); // inside elements with info of each value
               //console.log("length of each value's content", Object.keys(data[p][k][s]).length); // will be 3 here(name, value , unit)
               len_key_A = Object.keys(data[p][k][s]).length;
               for (var t in data[0][k][s]) {
                  col_header_name.push(t);
                  //console.log(t); // name , value, unit .. n times (n = how many times former key is)
                  //console.log(data[0][k][s][t]);
                  all_info_A.push(data[0][k][s][t]);
               }
               count_col++; // if it 1 that means for the child key of "A"(device) is read and got All col name(name, value, unit)
               if (count_col == 1) { CreateColumnHeader(col_header_name, table); } // call the CreateColumnHeader func
            }
            FillUpTable(len_A, len_key_A, all_info_A, table);
            all_info_A = [];
         }
      }
   });
}