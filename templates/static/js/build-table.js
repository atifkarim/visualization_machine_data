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


let getTableData_json = function test() {
    $.get("/auto_update_table", function (data) {
      var my_table = data;
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

    });
}