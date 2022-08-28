//**** localStorage in usage: ********

var wid, arr, arr1, m, archive, strUser, res, sums, table;
//alert(self.origin);

//unique ID/key generation:
function genId() {
   wid = 'WID' + '-' + (Math.floor(Math.random() * 3700) + 1);
   return wid;  
}
genId();

//******** save data to localStorage: ********
document.getElementById("btn").addEventListener("click", mySave);

function mySave(event) {

var pro = document.getElementById("pro").value;
var dat = document.getElementById('dat').value;
var d = new Date(dat);
var stim = document.getElementById('stim').value;
var stimn = document.getElementById('stim').valueAsNumber;
var etim = document.getElementById('etim').value;
var etimn = document.getElementById('etim').valueAsNumber;
var hou = ((etimn - stimn)/3600000);
var lun = document.querySelector('#lunch');

//if hour start at 00.00, to avoid minus value: 
if(hou < 0) {
  hou = hou + 24;
}

//it extract lunch time:
if(lun.checked) {
  hou = hou - 0.5;
}

hou = hou.toFixed(1);

var obj = {workId: wid, project: pro, date: dat, stime: stim, etime: etim, hours: hou};
var myJSON = JSON.stringify(obj);

//check browser support:
if(typeof(Storage) !== "undefined") {
  if(pro !== '' && dat !== "" && stim !== '' && etim !== '' && hou !== '') {
  //Retrieve all data from local storage:
  if(event.returnValue) {
    oneKeyStorage();
        function oneKeyStorage() {
            arr = [];
            var keys = Object.keys(localStorage);
            var i, key;
        for (i = 0; key = keys[i]; i++) {
            arr.push(key);
        }    
      }
          m = arr.includes(wid); 
      }

  // check wid/localStorage key dublicates:    
    if(m == false) {
      //store data in localStorage:
      try {
      localStorage.setItem(wid, myJSON);
      document.getElementById("res1").innerHTML = "Data was saved to table!";
      jQuery(document).ready(function($){
      $("#res1").delay(2000).fadeOut(4000);
      });
      } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
          alert('The storage is full of data:\n- Download the data to computer.\n- Delete data from a table.');
        }
      }
    }
  } else {
    return '';
  }
        
} else {
  document.getElementById("res1").innerHTML = "Sorry, your browser does not support Web Storage...";
}

  setTimeout(exec2, 5000); 
}


//Reset/reload function:
 function exec2() {
  document.getElementById("res1").innerHTML = "";
	location.reload();
}

//form submition:
jQuery(document).ready(function($){
$("form").submit(function(e) {
   e.preventDefault();
  var url = $(this).attr("action");
  var data = $(this).serialize();
  $.post(url, data, function(response) {
     return this; //here can be user noticing about submiting 
  });
});
});

//************* how to populate drop down list with array: ****************
//select key from localStorage:
var select = document.getElementById("selectKey");
var arrOption = [];
var keys = Object.keys(localStorage);
var i, key;

//It is called 'natural sort'. Here is sorted 'keys' array, like 'WID-777', mix of letters and numbers:
//To sort in reverse order: keys.sort(naturalCompare).reverse();
function naturalCompare(a, b) {
   var ax = [], bx = [];

   a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
    b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
    
    while(ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if(nn) return nn;
    }

    return ax.length - bx.length;
}
keys.sort(naturalCompare);

//looping localStorage keys:
for (i = 0; key = keys[i]; i++) {
  var z = keys[i].slice(0, 3);
  if(z == 'WID') {
    arrOption.push(key);
  }  
}

for (i = 0; i < arrOption.length; i++) {
  var opt = arrOption[i];
  var el = document.createElement("option");
  el.textContent = opt;
  el.value = opt;
  select.appendChild(el);
}

function run() {
   var b = document.getElementById("selectKey");
   var val = b.options[b.selectedIndex].value;  //it returns select value
   var text = b.options[b.selectedIndex].text;  //it returns select text
   strUser = b.value;
}

