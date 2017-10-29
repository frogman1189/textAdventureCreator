//Text Adventure Base Script
//note to self - add help command

//declare global variables
var global_currentArea = null;
var global_startArea = null;
var global_areaArray = [];
var global_itemArray = [];
var global_monsterArray = [];
var global_player;

//dictionary of commands for parsing of user input
var commandKey = {"NORTH":"N", "SOUTH":"S", "EAST":"E", "WEST":"W", "NORTHEAST":"NE", "NORTHWEST":"NW", "SOUTHEAST":"SE", "SOUTHWEST":"SW", "UP": "U", "DOWN":"D", "N":"N", "S":"S", "E":"E", "W":"W", "NE":"NE", "NW":"NW", "SE":"SE", "SW":"SW", "U":"U", "D":"D",
				"MOVE":"MOVE", "GO":"MOVE", "ATTACK":"KILL", "KILL":"KILL", "LOOK":"LOOK", "L":"LOOK", "PICKUP":"PICK", "PICK":"PICK", "TAKE":"PICK", "GRAB":"PICK", "DROP":"DROP", "I":"I", "INVENTORY":"I", "EXAMINE":"EXAMINE", "EAT":"EAT", "DRINK":"DRINK", "PUSH":"PUSH", "THROW":"THROW", "SMELL":"SMELL", "LISTEN":"LISTEN"};

// class used for creating events to be listened for
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

// used for scheduling events (like door unlocking after killing enemy [though lock isn't in this version, but the next so bad example.) Purely used as it is built into many functions, but doesn't actually do anything in this version. Needs to be fixed up for next version.
class EventHandler {
	constructor() {
		this.listeners = [];		// declare empty listener array.
	}
	report(event) {					//function report. if event is reported deal with it and execute appropriate action.
		for (var a = 0; a < this.listeners.length; a++) {		//cycle through the array of listeners
			if (this.listeners[a].listener == event[0]) {		//if a listener's event name thing is the same as the event passed then...
				var checking = true;							//set checking true and cycle through the conditions for event to trigger -- not entirely functioning I think when more than one condition thus the delay in release of event system
				for(var b = 0; b < this.listeners[a].conditions.length; b+=2) {
					if(this.listeners[a].conditions[b] != this.listeners[a].conditions[b+1]) { //if condition not met setting checking to false and break for loop
						checking = false;
						break;
					}
					
				}
				if(checking == true) {		//if checking is true check what event is scheduled to occur and execute it with given parameters
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
					if(this.listeners[a].tmp  < 2) { //if listener tmp < 2 (either supposed to be checked once or checked until executed then remove from listeners array
						this.listeners.splice(a, 1);
					}
					
				}
				else {		// if tmp = 0 (meaning supposed to be checked once before discarded) then remove listener from listerns array
					if(this.listeners[a].tmp == 0) {
						this.listeners.splice(a, 1);
					}
				checking = false;	//set checking to false -- probably unneccessary now I think of it, but I'm not going to mess with it while its working and about to be handed in.
				}
			}
		}
	}
	addListener(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, locIndex) { //function addListener. Addes an event object to listeners array taking the arguments of Event
		this.listeners.push(new Event(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, locIndex))
	}
}


//PLayer class - contains basic player variables and death function
class Player {
	constructor() {
		this.items = [];			// array of items [inventory]
		//this.itemsLength = 0;		//doesn't look like I need this but I'll leave it in here just in case for easy fix should errors crop up
		this.maxHp = 10;			//maximum player hp -- arbitrarily set to 10. Should make player editable in the next version
		this.hp = this.maxHp;		//current hp, in this case as being declared = max
		this.dp = 5;				// default damage points without weapon
	}
	dead() {						//function dead -- deals with dying
		eventHandler.report(["gameover"]);		//report to eventHandler in case you want to cause events to trigger on gameover -- useless until next version
		display("You have died\n\r\n\r\n\r");	//display death text
		global_currentArea = global_startArea;	//set current area to start area
		var input = document.getElementById("input");	//disable input
		input.disabled = true;
		setTimeout(start, 3000);				//wait three seconds before recalling start to set up environment variables and reenable input -- thinking about it this prevents the report of gameover from working. Will need to change start in next version to enable that functionality
	}
}

