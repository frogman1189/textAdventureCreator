//Text Adventure Base Script
//add help command
var loadedFile;
var global_currentArea = null;
var global_startArea = null;
var global_areaArray = [];
global_itemArray = [];
global_monsterArray = [];
var global_player;

commandKey = {"NORTH":"N", "SOUTH":"S", "EAST":"E", "WEST":"W", "NORTHEAST":"NE", "NORTHWEST":"NW", "SOUTHEAST":"SE", "SOUTHWEST":"SW", "UP": "U", "DOWN":"D", "N":"N", "S":"S", "E":"E", "W":"W", "NE":"NE", "NW":"NW", "SE":"SE", "SW":"SW", "U":"U", "D":"D",
				"MOVE":"MOVE", "GO":"MOVE", "ATTACK":"KILL", "KILL":"KILL", "LOOK":"LOOK", "L":"LOOK", "PICKUP":"PICK", "PICK":"PICK", "TAKE":"PICK", "GRAB":"PICK", "DROP":"DROP", "I":"I", "INVENTORY":"I", "EXAMINE":"EXAMINE", "EAT":"EAT", "DRINK":"DRINK", "PUSH":"PUSH", "THROW":"THROW"};

class Event {
	constructor(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, /*0 = once, 1 = until completed, 2 = always*/ locIndex) {
		this.type = eventType;
		this.listener = eventToListenFor;
		this.conditions = arrayOfConditions;
		this.addedIndex = addedIndex;
		this.locIndex = locIndex;
		this.tmp = tmp;
	}
}

class EventHandler {
	constructor() {
		this.listeners = [];
	}
	report(event) {
		for (var a = 0; a < this.listeners.length; a++) {
			if (this.listeners[a].listener == event[0]) {
				var checking = true;
				for(var b = 0; b < this.listeners[a].conditions.length; b+=2) {
					if(this.listeners[a].conditions[b] != this.listeners[a].conditions[b+1]) {
						checking = false;
						break;
					}
					
				}
				if(checking == true) {
					if(this.listeners[a].type == "area_additem") {
						global_areaArray[this.listeners[a].locIndex].items.push(global_itemArray[this.listeners[a].addedIndex]);
					}
					if(this.listeners[a].type == "area_addMonster") {
						global_areaArray[this.listeners[a].locIndex].items.push(global_monsterArray[this.listeners[a].addedIndex]);
					}
					if(this.listeners[a].type == "area_unlock") {
						global_areaArray[this.listeners[a].locIndex].directions[this.listeners[a].addedIndex][2] = false;
					}
					if(this.listeners[a].type == "area_lock") {
						global_areaArray[this.listeners[a].locIndex].directions[this.listeners[a].addedIndex][2] = true;
					}
					
					if(this.listeners[a].type == "player_addItem") {
						player.items.push(global_itemArray[this.listeners[a].addedIndex]);
					}
					//not quite sure why this is here, may have been another type I wanted to add, or maybe overzealous copy and pasting
					/*if(this.listeners[a].type == "player_addItem") {
						player.items.push(global_itemArray[this.listeners[a].addedIndex]);
					}*/
					
					if(this.listeners[a].tmp  < 2) {
						this.listeners.splice(a, 1);
					}
					
				}
				else {
					if(this.listeners[a].tmp == 0) {
						this.listeners.splice(a, 1);
					}
				checking = false;
				}
			}
		}
	}
	addListener(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, locIndex) {
		this.listeners.push(new Event(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, locIndex))
	}
}



class Player {
	constructor() {
		//this.room = global_currentArea; // rubbish, taken care of by global_currentArea
		this.items = [];
		//this.itemsLength = 0;
		this.maxHp = 10;
		this.hp = this.maxHp;
		this.dp = 5;
	}
	dead() {
		eventHandler.report(["gameover"]);
		display("You have died\n\r\n\r\n\r");
		global_currentArea = global_startArea;
		var input = document.getElementById("input");
		input.disabled = true;
		setTimeout(start, 3000);
	}
}

function advanceTick() {
	if(global_currentArea.monsters[0]) {
		for (i in global_currentArea.monsters) {
			if(global_currentArea.monsters[i].hp < 0) {
				eventHandler.report(["dead", global_currentArea.monsters[i].name]);
				display("The " + global_currentArea.monsters[i].name + " died");
				global_currentArea.monsters.splice(i, 1);
			}
			if(global_currentArea.monsters[i]) { //Used so that if a monster dies it doesn't throw up an error saying that it can't show the property of undefined
				display("There is a " + global_currentArea.monsters[i].name);
				player.hp -= global_currentArea.monsters[i].dp;
			}
		}
	}
	if(player.hp < 1) {
		player.dead();
		return 0;
	}
}