//********* One key and value deletion from localStorage: ***************
//Notice that key and value were deleted:
function notice() {
  document.getElementById('not').innerHTML = "Project was deleted!!!";
  jQuery(document).ready(function($){
  $("#not").delay(2000).fadeOut(4000);
  });
}


//Function that let's notice after page reloading:
window.onload = function() {
  allValuesStorage();
  var reloading = sessionStorage.getItem('reloading');
  if(reloading) {
    sessionStorage.removeItem('reloading');
    notice();
  }
};

//delete one key and value from localStorage:
 function delOneKey() {
    localStorage.removeItem(strUser); //it deletes data from localStorage by chosen key in select element
    sessionStorage.setItem('reloading', 'true');
    document.location.reload();
}

//*********** delete all keys and values from localStorage/confirm deletion: *********************
 function clearAllStorage() {
   if(confirm('Are you sure?\nDo you want to delete all table?') == true) {
   localStorage.clear();
   exec2();
   }
 }

//*********** retrieve all key's values from localStorage: ***************
function allValuesStorage() {
  archive = [];
  var keys = Object.keys(localStorage);
  var i, key, l;
  
for (i = 0; key = keys[i]; i++) {
    l = localStorage.getItem(key);
   var h = JSON.parse(l);
   archive.push(h);
  }
  //Sorting archive array by date. It converts hours to string,
  //why the next step is archive array hours convert to number:
  archive.sort(function (a, b) {
    var key1 = a.date;
    var key2 = b.date;

    if (key1 < key2) {
        return -1;
    } else if (key1 == key2) {
        return 0;
    } else {
        return 1;
    }
});
  //archive array hours convert to number:
   archive.map((item, index, arr) => {
     return Number(item.hours);
   });
   insertD();
   getAllHours();
   
}

//************** insert local storage data to html table *****************
function insertD() {
   // get the values, convert and parse to have double assignment value:
    var sdat = new Date(document.getElementById("sdat").value);
    var edat = new Date(document.getElementById("edat").value);
    sdat = Date.parse(sdat) || 0;
    edat = Date.parse(edat) || 0;

  if(sdat == 0 && edat == 0) {
    //Default values:
    sdat = new Date(1970, 1, 1);
    edat = new Date(2100, 11, 31);
    var newArr1 = [] || 0;
    //array filter by date:
   newArr1 = archive.map((item, index, arr) => {
      if(new Date(item.date) >= sdat && new Date(item.date) <= edat) {
         return item;
      }
   });

 // It removes all undefined values from array after filtering:
   var p1 = newArr1.filter(item => item !== undefined); 

   //show data in the table:
    table = document.getElementById('datas');
   table.innerHTML='';
   var tr ='';
   p1.forEach(x=>{
     tr +='<tr>';
     tr += '<td>' + x.workId + '</td>' + '<td>' + x.project + '</td>' + '<td>' + x.date + '</td>' + '<td>' + x.stime + 
      '</td>' + '<td>' + x.etime + '</td>' + '<td>' + x.hours + '</td>';
     tr +='</tr>';
   })
   table.innerHTML += tr;

  } else {
   //array filter by date:
   var newArr2 = [] || 0;
   newArr2 = archive.map((item, index, arr) => {
      if(new Date(item.date) >= sdat && new Date(item.date) <= edat) {
         return item;
      }
   });

   // It removes all undefined values from array after filtering:
   var p2 = newArr2.filter(item => item !== undefined); 

   //show data in the table:
   table = document.getElementById('datas');
   table.innerHTML='';
   var tr ='';
   p2.forEach(x=>{
     tr +='<tr>';
     tr += '<td>' + x.workId + '</td>' + '<td>' + x.project + '</td>' + '<td>' + x.date + '</td>' + '<td>' + x.stime +
     '</td>' + '<td>' + x.etime + '</td>' + '<td>' + x.hours + '</td>';
     tr +='</tr>';
   });
   table.innerHTML += tr;
  }
  getFilteredHours(sdat, edat);
  saveEdits(table);
}

//***************** Create modal part: *********************
var modal, newArr3 = [] || 0;