//function that deals with when time has passed -> kind of like dealing with major, minor and free actions in dnd, except there are only either free and major, this executing after major
function advanceTick() {
	if(global_currentArea.monsters[0]) {
		for (i in global_currentArea.monsters) { 								//cycle through monsters in current area
			if(global_currentArea.monsters[i].hp < 1) {							// if any have hp dropped below 1 then real with their death by removing it and displaying text, reporting to eventhandler -- say you wanted a room to open after death of monster -- for next version, and dropping of item
				eventHandler.report(["dead", global_currentArea.monsters[i].name]);
				display("The " + global_currentArea.monsters[i].name + " died");
				for (var a=0;a<global_currentArea.monsters[i].drop.length;a++) {
					global_currentArea.items.push(global_currentArea.monsters[i].drop[a]);
				}
				global_currentArea.monsters.splice(i, 1);
			}
			if(global_currentArea.monsters[i]) { //Used so that if a monster dies it doesn't throw up an error saying that it can't show the property of undefined
				display("There is a " + global_currentArea.monsters[i].name); //if monster not dead say that there is a monster there and have monster cause damage
				player.hp -= global_currentArea.monsters[i].dp;
			}
		}
	}
	if(player.hp < 1) { //if player hp drop below 1 then call player.dead to deal with circumstance -- this can be triggered by drinking things and being killed by monsters, etc
		player.dead();
		return 0;
	}
}

//Class Area, used to manage each area in the text adventure
class Area {
	// contruct area -- declare all variables
	constructor(name = "Untitled Area", description = "Blank Area", destinations = {}, items = {}, monsters = {}, startArea = false) {
		//declaring class vars
		this.class = "area"; //required for applying class prototype when loading json project files
		this.name = name;
		this.description = description;
		this.destinations = {};
		this.items = [];
		this.monsters = [];
		this.startArea = startArea;
		this.currentArea = false; //for loading saves. If this is true in json string then it gets set to current area during loading
		global_areaArray.push(this);		//add to global_areaArray
		this.index = global_areaArray.length - 1;		//set index to the index of place in global_areaArray
		if(startArea == true) {	//if start area = true then deal with the array stuff that must occur from that
			global_startArea = this;
			global_currentArea = this; //by default startArea is set to current area when first constructed, however saves will change this and this logic is not applied when loaded by json.
			this.currentArea = true;	// may be stored in player class later
		}
	}
	
	// add a destination link to area (Use the array index to specify directions) -- I suspect this is now irrelevant based upon my user interface input method, that said that means my method of adding user input is programmatically a horrible thing to do..... ooops! :/
	addDestination(direction, areaIndex, locked=false) {
		this.destinations[direction] = [areaIndex, locked];
	}
	look() {		//function look. displays name and description of current area, along with the items that area there and passageways to other areas
		display(global_currentArea.name, true);
		display(global_currentArea.description);
		if(global_currentArea.items.length > 0) {
			var itemString = "There is a ";
			for (var i = 0; i < global_currentArea.items.length; i++) {		//iterate over items
				if(i == (global_currentArea.items.length - 1)) {			//on last item end with fullstop
					itemString = itemString + global_currentArea.items[i].name + ".";
				}
				else {														//else end with comma space
					itemString = itemString + global_currentArea.items[i].name + ", ";
				}
			}
			display(itemString);											//display itemString to console element
		}
		var dest = Object.keys(global_currentArea.destinations);			//find keys to destinations so to find name of destinations as are stored as num -- in next version apply this to items as well to save space in save files
		if(dest.length > 0) {							// if there is destinations then...
			var destString = "There is passage to the ";		//say there is a passage to..
			dest = dest.sort();					//arbitrarily sorted them alphabetically, not really much point in it, but I wanted to sort it.
			for(i = 0; i < dest.length; i++) {					// iterate of destinations
				if(i == dest.length - 2) {						//on second to last one append with ' and ', and append the next value followed by '.' for better gramma 
					destString = destString + dest[i] + " and " + dest[i + 1] + ".";
					i = i + 1;				//increment i to end for loop and not  double up on passage displayed
				}
				else {
					destString = destString + dest[i] + ", ";		//otherwise just append text with ", ";
				}
			}
			display(destString);									//display passageway text to console.
			
		}
		advanceTick();												//call advance tick -- not really sure why I made looking a major action. May change that.
	}
	// move in direction, if that direction points to an area then set global_currentArea to that area.
	move(dir) {
		if (this.destinations[dir] != undefined && (this.destinations[dir][1] == false || this.destinations[dir][1] == undefined)) {
			if(this.destinations[dir][1] == undefined) {
				global_currentArea = global_areaArray[this.destinations[dir]];
			}
			else {
				global_currentArea = global_areaArray[this.destinations[dir][0]];
			}
			eventHandler.report(["move", "to", global_currentArea.name]);	//report moving for eventlistener in v2.0
			this.look();					//call look to see what the new area is like
		}
		else {
			display("You can't go that way");		//otherwise say you can't go that way.
		}
	}
}

