var global_currentArea = null;
var global_startArea = null;
var global_areaArray = [];
global_objectArray = [];
global_monsterArray = [];
var global_player;

//add new area template
function addAreaForm() {
	//var main = 
}
function addArea() {
	var form = document.getElementById("addArea").children;
	new Area(form[0].value, form[1].value, Boolean(form[2].value));
	return 0;
}



//probable player class for later.
class Player {
	constructor() {
		//this.room = global_currentArea; // rubbish, taken care of by global_currentArea
		this.items = {};
		this.maxHp = 10;
		this.hp = this.maxHp;
		this.dp = 5;
	}
}

function start() {
	display(global_currentArea.name, true);
	display(global_currentArea.description);
	player = new Player();
	var input = document.getElementById("input");
	input.disabled = false;
	
}

function advanceTick() {
	if(global_currentArea.monsters[0]) {
		for (i in global_currentArea.monsters) {
			display("There is a " + global_currentArea.monsters[i].name);
			player.hp -= global_currentArea.monsters[i].dp;
		}
	}
	if(player.hp < 1) {
		display("You have died\n\r\n\r\n\r");
		global_currentArea = global_startArea;
		var input = document.getElementById("input");
		input.disabled = true;
		setTimeout(start, 3000);
		
		
	}
}

//Class Area, used to manage each area in the text adventure
class Area {
	// contruct area -- declare all variables
	constructor(name = "New Area", description = "Blank Area", startArea = false) {
		this.class = "area"; //required for applying class prototype when loading json project files
		this.name = name;
		this.description = description;
		this.destinations = {};
		this.items = {};
		this.objects = {};
		this.startArea = startArea;
		this.currentArea = false; //for loading saves. If this is true in json string then it gets set to current area during loading
		global_areaArray.push(this);
		this.index = global_areaArray.length - 1;
		if(startArea == true) {
			global_startArea = this;
			global_currentArea = this; //by default startArea is set to current area when first constructed, however saves will change this and this logic is not applied when loaded by json.
			this.currentArea = true;	// may be stored in player class later
		}
	}
	
	// add a destination link to area (Use the array index to specify directions) -- probably turn into a data type when incorparating events
	addDestination(direction, areaIndex, locked=false) {
		this.destinations[direction] = [areaIndex, locked];
	}
	// move in direction, if that direction points to an area then set global_currentArea to that area.
	move(dir) {
		//console.log(this.destinations[dir]);
		if (this.destinations[dir] != undefined && this.destinations[dir][1] == false) {
			global_currentArea = global_areaArray[this.destinations[dir][0]];
			display(global_currentArea.name, true);
			display(global_currentArea.description);
			advanceTick();
			//console.log(global_currentArea.description);
		}
		else {
			display("You can't go that way");
		}
	}
}

//broken code as I figure out the workings
//What events do I want there to be?
//
// Area now accessible
// item added
// object added
// monster added
//
// Event initators
//
// item applied e.g key to lock
// item gained
// object moved
// monster killed
// object interacted with? (switch, looking somewhere causes trap? etc)

/*
area_addItem(item, areaIndex) {
	global_areaArray[areaIndex].items[item.name] = item;
}
area_addObject(object, areaIndex) {
	global_areaArray[areaIndex].objects[object.name] = name;
}

player_addItem(item) {
	player.items[item.name] = item;
}
area_unlock(areaIndex, direction) {
	global_areaArray[areaIndex].destinations[direction][1] = false;  //Could be really annoying in ui
}
area_addMonster(monster, areaIndex) {
	global_areaArray[areaIndex].monsters[monster.name] = monster;
}
*/


/*
event(arg1, arg2, test, fieldModified, modification) {
	if (test == "equal") {
				if(arg1 == arg2) {
					
*/
// How events work
//
//event type (if)
//if type (==, !=, >, <)
//argument 1
//argument 2
//
//result type (move, add)
//


class Monster {
	constructor(name = "New_Monster", hp = 10, dp = 1, sp = 1) {
		this.class = "monster";
		this.name = name;
		this.hp = hp;
		this.dp = dp;
		this.sp = sp;
		this.drop = [];
		this.index = global_areaArray.length - 1;
		global_monsterArray.push(this);
	}
}


class Event {
	constructor(name = "Untitled_Event") {
		this.name = name;
		
	}
}
class Object {
	constructor(name = "Untitled_Object") {
		this.name = name;
		this.area = {};
		this.events = {};
	}
	look(area) {
		if(this.area[area]) {
			display(this.area[area]);
		}
	}
	addEvent(arg1, arg2, test, fieldModified, modification) {
		
				
	}
	
}

class Item {
	constructor(name = "Untitled_Item") {
		this.name = name;
	}
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
		var loadedObject = JSON.parse(file[i]);
		if(loadedObject.class == "area") {
			global_areaArray[loadedObject.index] = loadedObject;
			global_areaArray[loadedObject.index].__proto__ = Area.prototype;
			if(global_areaArray[loadedObject.index].startArea == true) {
				global_startArea = global_areaArray[loadedObject.index];
			}
			if(global_areaArray[loadedObject.index].currentArea == true) {
				global_currentArea = global_areaArray[loadedObject.index];
			}
		}
		if(loadedObject.class == "monster") {
			global_monsterArray[loadedObject.index] = loadedObject;
		}
	}
	var old = document.getElementById("history");
	var console = document.getElementById("console");
	var input = document.getElementById("input");
	console.removeChild(old);
	var newHistory = document.createElement("div");
	newHistory.setAttribute("id", "history");
	console.insertBefore(newHistory, input);
	start();
}

function receiveText(e) {
	file = e.target.result;
	loadProject(file);
}

//load a local project/game/save
function loadLocalProjectFile() {
	// uploading the file through the FileReader api
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
		if(i == global_areaArray.length - 1) {
			if(global_monsterArray[0] != undefined) {
				outfile = outfile + "\r\n\r\n";
			}
		}
		else {
			outfile = outfile + "\r\n\r\n";
		}
		
	}
	for (i in global_monsterArray) {
		outfile = outfile + JSON.stringify(global_monsterArray[i]);
		if(i != global_monsterArray.length - 1) {
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
	element.remove();
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

// displays text to prompt
function display(text, title=false) {
	var history = document.getElementById("history");
	var node = document.createElement("p");
	if (title == true) {
		node.setAttribute("id", "title");
		text = "---" + text + "---";
	}
	var textNode = document.createTextNode(text);
	node.append(textNode);
	node.setAttribute("class", "history");
	history.append(node);
	updateScroll();
	return 0;
}


// Resets the prompt value and brings it into focus

function resetPrompt() {
	input = document.getElementById("input");
	input.value = ">";
	//input.focus();
}

//function sets the scroll of the console back to the bottom (where the input is)

function updateScroll() {
	var console = document.getElementById("console");
	console.scrollTop = console.scrollHeight - console.clientHeight;
	input.focus()
}


//Deal with input from prompt

function takeInput() {
	var input = document.getElementById("input"); //get input element
	display(input.value); // display contents of input >> should probably do this after filter
	dealInput(input.value); // deal with the input
	resetPrompt(); // clear the input
}


//deal with the input
function dealInput(input) {
	input = input.toUpperCase();
	input = input.replace(/>/g, "");	// remove all '>' characters
	console.log(input);
	input = input.split(" ");
	//console.log(global_currentArea.destinations[input[0]]);
	for (i=0;i<input.length;i++) {
		//console.log(input[i]);
		if(input[0] == "MOVE" || input[i] == "GO") {
			global_currentArea.move(input[i+1][0]);
			return 0;
		}
		//if (input[0]
		

	}
}