//set delay to collect all data from table/localStorage:
setTimeout(saveEdits, 500);
   
   function saveEdits() {
    
    //table = document.getElementById('datas');

    //array filter by item.workId property: 
    newArr3 = archive.map((item, index, arr) => {
      return item.workId;
   });
   console.log(newArr3);
   

   //----------------------------------------------------
if(table) {
  //Select (looping) table rows:
  for(var i = 0; i < table.rows.length; i++) {
    table.rows[i].onclick = function() {
      tableText(this);
      //when the user clicks the table row, open the modal:
      modal.style.display = 'block';
    };
  }
}

function tableText (tableRow) {
  var woid = tableRow.childNodes[0].innerHTML;
  var objwoid = {'workId' : woid};
  var proid = tableRow.childNodes[1].innerHTML;
  var datid = tableRow.childNodes[2].innerHTML; 
  var stimid = tableRow.childNodes[3].innerHTML;
  var etimid = tableRow.childNodes[4].innerHTML;
  //Color selected row:
  tableRow.style.backgroundColor = 'orange';
  //console.log(tableRow);
  compare(objwoid);
  mod(proid, datid, stimid, etimid);
  }
//*******show modal box with old localStorage values************
function mod(proid, datid, stimid, etimid, houid) {
  document.getElementById("pro1").value = proid;
  document.getElementById('dat1').value = datid;
  document.getElementById('stim1').value = stimid;
  document.getElementById('etim1').value = etimid;
  }
}


//*********** Confirm that table workId excist in localStorage: ***********
var res4;
function compare(k) {
  res4 = k.workId;
  console.log(res4);
  var a = document.getElementById('res5');
  a.style.fontWeight = 'bold';
  a.innerHTML = res4;
  var first = newArr3.includes(res4);
  //console.log(first);
  if(first) {
    //get the modal:
     modal = document.getElementById('myModal');

    //get the <span> element that closes the modal:
    var span = document.getElementsByClassName('close')[0];

    //when the user clicks the 'X' button, close the modal:
    span.onclick = function() {
      modal.style.display = 'none';
    }; 

  //After save changes on modal, close modal after 3,2 sek.
    document.getElementById('btn1').addEventListener('click', function() {
        setTimeout(mClose, 3200);
        function mClose() {
          modal.style.display = 'none';
          wid = res4;
          inc(wid);  
        }
    });

    //when the user clicks anywhere outside of the modal, close it:
    window.onclick = function(event) {
      if(event.target == modal) {
        modal.style.display = 'none';
      }
    };
  }
}

//******** make changes on one row, on modal part: ************
function inc(beg) {
   var pro1 = document.getElementById("pro1").value;
   var dat1 = document.getElementById('dat1').value;
   var stim1 = document.getElementById('stim1').value;
   var stimn1 = document.getElementById('stim1').valueAsNumber;
   var etim1 = document.getElementById('etim1').value;
   var etimn1 = document.getElementById('etim1').valueAsNumber;
   var hou1 = ((etimn1 - stimn1)/3600000);
   var lun1 = document.querySelector('#lunch1');
 
//if hour start at 00.00, to avoid minus value:    
if(hou1 < 0) {
  hou1 = hou1 + 24;
}

//it extract lunch time:
if(lun1.checked) {
  hou1 = hou1 - 0.5;
}

hou1 = hou1.toFixed(1);
 

var obj1 = {workId: beg, project: pro1, date: dat1, stime: stim1, etime: etim1, hours: hou1};
var myJSON1 = JSON.stringify(obj1);

//check browser support
if(typeof(Storage) !== "undefined") {
  if(pro1 !== '' && dat1 !== "" && stim1 !== '' && etim1 !== '' && hou1 !== '') {
  //Retrieve all data from local storage
  if(beg) {
    oneKeyStorage1();
        function oneKeyStorage1() {
            arr1 = [];
            var keys = Object.keys(localStorage);
            var i, key;
        for (i = 0; key = keys[i]; i++) {
            arr1.push(key);
        }    
      }
          var c = arr1.includes(beg); 
       

  // check wid/localStorage key dublicates    
    if(c == true) {
      //alert(c);
      //store data (changes) in localStorage:
      try {
      localStorage.setItem(beg, myJSON1);
      } catch (er) {
        if (er == QUOTA_EXCEEDED_ERR) {
          alert('The storage is full of data:\n- Download the data to computer.\n- Delete data from a table.');
        }
      }

      exec2();

    } else {
      document.getElementById("res6").innerHTML = "Work Id does not exist!";
      jQuery(document).ready(function($){
      $("#res1").delay(2000).fadeOut(4000);
      });
    }
     } else {
      document.getElementById("res6").innerHTML = "Data was saved to table!";
      jQuery(document).ready(function($){
      $("#res6").delay(2000).fadeOut(3000);
      });
      }
  } else {
    return '';
  }
        
} else {
  document.getElementById("res6").innerHTML = "Sorry, your browser does not support Web Storage...";
}

}
   