//class monster. Basically just a data container for monster values
class Monster {
	constructor(name = "Untitled Monster", examine="It's unremarkable", hp = 10, dp = 1, sp = 1) {
		this.class = "monster";
		this.name = name;
		this.examine = examine;
		this.hp = hp;
		this.dp = dp;
		this.sp = sp;
		this.drop = [];
		global_monsterArray.push(this);
		this.index = global_monsterArray.length - 1;
	}
}

//class item. Basically just data container for item values.
class Item {
	constructor(name = "Untitled Item",
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



//attach javascript event listener [as opposed to my custom event listeners] to the input checking whether [ENTER] is pressed, and if so preventing default, otherwise you get weird data, and calling takeInput which deals with it. Also sets up panning, eventlisteners, which probably should be in graphics.js, but I kind of don't care, and it seemed like a good idea at the time.
function setInputListener() {
	document.getElementById('input').addEventListener('keydown', function (e) {
		
		var key = e.which || e.keyCode; 			//on keydown find key value
		if (key == 13) { 							//if value == 13
			e.preventDefault();						// prevent default of creating a new line
			takeInput();							// and call take input to deal with input.
			
		} 
	});
	pan = document.getElementById("pan");				//grab pan and content
	content = document.getElementById("content");
	


	content.addEventListener("mousedown", startDrag);		//add pan listener -- it says mouse down but that triggers the pan stuff. It does make sense.
	window.addEventListener("resize", resizeCanvas);		//when window resized call resizeCanvas which sets canvas to correct size again.
	resizeCanvas();
	canvas = document.getElementById("canvas");				//set up canvas drawing context
	context = canvas.getContext("2d");
}

function resizeCanvas() {c = document.getElementById("canvas"); c.width = window.innerWidth; c.height= window.innerHeight;}		//resizing canvas function. Its really simple.


// displays text to prompt
function display(text, title=false) {
	var history = document.getElementById("history");		//grab element history which contains previous commands and responses
	var node = document.createElement("p");					//create p element
	if (title == true) {									//if isa title format is with interesting text and give id title
		node.setAttribute("id", "title");
		text = "---" + text + "---";
	}
	var textNode = document.createTextNode(text);			//create text node with text var.
	node.append(textNode);
	node.setAttribute("class", "history");
	history.append(node);								//append new element to history
	updateScroll();										// call update scroll. (sets scroll to bottom)
	return 0;
}


// Resets the prompt value

function resetPrompt() {
	input = document.getElementById("input");
	input.value = ">";
}

//function sets the scroll of the console back to the bottom (where the input is) and sets input to focus (so your cursor is there and you can just type

function updateScroll() {
	var console = document.getElementById("console");
	console.scrollTop = console.scrollHeight - console.clientHeight;
	input.focus()
}


//Deal with input from prompt

function takeInput() {
	var input = document.getElementById("input"); //get input element
	display(input.value); // display contents of input >> should probably do this after filter for security.
	dealInput(input.value); // deal with the input
	resetPrompt(); // clear the input
}


//deal with the input
function dealInput(input) {
	input = input.toUpperCase();		//set everything to uppercase so that you get no caseing problems
	input = input.replace(/>/g, "");	// remove all '>' characters
	input = input.split(" ");			//split input by the space character
	input[0] = commandKey[input[0]];	//parse input through commandkey dictionary of commands
	console.log(input[0]);
	var i = 0;							//set i to zero. The massive switch statement could have been done just as well with if statements. Probably should have used if.
	switch(input[i]) {
		default:		//on default move in direction given by input[i]
			eventHandler.report(["move", "from", global_currentArea.name]);	//report to eventhandler -- nothing till v2.0
			global_currentArea.move(input[i]);			//actually calling it.
			resetPrompt();
			break;
		
		case undefined:				//if undefined then say, "I don't know what that is."
			display("I don't know what that is");
			resetPrompt();
			break;
		
		case "MOVE":				//if input[0] == "move" then report this and move to the area using the key which is the next thing in array of input.
			eventHandler.report(["move", "from", global_currentArea.name]);
			global_currentArea.move(commandKey[input[i+1]]);
			resetPrompt();
			break;
			
		case "KILL":		//if input[0] == kill
			if(input.length < 3) {			//if input is less than three recognise they have not specified weapon -- really should make hand default weapon. For the next version I suppose.
				display("Attack it with what?");
			}
			for(var a=0; a < global_currentArea.monsters.length; a++) {	//otherwise iterate through current monsters.
				if(global_currentArea.monsters[a].name.toUpperCase() == input[i+1]) {		//if input[2] == with then increment i (enables me to uses the same code whether with was used or not.
					if(input[i+2] == "WITH") {
						i = i + 1;
					}
					//iterate through player items to see whether the provided weapon  is in the inventory, and if so attack the monster it and display your damage. Also report event to event handler -- at this point I'm sick of saying how doesn't do anything till v2 that I'm just going to write ehv2 to mean that! -- and advance a tick.
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
			resetPrompt();
			break;
			
		case "LOOK":		//if = look then call look and report to ehv2
			global_currentArea.look();
			eventHandler.report(["look", global_currentArea.name]);
			resetPrompt();
			break;
		
		case "PICK":		//deal with pick in all its different ways of being written in much the same way as kill was dealt with.
			if(input[i+1] == "UP"){
				i = i + 1;
			}
			if(input[i+1] == "ALL") {	//in case of all just add everything to inventory
				for(var a=0; a < global_currentArea.items.length; a++) {
					if(global_currentArea.items[a].pickable == true) {
						display("You take the " + global_currentArea.items[a].name);
						player.items.push(global_currentArea.items[a]);
						eventHandler.report(["pick", global_currentArea.items[a].name]);
					}
				}
				global_currentArea.items = [];
			}
			for(var a=0; a < global_currentArea.items.length; a++) {		//otherwise only the one that matched the provided name.
				if(input[i+1] == global_currentArea.items[a].name.toUpperCase() && global_currentArea.items[a].pickable == true) {
					display("You take the " + global_currentArea.items[a].name);
					player.items.push(global_currentArea.items[a]);
					eventHandler.report(["pick", global_currentArea.items[a].name]);
					global_currentArea.items.splice(a, 1);
				}
			}
			resetPrompt();
			advanceTick();		//then advance a tick.
			break;
		
		case "DROP":	//if drop look through inventory to find which one matches and remove from inventory and push to current area items. ehv2
			for(var a=0; a < player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase()) {
					global_currentArea.items.push(player.items[a]);
					display("You drop the " + player.items[a].name);
					eventHandler.report(["drop", player.items[a].name]);
					player.items.splice(a,1);
				}
			}
			advanceTick();		//advance a tick
			resetPrompt();
			break;
		
		case "I":		//I being inventory, commandkey turns both into I thus only need to deal with once. go through player.items and display all the names. ehv2
			for(var a=0;a < player.items.length;a++) {
				display(player.items[a].name);
				eventHandler.report(["inventory"])
			}
			resetPrompt();
			break;
		
		case "EXAMINE":		//check through held items, items in area, and monsters. If name matches that of one then display its examine var
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
			resetPrompt();
			break;
		
		case "SMELL":		//check through held items, items in area, and monsters. If name matches that of one then display its smell var
			for(var a=0; a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase()) {
					display("You smell the " + player.items[a].name);
					display(player.items[a].smell);
					eventHandler.report(["smell", player.items[a].name]);
				}
			}
			for(var a=0; a<global_currentArea.items.length;a++) {
				if(input[i+1] == global_currentArea.items[a].name.toUpperCase()) {
					display("You smell the " + global_currentArea.items[a].name);
					display(global_currentArea.items[a].smell);
					eventHandler.report(["smell", global_currentArea.items[a].name]);
				}
			}
			for(var a=0; a<global_currentArea.monsters.length;a++) {
				if(input[i+1] == global_currentArea.monsters[a].name.toUpperCase()) {
					display("You smell the " + global_currentArea.monsters[a].name);
					display(global_currentArea.monsters[a].smell);
					eventHandler.report(["smell", global_currentArea.monsters[a].name]);
				}
			}
			resetPrompt();
			break;
		
		case "LISTEN":		//check through held items, items in area, and monsters. If name matches that of one then display its examine var
			if(input[1] == "TO") {
				i = i + 1;
			}
			for(var a=0; a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase()) {
					display("You listen to the " + player.items[a].name);
					display(player.items[a].listen);
					eventHandler.report(["listen", player.items[a].name]);
				}
			}
			for(var a=0; a<global_currentArea.items.length;a++) {
				if(input[i+1] == global_currentArea.items[a].name.toUpperCase()) {
					display("You listen to the " + global_currentArea.items[a].name);
					display(global_currentArea.items[a].listen);
					eventHandler.report(["listen", global_currentArea.items[a].name]);
				}
			}
			for(var a=0; a<global_currentArea.monsters.length;a++) {
				if(input[i+1] == global_currentArea.monsters[a].name.toUpperCase()) {
					display("You listen to the " + global_currentArea.monsters[a].name);
					display(global_currentArea.monsters[a].listen);
					eventHandler.report(["listen", global_currentArea.monsters[a].name]);
				}
			}
			resetPrompt();
			break;
			
		case "EAT":			//check whether item is in inventory. if it is then eat it. add its health to your health, and if above hpmax set to hp max, calculating the amount it restores (which took me an unfortunatly long amount of time to actually figure out)
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
					player.items.splice(a, 1);	//remove from array.
					
				}
			}
			resetPrompt();
			advanceTick();		//advance a tick.
			break;
		
		case "DRINK":		//basically the same as eat, except instead of checking whether it can eaten, check whether can be drunk/quaffed
			for(var a=0;a<player.items.length;a++) {
				if(input[i+1] == player.items[a].name.toUpperCase() && player.items[a].drinkable == true) {
					display("You drink the " + player.items[a].name);
					if(player.hp + player.items[a].heal > player.maxHp) {
						display("It restores " + (player.items[a].heal - (player.hp + player.items[a].heal - player.maxHp)) + " health");
						player.hp = player.maxHp;
						console.log(1);
						
					}
					else {
						display("It restores " + (player.items[a].heal) + " health");
						player.hp = player.hp + player.items[a].heal;
					}
					eventHandler.report(["drink", player.items[a].name]);
					player.items.splice(a, 1);
					
				}
			}
			resetPrompt();
			advanceTick();
			break;
		
		case "THROW":		//check whether 'at' is included in command. increment i in that case. check whether the name of what you are throwing at is monster or item, and if exists throw at it.
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
			resetPrompt();
			advanceTick();		//advance a tick
			break;
		
		
	}
	return 0;		//return 0... because why not. Doesn't really need it, but I got to the point where I felt like returning 0 at the end of each function/function exit - somewhat reminescent of c
}