//Class Area, used to manage each area in the text adventure
class Area {
	// contruct area -- declare all variables
	constructor(name = "New Area", description = "Blank Area", destinations = {}, items = {}, monsters = {}, startArea = false) {
		this.class = "area"; //required for applying class prototype when loading json project files
		this.name = name;
		this.description = description;
		this.destinations = {};
		this.items = [];
		this.monsters = [];
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
	look() {
		display(global_currentArea.name, true);
		display(global_currentArea.description);
		if(global_currentArea.items.length > 0) {
			var itemString = "There is a ";
			for (var i = 0; i < global_currentArea.items.length; i++) {
				if(i == (global_currentArea.items.length - 1)) {
					itemString = itemString + global_currentArea.items[i].name + ".";
				}
				else {
					itemString = itemString + global_currentArea.items[i].name + ", ";
				}
			}
			display(itemString);
		}
		var dest = Object.keys(global_currentArea.destinations);
		if(dest.length > 0) {
			var destString = "There is passage to the ";
			dest = dest.sort();
			for(i = 0; i < dest.length; i++) {
				if(i == dest.length - 2) {
					destString = destString + dest[i] + " and " + dest[i + 1];
					i = i + 1;
				}
				else {
					destString = destString + dest[i] + ", ";
				}
			}
			display(destString);
			
		}
		advanceTick();
	}
	// move in direction, if that direction points to an area then set global_currentArea to that area.
	move(dir) {
		//console.log(this.destinations[dir]);
		if (this.destinations[dir] != undefined && this.destinations[dir][1] == false) {
			global_currentArea = global_areaArray[this.destinations[dir][0]];
			eventHandler.report(["move", "to", global_currentArea.name]);
			this.look();
			//console.log(global_currentArea.description);
		}
		else {
			display("You can't go that way");
		}
	}
}


class Monster {
	constructor(name = "New_Monster", examine="It's unremarkable", hp = 10, dp = 1, sp = 1) {
		this.class = "monster";
		this.name = name;
		this.examine = examine;
		this.hp = hp;
		this.dp = dp;
		this.sp = sp;
		this.drop = [];
		this.index = global_areaArray.length - 1;
		global_monsterArray.push(this);
	}
}
class Item {
	constructor(name = "Unamed_Item",
				smell = "It has no smell",
				listen = "It makes no noise",
				examine = "There is nothing special about it", 
				moveable = false,
				moveMessage = "",
				edible = false,
				drinkable = false,
				heal = 0,
				pickable = false,
				dp = 0) {
		//attributes
		this.class = "item";
		this.name = name;
		this.smell = smell;
		this.listen = listen;
		this.examine = examine;
		this.movable = moveable;
		this.moveMessage = moveMessage;
		this.edible = edible;
		this.drinkable = drinkable;
		this.heal = heal;
		this.pickable = pickable;
		this.dp = dp;
		this.index = global_itemArray.length;
		global_itemArray.push(this);
		
	}
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
	input[0] = commandKey[input[0]];
	var i = 0;
	switch(input[i]) {
		default:
			eventHandler.report(["move", "from", global_currentArea.name]);
			global_currentArea.move(input[i]);
			break;
		
		case undefined:
			display("I don't know what that is");
			break;
		
		case "MOVE":
			eventHandler.report(["move", "from", global_currentArea.name]);
			global_currentArea.move(commandKey[input[i+1]]);
			break;
			
		case "KILL":
			if(input.length < 3) {
				display("Attack it with what?");
			}
			for(var a=0; a < global_currentArea.monsters.length; a++) {
				if(global_currentArea.monsters[a].name.toUpperCase() == input[i+1]) {
					if(input[i+2] == "WITH") {
						i = i + 1;
					}
					
					for(var b=0;b < player.items.length; b++) {
						if(input[i+2] == player.items[b].name.toUpperCase()) {
							global_currentArea.monsters[a].hp -= player.items[b].dp;
							display("You did " + player.items[b].dp + " damge");
							eventHandler.report(["attack", global_currentArea.monsters[a].name]);
							advanceTick();
						}
					}
				}
			}
			break;
			
		case "LOOK":
			global_currentArea.look();
			eventHandler.report(["look", global_currentArea.name]);
			break;
		
		case "PICK":
			if(input[i+1] == "UP"){
				i = i + 1;
			}
			if(input[i+1] == "ALL") {
				for(var a=0; a < global_currentArea.items.length; a++) {
					if(global_currentArea.items[a].pickable == true) {
						display("You take the " + global_currentArea.items[a].name);
						player.items.push(global_currentArea.items[a]);
						eventHandler.report(["pick", global_currentArea.items[a].name]);
					}
				}
				global_currentArea.items = [];
			}
			for(var a=0; a < global_currentArea.items.length; a++) {
				if(input[i+1] == global_currentArea.items[a].name.toUpperCase() && global_currentArea.items[a].pickable == true) {
					display("You take the " + global_currentArea.items[a].name);
					player.items.push(global_currentArea.items[a]);
					eventHandler.report(["pick", global_currentArea.items[a].name]);
					global_currentArea.items.splice(a, 1);
				}
			}
			advanceTick();
			break;
		
		case "DROP":
			for(var a=0; a < player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase()) {
					global_currentArea.items.push(player.items[a]);
					display("You drop the " + player.items[a].name);
					eventHandler.report(["drop", player.items[a].name]);
					player.items.splice(a,1);
				}
			}
			advanceTick();
			break;
		
