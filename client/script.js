var openFile = function (event) {
  var input = document.getElementById("file_input");
  if (input.files.length > 0) {
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = function () {
      file_content = reader.result;
      file_name = input.files[0].name;
      clear_screen();

      /*
       In javascript, it is not possilbe to read a local file without user intervention.
       But I don't want the user to select progress line and task tree separately. 
       So, I let the user choose the progress line and then fetch the task tree by api calling. 
      */
      show_progres_line(file_name, file_content);
      fetch_task_tree(file_name);
    };
  }
};

function clear_screen() {
  var divs = document.querySelectorAll("div");

  for (var i = 0; i < divs.length; i++) {
    divs[i].remove();
  }
  var btn = document.querySelectorAll("button");
  for (var i = 0; i < btn.length; i++) {
    btn[i].remove();
  }

  var hs = document.querySelectorAll("h2");

  for (var i = 0; i < hs.length; i++) {
    hs[i].remove();
  }
}


// First character uppercase
function capitalize(s) {
  if (s) return s[0].toUpperCase() + s.slice(1);
  return "Null";
}

// First character uppercase
function lower(s) {
  if (s) return s.toLowerCase();
  return "Null";
}

function addElement(data, index) {
  var toAdd = document.createDocumentFragment();
  // create a new div element
  var newDiv = document.createElement("div");
  newDiv.id = "div" + index;
  newDiv.contentEditable = "true";

  var p1 = document.createElement("p");
  p1.className = "ingredient";
  var p2 = document.createElement("p");
  var p3 = document.createElement("p");

  for (var i = 0; i < data["state"].length; i++) {
    var container_state = document.createElement("span");
    container_state.style.color = "black";
    var container_location = document.createElement("span");
    container_location.style.color = "green";
    var container_motion = document.createElement("span");
    container_motion.style.color = "red";
    var container_arrow = document.createElement("span");
    container_arrow.style.color = "black";
    var phy_state = data["state"][i].physical_state;
    var location = data["state"][i].location;
    var motion = data["motion"][i];
    var state = "";
    if (phy_state) {
      if (i > 0) {
        state += " ---> ";
      }
      state += phy_state;
      container_state.appendChild(document.createTextNode(state));
      p2.appendChild(container_state);
    }
    if (location) {
      var location = "(" + location + ")";
      container_location.appendChild(document.createTextNode(location));
      p2.appendChild(container_location);
    }
    if (motion) {
      // states += " ---> ";
      container_arrow.appendChild(document.createTextNode(" ---> "));

      p2.appendChild(container_arrow);
      container_motion.appendChild(document.createTextNode(motion));
      p2.appendChild(container_motion);
    }
  }
  p1.appendChild(document.createTextNode(capitalize(data["ingredient"])));

  // p2.appendChild(document.createTextNode(states));
  p3.appendChild(
    document.createTextNode("End product: " + data["end_product"])
  );

  //var newContent = document.createTextNode(divText);
  // add the text node to the newly created div
  newDiv.appendChild(p1);
  newDiv.appendChild(p2);
  newDiv.appendChild(p3);

  toAdd.appendChild(newDiv);
  return toAdd;
}

function save_updates(file_name) {
  progress_lines = [];
  console.log("saving all progress line");
  var divs = document.querySelectorAll("div");
  
  for (var i = 0; i < divs.length; i++) {
    var ps = divs[i].getElementsByTagName("p");
    var ing_name = ps[0].textContent;
    var progress = ps[1].textContent;
    var end_product = ps[2].textContent;
    var entry = {}
    entry["ingredient"] = lower(ing_name);
    entry["end_product"] = end_product.replace('End product: ', '');
    entry["state"] = [];
    entry["motion"] = [];
    
    var arr = progress.split(" ---> ");
    for(var j = 0; j < arr.length; j++) {
      
      if(j % 2 == 0) {
        var obj = {}
        var state = arr[j].split("(");
        obj["physical_state"] = state[0];
        
        if (state.length > 1) {
          var location = state[1].split(")")[0];
          obj["location"] = location;
        }
        else {
          obj["location"] = [];
        }
        
        entry["state"].push(obj);
      }
      else {
        entry["motion"].push(arr[j]);
      }
    }
    //console.log(arr);
    progress_lines.push(entry);
  }


  // I need to make this server call because javascript in the client side can not write to a file. 
  fetch('http://127.0.0.1:3000/progress-line/' + file_name + '.json', {
    method: 'POST', // or 'PUT'
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress_lines),
  })
  .then(response => response.text())
  .then(data => {
    console.log('data: ',data);
    //$('#success').html("Success").fadeIn('slow'); 
    //$('#successMsg').show()
    $('#successMsg').show("data insert successfully");
    $('#successMsg').fadeOut(8000);
    //setTimeout(function() { $("#successMsg").hide(); }, 5000);
  })
  .catch(error => {
    console.error('Error:', error)
  })
  // var myFile = new File([JSON.stringify(progress_lines)], file_name + ".json", {type: "application/json"});
  
  // saveAs(myFile);
}

function show_progres_line(file_name, file_content) {
  file_content = JSON.parse(file_content);
  var parent = document.getElementById("body");
  // console.log(file_content);
  file_name = file_name.replace(".json", "");
  document.getElementById("recipe_name").innerHTML =
    "Recipe: " + file_name;
  
  var newH = document.createElement("h2");
  newH.appendChild(document.createTextNode("Progress Line"));
  parent.appendChild(newH);

  
  for (var i = 0; i < file_content.length; i++) {
    var toAdd = addElement(file_content[i], i);
    parent.appendChild(toAdd);
  }
  var btn = document.createElement("button");
  btn.innerHTML = "Update";
  btn.onclick = function () {
    save_updates(file_name);
  };
  parent.appendChild(btn);

  var successP = document.createElement("p");
  successP.id = "successMsg";
  successP.appendChild(document.createTextNode("Updated Successfully"));
  parent.appendChild(successP);
}


function show_task_tree(data) {
  var parent = document.getElementById("body");
  var newH = document.createElement("h2");
  newH.appendChild(document.createTextNode("Task Tree"));
  parent.appendChild(newH);

  // Create the UI
  var toAdd = document.createDocumentFragment();
  // create a new div element
  var newDiv = document.createElement("div");
  newDiv.id = "taskTreeDiv";
  newDiv.contentEditable = "true";
  
  data = data.split("\n");
  for(var i = 0; i < data.length; i++) {
    var newP = document.createElement("p");
    
    newP.appendChild(document.createTextNode(data[i]));
    newDiv.appendChild(newP);
  }
  toAdd.appendChild(newDiv);
  parent.appendChild(toAdd);

  var btn = document.createElement("button");
  btn.innerHTML = "Update";
  btn.onclick = function () {
    console.log("saving task tree");
  };
  parent.appendChild(btn);

  var successP = document.createElement("p");
  successP.id = "successMsg";
  successP.appendChild(document.createTextNode("Updated Successfully"));
  parent.appendChild(successP);
}


function fetch_task_tree(file_name){

  // Fetch the data
  file_name = file_name.replace(".json", ".txt")
  fetch('http://127.0.0.1:3000/task-tree/' + file_name, {
    method: 'GET', 
    mode: 'cors'
  })
  .then(response => response.text())
  .then(data => {
    console.log('data: ',data);
    show_task_tree(data);
  })
  .catch(error => {
    console.error('Error:', error)
  })

}