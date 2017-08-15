var global_currentArea = null;
var global_startArea = null;
var global_areaArray = [];




//Class Area, used to manage each area in the text adventure
class Area {
	// contruct area -- declare all variables
	constructor(name = "New Area", description = "Blank Area", startArea = false) {
		this.name = name;
		this.description = description;
		this.destinations = {};
		this.startArea = startArea;
		this.currentArea = false; //for loading saves. If this is true in json string then it gets set to current area during loading
		global_areaArray.push(this);
		this.index = global_areaArray.length - 1;
		if(startArea == true) {
			global_startArea = this;
			global_currentArea = this; //by default startArea is set to current area when first constructed, however saves will change this and this logic is not applied when loaded by json.
			this.currentArea = true;
		}
	}
	
	// add a destination link to area (Use the array index to specify directions) -- probably turn into a data type when incorparating events
	addDestination(direction, areaIndex) {
		this.destinations[direction] = areaIndex;
	}
	// move in direction, if that direction points to an area then set global_currentArea to that area.
	move(dir) {
		//console.log(this.destinations[dir]);
		if (this.destinations[dir] != undefined) {
			global_currentArea = global_areaArray[this.destinations[dir]];
			display(global_currentArea.description);
			//console.log(global_currentArea.description);
		}
	}
}

function runMove(){
	move();
}
function move() {
		console.log("started");
		input = document.getElementById("input");
		input = input.value;
		console.log(input);
		input = input.split(" ");
		/*for (i=0;i<input.length;i++) {
			if(input[i] == "MOVE") {
				global_currentArea.move(input[i+1]);
			}
		}*/
		global_currentArea.move(input[1]);
}

// Destination data type -- not currently in use but probably will be later
var Destination = function(direction, area) {
	this.direction = direction;
	this.area = area;
}


//load Project
function loadProject(file) {
	file = file.split("\r\n\r\n");
	for (var i=0; i < file.length; i++) {
		global_areaArray[i] = JSON.parse(file[i]);
		global_areaArray[i].__proto__ = Area.prototype;
		if(global_areaArray[i].startArea == true) {
			global_startArea = global_areaArray[i];
		}
		if(global_areaArray[i].currentArea == true) {
			global_currentArea = global_areaArray[i];
		}
	}
}

function receiveText(e) {
	file = e.target.result;
	loadProject(file);
}

//load a local project/game/save
function loadLocalProjectFile() {
	if(typeof window.FileReader !== 'function') {
		alert("Your browser does not support the fileReader api");
		return;
	}
	var input = document.getElementById("srcFile");
	if(!input.files[0]) {
		alert("please select a file");
	}
	else {
		var fileReader = new window.FileReader();
		fileReader.onload = receiveText; 
		file = fileReader.readAsText(input.files[0]);
	}
}



//save a project
function saveProject() {
	var outfile = "";
	for (i in global_areaArray) {
		outfile = outfile + JSON.stringify(global_areaArray[i]);
		if(i != global_areaArray.length - 1) {
			outfile = outfile + "\r\n\r\n";
		}
	}
	save("project.json", outfile);
}

//Set up saved project for download
function save(filename, data) {
	var blob = new Blob([data], {type: 'text/json'});
	var element = window.document.createElement('a');
	element.href = window.URL.createObjectURL(blob);
	element.download = filename;
	document.body.appendChild(element);
	element.click();
}


//attach event listener to the input checking whether [ENTER] is pressed, and if so running report() which processes the data
function setInputListener() {
	document.getElementById('input').addEventListener('keydown', function (e) {
		
		var key = e.which || e.keyCode; 
		if (key == 13) { 
			e.preventDefault();
			takeInput();
			
		} 
	});
}


function display(text) {
	var history = document.getElementById("history");
	var node = document.createElement("p");
	node.setAttribute("class", "history");
	history.append(node, text);
	return 0;
}


// Resets the prompt value and brings it into focus

function resetPrompt() {
	input = document.getElementById("input");
	input.value = ">";
	input.focus();
}

//function sets the scroll of the console back to the bottom (where the input is)

function updateScroll() {
	var console = document.getElementById("console");
	console.scrollTop = console.scrollHeight - console.clientHeight;
}


//Deal with input from prompt

function takeInput() {
	var input = document.getElementById("input"); //get input element
	display(input.value);
	/*var history = document.getElementById("history"); //get history elemnt for appending previous commands
	
	var node = document.createElement("p"); //create new element which will be appended
	node.setAttribute("class", "history"); //set the history paragraph class to 'history'
	history.append(node, input.value); //append history paragraph and inpute value to histry div*/
	dealInput(input.value);
	//move();
	resetPrompt();
}


//deal with the input
function dealInput(input) {
	input = input.toUpperCase();
	input = input.replace(/>/g, "");	/// this is the problem
	console.log(input);
	input = input.split(" ");
	//console.log(global_currentArea.destinations[input[0]]);
	for (i=0;i<input.length;i++) {
		//console.log(input[i]);
		if(input[i] == "MOVE") {
			global_currentArea.move(input[i+1]);
			return 0;
		}

	}
}