		case "I":
			for(var a=0;a < player.items.length;a++) {
				display(player.items[a].name);
				eventHandler.report(["inventory"])
			}
			break;
		
		case "EXAMINE":
			for(var a=0; a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase()) {
					display("You examine the " + player.items[a].name);
					display(player.items[a].examine);
					eventHandler.report(["examine", player.items[a].name]);
				}
			}
			for(var a=0; a<global_currentArea.items.length;a++) {
				if(input[i+1] == global_currentArea.items[a].name.toUpperCase()) {
					display("You examine the " + global_currentArea.items[a].name);
					display(global_currentArea.items[a].examine);
					eventHandler.report(["examine", global_currentArea.items[a].name]);
				}
			}
			for(var a=0; a<global_currentArea.monsters.length;a++) {
				if(input[i+1] == global_currentArea.monsters[a].name.toUpperCase()) {
					display("You examine the " + global_currentArea.monsters[a].name);
					display(global_currentArea.monsters[a].examine);
					eventHandler.report(["examine", global_currentArea.monsters[a].name]);
				}
			}
			break;
			
		case "EAT":
			for(var a=0;a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase() && player.items[a].edible == true) {
					display("You eat the " + player.items[a].name);
					if(player.hp + player.items[a].heal > player.maxHp) {
						display("It restores " + (player.items[a].heal - (player.hp + player.items[a].heal - player.maxHp)) + " health");
						player.hp = player.maxHp;
						
					}
					else {
						display("It restores " + player.hp + player.items[a].heal + " health");
						player.hp = player.hp + player.items[a].heal;
					}
					eventHandler.report(["eat", player.items[a].name]);
					player.items.splice(a, 1);
					
				}
			}
			advanceTick();
			break;
		
		case "DRINK":
			for(var a=0;a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase() && player.items[a].drinkable == true) {
					display("You drink the " + player.items[a].name);
					if(player.hp + player.items[a].heal > player.maxHp) {
						display("It restores " + (player.items[a].heal - (player.hp + player.items[a].heal - player.maxHp)) + " health");
						player.hp = player.maxHp;
						console.log(1);
						
					}
					else {
						console.log(2);
						display("It restores " + (player.items[a].heal) + " health");
						player.hp = player.hp + player.items[a].heal;
					}
					eventHandler.report(["drink", player.items[a].name]);
					player.items.splice(a, 1);
					
				}
			}
			advanceTick();
			break;
		
		case "THROW":
			for(var a=0; a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase()) {
					if(input[i+2].toUpperCase() == "AT") {
						i = i + 1;
					}
					for(var b=0;b<global_currentArea.items.length;b++) {
						if(input[i+2] == global_currentArea.items[b].name.toUpperCase()) {
							display("You throw the " + player.items[a].name + " at the " + global_currentArea.items[b].name);
							eventHandler.report(["throw", player.items[a].name, global_currentArea.items[b].name]);
							global_currentArea.items.push(player.items[a]);
							player.items.splice(a, 1);
							
						}
					}
					for(var b=0;b<global_currentArea.monsters.length;b++) {
						if(input[i+2] == global_currentArea.monsters[b].name.toUpperCase()) {
							display("You throw the " + player.items[a].name + " at the " + global_currentArea.monsters[b].name);
							global_currentArea.monsters[b].hp = global_currentArea.monsters[b].hp - player.items[a].dp;
							display("It does " + player.items[a].dp + " damage");
							global_currentArea.items.push(player.items[a]);
							player.items.splice(a, 1);
							
						}
					}
					
				}
			}
			advanceTick();
			break;
		
		
	}
	return 0;
}