//********** get all hours of entire table: *********************
 function getAllHours() {
   //array filter by hours:
   var hourSum = [] || 0;
   hourSum = archive.map((item, index, arr) => {
     return Number(item.hours);
   });
   // It removes all undefined values from array after filtering:
   var hourSum = hourSum.filter(item => item !== undefined);

   res = hourSum.reduce((a, b) => a + b, 0).toFixed(1);
   document.getElementById('res2').innerHTML = res;
   document.getElementById('ta').innerHTML = res;

 }

//********* get all hours of filtered table by date: *****************
function getFilteredHours(sdat, edat) {
   sdat = new Date(document.getElementById("sdat").value);
   edat = new Date(document.getElementById("edat").value);
   var newArr = [] || 0;
   newArr = archive.map((item, index, arr) => {
  
   if(sdat && edat) {
      if(new Date(item.date) >= sdat && new Date(item.date) <= edat) {
         return Number(item.hours);
      }
   }
  });

  // It removes all undefined values from array after filtering
    var p = newArr.filter(item => item !== undefined); 

    sums = p.reduce((a, b) => a + b, 0).toFixed(1);
    document.getElementById('res3').innerHTML = sums;
    document.getElementById('taf').innerHTML = sums;

    sums = Number(sums);
    if(sums <= 0) {
      jQuery(document).ready(function($) {
    $('#fil').hide();
    $('#tot').show();
  });
} else {
     jQuery(document).ready(function($) {
   $('#tot').hide();
   $('#fil').show();
 });
}
}


//*********** Save table data to plain txt file: ****************
jQuery(document).ready(function($) {
$('#save').click(function() { 
  insertD();
  var retContent = [];
  var retString = '';

  $('tbody tr').each(function (idx, elem) {
    var elemText = [];
    $(elem).children('td').each(function (childIdx, childElem) {
      elemText.push($(childElem).text());
    });
    retContent.push(`(${elemText.join('| ')})`);
  });
  retString = retContent.join(',\r\n');
  if(sums <= 0) {
    retString = retString + '\nTotal hours: ' + res;
  } else {
    retString = retString + '\nFiltered hours: ' + sums;
  }
	var file = new Blob([retString], {type: 'text/plain'});
  var btn = $('#save');
  btn.attr("href", URL.createObjectURL(file));
  btn.prop("download", "data.txt");
});
});


//*********** return localStorage capasity and used space: ********************
var localStorageSpace = function(){
    var data = '';
    //console.log('Current local storage: ');
    for(var key in window.localStorage){

        if(window.localStorage.hasOwnProperty(key)){
            data += window.localStorage[key];
            //console.log( key + " = " + ((window.localStorage[key].length * 16)/(8 * 1024)).toFixed(2) + ' KB' );
        }
    }
    var tsu = data ? '\n' + 'Total space used: ' + ((data.length * 16)/(8 * 1024)).toFixed(2) + ' KB' : 'Empty (0 KB)';
    document.getElementById('spaceused').innerHTML = tsu;
    var asl = data ? 'All space: ' + (5120 - ((data.length * 16)/(8 * 1024)).toFixed(2)) + ' KB' : '5 MB';
    document.getElementById('totalspace').innerHTML = asl;
  
};

localStorageSpace();