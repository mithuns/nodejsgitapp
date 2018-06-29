var form = document.getElementById("mainForm");
var resultsForm = document.getElementById("resultsForm");


form.addEventListener("submit", function (evt) {
  var userid = document.getElementById("userid");
  var dataTable = document.getElementById("repodata");
  dataTable.innerHTML="";
  evt.preventDefault();   // Blocks form from submitting
  post("/", userid.value, function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  form.reset();
  userid="";
}, false);

function post(url, value, callback) {
  var req = new XMLHttpRequest();
  req.open("post", "/",true);
  var stringValue = "";
  stringValue+=value;  
  req.onreadystatechange = function (aEvt) {
    if (req.readyState !== 4) return;
    
    if (req.status !== 200) {
      return callback(new Error("Oh Nones"));
    }
    var data;
    try {
      data = JSON.parse(req.responseText);
      var len = data.length;
      if(len>0){
        for(var i=0;i<len;i++){
          var cellData1="";
          var cellData2="";
          if(data[i].name){
            cellData1+= data[i].name;
            cellData2+= data[i].html_url;
          }
          if(cellData1!="" && cellData2!=""){
            var table = document.getElementById("repodata");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = "<a href="+cellData2+">"+cellData1+"</a>";
            cell2.innerHTML = cellData2;
          }
        }
        document.getElementById("repodata").visible = true;
      }
    } catch(err) {
      return callback(err);
    }
    
  }
  req.send(stringValue);
}
