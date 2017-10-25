//Graphical Interface Script

//declare global variables
var loadedFile;
var overArea = false;
var global_areaArray = [];
var global_areaArray = [];
var global_areaArray = [];
//var zoom=1;				deprecated. May be reintegrated in the next version.

// draws the destination links between graphical area representations.
function drawMap() {															//
	context.clearRect(0,0,window.innerWidth, window.innerHeight);				// clear the canvas so that links don't build up.
	for(var i=0;i<global_areaArray.length;i++) {								// loop through areas
		var area = document.getElementById(i);									// grab area display button with current id [i]
		try {																	// encapsulated in a try statement as Object.keys errors if there are no keys
			var keys = Object.keys(global_areaArray[i].destinations);			// grab keys of destinations
			for(var j=0;j<keys.length;j++) {									// loop through keys
				var destId;														// grab the destination area id, uses if statement as there are two formats of save files (the one where it can be locked [which is incomplete functionality, though I would consider fleshing out properly for the next version] and the one that doesn't have the locked variable)
				if((x = global_areaArray[i].destinations[keys[j]][0]) != undefined) {
					destId = x;													// the locked format
				}
				else {
					destId = global_areaArray[i].destinations[keys[j]];			// the unlocked version
				}
				// originally had code to prevent redrawing of lines, though realised that it will probably remove lines which are shared between areas. Will consider rewriting it for the next version.
				var pan = document.getElementById("pan");						// grab pan 
				var dest = document.getElementById(destId);						// grab element which id corresponds to destId
				context.beginPath();											//begin path for mindmap join. Uses offset from area/dest and pan so that canvas draws it as if from the view of the content viewport -- required as canvas doesn't move, which is good, because otherwise it'd have to constantly resize and that would be horrible.
				context.moveTo(area.offsetLeft + pan.offsetLeft + 10, area.offsetTop + pan.offsetTop + 10);
				context.lineTo(dest.offsetLeft + pan.offsetLeft + 10, dest.offsetTop + pan.offsetTop + 10);
				context.stroke();
			}
		}
		catch (err) {};															// try statement didn't run without the catch, so seems like required syntax
	}
}


// startDrag stolen from https://jsfiddle.net/sf3edmx0/1/
// modified to do panning inside the element rather than panning the element itself, and also to do nested panning.
function startDrag (e)
{
	var startX = e.clientX;														// starting X position of mouse when it started dragging
	var startY = e.clientY;														// starting Y position of mouse when it started dragging
	var element;
	if(overArea === false) {													// if not over an areas graphical representation then move 'pan'
		element = document.getElementById("pan");
	}
	else {																		// else grab the graphical representation of area
		element = document.getElementById(overArea);
	}
	var offsetX = element.offsetLeft;											// grab element X offset from content
	var offsetY = element.offsetTop;											// grab element Y offset from content
	this.onmousemove = function (e2){										// set function for mouse move event which will actually move element
		var newX = e2.clientX-startX;										// find the change in X position from new mouse position and original
		var newY = e2.clientY-startY;										// find the change in Y position from new mouse position and original
		var calcX = offsetX + newX;											// Calculate position on page from new change in mouse and offest
		var calcY = offsetY + newY;											//
		
		element.style.left = calcX + 'px';									// set element's x position
		element.style.top = calcY + 'px';									// set element's y position
		drawMap();															// redraw the area dest links
	}  
	this.onmouseup = function ()											//when you release the mouse remove the event listener for mouse moving so that the element doesn't constantly follow your mouse.
	{
		this.onmouseup = "";
		this.onmousemove = "";
	}
}
//end of copying


// deprecated -- possibly be reintegrated in the next version
/*
function zoomIn(e) {
	zoom = zoom + 0.5;			
	if(zoom < 1 && zoom > -1) {										//used to help prevent repeated zoom frames from equal fraction stuff (i.e 1/0.5 == 2 and so the 2 times zoom has the potential to be repeated at -0.5 and 2
		zoom = 1;
	}
	if(Math.sign(zoom) == -1) {
		$(".area").animate({"zoom": 1/Math.abs(zoom)}, 0);		//if negative use fractional zoom out
	}
	else {
		$(".area").animate({"zoom": zoom}, 0);
	}
	return 0;
}
function zoomOut(e) {
	zoom = zoom - 0.5;
	if(zoom < 1 && zoom > -1) {										//used to help prevent repeated zoom frames from equal fraction stuff (i.e 1/0.5 == 2 and so the 2 times zoom has the potential to be repeated at -0.5 and 2
		zoom = -1;
	}
	console.log(zoom);
	if(Math.sign(zoom) == -1) {
		$(".window").animate({"zoom": 1/Math.abs(zoom)}, 0);		//if negative use fractional zoom out
	}
	else {
		$(".window").animate({"zoom": zoom}, 0);
	}
	return 0;
}
*/


// saves the values from the area input panel into the area data type
function saveArea() {
	var area = global_areaArray[document.getElementById("area").value];			// grab index of area currently being edited and parse into global_area array to grab area data type.
	area.name = document.getElementById("area-name").value;						//set values from document
	area.description = document.getElementById("area-description").value;
	area.startArea = document.getElementById("area-startArea").checked;
	area.currentArea = document.getElementById("area-startArea").checked;		//used so that startarea = currentarea and will load game. not used for saves, would muck those up.
	if(area.currentArea == true) {												// if current area then set global_currentArea to area
		global_currentArea = area;
	}
	loadAreaPanel(area.index);													// reload area panel so that changes are applied to the various graphical areas that need to be modified.
}


//basically the same thing as saveArea but for items
function saveItem() {
	var item = global_itemArray[document.getElementById("item").value];
	item.name = document.getElementById("item-name").value;
	item.moveable = document.getElementById("moveable").checked;
	item.pickable = document.getElementById("pickable").checked;
	item.edible = document.getElementById("edible").checked;
	item.drinkable = document.getElementById("drinkable").checked;
	item.examine = document.getElementById("item-examine").value;
	item.smell = document.getElementById("item-smell").value;
	item.listen = document.getElementById("item-listen").value;
	item.moveMessage = document.getElementById("item-movemsg").value;
	item.heal = parseInt(document.getElementById("item-heal").value);
	item.dp = parseInt(document.getElementById("item-dp").value);
	loadItemPanel(item.index);
}

//basically the same thing as saveArea but for monsters
function saveMonster() {
	var monster = global_monsterArray[document.getElementById("monster").value];
	area.name = document.getElementById("monster-name").value;
	area.description = document.getElementById("monster-examine").value;
	area.startArea = document.getElementById("monster-hp").value;
	area.currentArea = document.getElementById("monster-dp").value;
	loadMonsterPanel(monster.index);
}


//deals with adding destinations through graphical port. uses parseInt as the underlying code requires integer rather than string.
function areaAddDest() {
	global_areaArray[document.getElementById("area").value].destinations[document.getElementById("area-dest-dir").value.toUpperCase()] = parseInt(document.getElementById("area-dest-select").value);
	loadAreaPanel(document.getElementById("area").value);		// calls to display the areas 
}

//deletes dest from area and reloads area panel
function areaRemoveDest() {
	delete global_areaArray[document.getElementById("area").value].destinations[document.getElementById("area-dest-dir").value.toUpperCase()];
	loadAreaPanel(document.getElementById("area").value);
}

//same as dest add but for items
function areaAddItem() {
	global_areaArray[document.getElementById("area").value].items.push(global_itemArray[document.getElementById("area-item-select").value]);
	loadAreaPanel(document.getElementById("area").value);
}
//same as dest remove but for items
function areaRemoveItem() {
	global_areaArray[document.getElementById("area").value].items.splice(parseInt(document.getElementById("area-item-select").value), 1);
	loadAreaPanel(document.getElementById("area").value);
}
//same as area add item but for monsters
function monsterAddItem() {
	global_monsterArray[document.getElementById("monster").value].drop.push(global_itemArray[document.getElementById("monster-item-select").value]);
	loadMonsterPanel(document.getElementById("monster").value);
}
//same as area remove item but for monsters
function monsterRemoveItem() {
	global_monsterArray[document.getElementById("monster").value].drop.splice(parseInt(document.getElementById("area-item-select").value), 1);
	loadMonsterPanel(document.getElementById("area").value);
}



//fairly sure not used, but keeping it just in case.
//remakes the select element for areas which is used for selecting destinations
/*function reloadAreaDataList() {
	alert("hi");
	var areaDataList = document.createElement("select"); //declare select element
	areaDataList.setAttribute("id", "areaDataList");
	for(var i=0;i<global_areaArray;i++) {				//iterate through areas adding them as options with index as value as that is used in game code, and name as seen value as that is how users differentiate between areas.
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.append(document.createTextNode(global_areaArray[i].name));
		areaDataList.append(option);
	}
	return areaDataList;
}

//remakes the select element for items which is used for selecting items for monster drops or present in areas
function reloadItemDataList() {
	alert("bye");
	var itemDataList = document.createElement("select");
	itemDataList.setAttribute("id", "itemDataList");
	for(var i=0;i<global_itemArray;i++) {				//iterate through areas adding them as options with index as value as that is used in game code, and name as seen value as that is how users differentiate between areas.
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.append(document.createTextNode(global_itemArray[i].name));
		itemDataList.append(option);
	}
	return itemDataList;
}


//remakes the select element for monsters which is used for selecting monsters to be present in areas
function reloadMonsterDataList() {
	alert("oh, my");
	var monsterDataList = document.createElement("select");
	monsterDataList.setAttribute("id", "monsterDataList");
	for(var i=0;i<global_monsterArray;i++) {				//iterate through areas adding them as options with index as value as that is used in game code, and name as seen value as that is how users differentiate between areas.
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.append(document.createTextNode(global_monsterArray[i].name));
		monsterDataList.append(option);
	}
	return monsterDataList;
}*/


//Load area into edit panel
function loadAreaPanel(index) {
	var area;
	if(index == -1) {											//if the index equals -1 create a new Area (the new area option has a value of -1)
		index = global_areaArray.length;						//grab length before pushing new area to save a math operation
		new Area();												//initialize a new area object
		loadDests();											//reload destination drop down to include the new area
		var pan = document.getElementById("pan");				//grab element of id pan to use offset in placement of new graphical area representation
		document.getElementById("area").value = index;			//index for id of area rep
		var element = document.createElement("button");			//create area
		element.setAttribute("id", index);
		element.setAttribute("class", "area");
		element.style.left = -pan.offsetLeft + 100;				//place area at an offset of 100 from left of viewport
		element.style.top = -pan.offsetTop + 100;				// place area at an offset of 100 from top of viewport
		element.addEventListener("mouseenter", function () {overArea=this.id;console.log(this.id);})		//add panning code listeners -- used to distinguish between panning 'pan' and the area rep
		element.addEventListener("mouseleave", function () {overArea=false;})
		element.innerText = global_areaArray[index].name;		// apply name
		document.getElementById("pan").append(element);			//add.
	}
	else {														//otherwise loaddests -- in else as needs to be loaded no matter the index and prevents double loading.
		loadDests();
	}
	if(index % 1 != 0) {										//as there is an option for index to equal null -- or be undefined when loading for some reason -- check whether or not is a number through modulus 1 then deal with that by setting area var which is used in the rest of load panel to object with all attributes blanked
		area = {'name':"", 'description':'', 'destinations':{}, 'items':[], 'monsters':[], 'startArea':false};
	}
	else {														//otherwise set area to the specified area from global_areaArray
		area = global_areaArray[index];
		if(area == undefined) {
			document.getElementById(index).innerText = area.name;	//update text of area rep in here because otherwise it throws up an error trying to get element with id 'null' which doesn't exist
		}
	}
	document.getElementById("area-name").value = area.name;		//set the edit-panel name input to the area name
	document.getElementById("area-description").value = area.description;		//set the edit-panel description to the area description
	
	
	var destText = document.getElementById("area-destinations-text");			//grab destinations space in area in prepartion to load with destinations
	destText.innerText = "";									//first clear inner text
	var keys = Object.keys(area.destinations);					//then grab keys and iterate over, adding each name linked from key to innerText
	for(var i=0;i<keys.length;i++) {
																//test whether array gives single value or array (backwards/forwards compatibility with deprecated for now lock functionality)
		if(global_areaArray[area.destinations[keys[i]]] != undefined) {
			destText.innerText = destText.innerText + "|" + keys[i] + ":" + global_areaArray[area.destinations[keys[i]]].name;
		}
		else {
			destText.innerText = destText.innerText + "|" + keys[i] + ":" + global_areaArray[area.destinations[keys[i]][0]].name;
		}
	}
	if(keys.length > 0) {
		destText.innerText = destText.innerText + "|";			//Close off | seperators when there are actually destinations
	}
	
	var itemText = document.getElementById("area-items-text");	//Same as destinations except for items
	itemText.innerText = "";
	for(var i=0;i<area.items.length;i++) {
		itemText.innerText = itemText.innerText + "|" + area.items[i].name;
	}
	if(area.items.length > 0) {
		itemText = itemText + "|";
	}
	
	var monsterText = document.getElementById("area-monsters-text").innerText="";	//Same as destinations except for monsters
	for(var i=0;i<area.monsters.length;i++) {
		monsterText = monsterText + "|" + area.monsters[i].name;
	}
	if(area.monsters.length > 0) {
		monsterText = monsterText + "|";
	}
	
	document.getElementById("area-startArea").checked = area.startArea;	// if the area is start area checks the check box, else unchecks it.
	drawMap();															//calls drawmap to update the destination links between area reps
}



//loads the item edit panel
function loadItemPanel(index) {
	var item;
	if(index == -1) {							//if index is -1 then add new item
		index = global_itemArray.length;		//saves a math operation
		new Item();								//declaring new item
		loadItems();							//call loadItems to reload item values 
		document.getElementById("item").value = index; //set selector value to this item value
	}
	else {
		loadItems();							//needs to do this either way, saves operation using else statement.
	}
	
	if(index == 'null') {						//can equal null and thus deals with it by creating item object with no values.
		item = {'name':'', 'moveable':false, 'pickable':false, 'edible':false, 'drinkable':false, 'examine':'', 'smell':'', 'listen':'', 'moveMessage':'', 'heal':'', 'dp':''}
	}
	else {
		item = global_itemArray[index]; 			//otherwise load item instance into var for easy writing
	}
	document.getElementById("item-name").value = item.name;				//set values of document based on item object values.
	document.getElementById("moveable").checked = item.moveable;		//fairly sure I don't actually have this functionality in the game -- oops -- though was planning on adding it. Well, now the ages can theorise about what it does.
	document.getElementById("pickable").checked = item.pickable;
	document.getElementById("edible").checked = item.edible;
	document.getElementById("drinkable").checked = item.drinkable;
	document.getElementById("item-examine").innerText = item.examine;
	document.getElementById("item-smell").innerText = item.smell;
	document.getElementById("item-listen").innerText = item.listen;
	document.getElementById("item-movemsg").innerText = item.moveMessage;
	document.getElementById("item-heal").value = item.heal;
	document.getElementById("item-dp").innerText = item.dp;
	
	
}

function loadMonsterPanel(index) {
	var monster
	if(index == -1) {				//basically its the same as the beggining of both item and area panel loading.
		index = global_monsterArray.length;
		new Monster();
		loadMonsters();
		document.getElementById("monster").value = index;
	}
	else {
		document.getElementById("monster").value = index;
	}
	if(index == 'null') {
		monster = {'name':'', 'examine':'', 'hp':'', 'dp':'', 'drop':[]};
	}
	else {
		monster = global_monsterArray[index];
	}
	document.getElementById("monster-name").value = monster.name;			//set values based on loaded monster object
	document.getElementById("monster-examine").innerText = monster.examine;
	document.getElementById("monster-hp").value = monster.hp;
	document.getElementById("monster-dp").value = monster.dp;
	
	var itemText = document.getElementById("monster-items-text");			//grab the text area that shows items attatched to monster
	itemText.innerText = '';												//set to ''
	for(var i=0;i<monster.drop.length;i++) {								//iterate over monster.drop array to add name value to text area
		itemText.innerText = itemText.innerText + "|" + monster.drop[i].name;
	}
	if(monster.drop.length > 0) {
		itemText.innerText = itemText.innerText + "|";						//add the closing '|' to text area only if there is an item name in there.
	}
	
}


//while hardcoded repeating is generally presumed to be bad, this will be repeated a lot so I think hardcoded instructions will save more time than jumping (looping and using functions, I presume its based upon the jump assembly commands at some level)
//reloads select options for destinations
function loadDests() {
	var dest = document.getElementById("area-dest-select");			//grab dest select
	dest.innerHTML = null;											//remove inner html (options for selection)
	for (var i=0;i<global_areaArray.length;i++) {					//iterate over areaArry, create option element for each, then append to select element
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_areaArray[i].name;
		dest.append(option);
	}
	
	var dest = document.getElementById("area");					//grab area select and apply the same as above, except with the addition of an option for creating a new area
	var previousValue = dest.value;
	dest.innerHTML = null;
	var blankOption = document.createElement("option");
	blankOption.setAttribute("value",null);
	dest.append(blankOption);
	var newAreaOption = document.createElement("option");
	newAreaOption.setAttribute("value",-1);
	newAreaOption.innerText="new Area";
	dest.append(newAreaOption);
	for (var i=0;i<global_areaArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_areaArray[i].name;
		dest.append(option);
	}
	for(var i=0;i<dest.children.length;i++) {				//iterate over children elements and if previous value there reset element value to that so that it doesn't change back to null everytime everything reloads.
		if(previousValue == dest.children[i].value) {
			dest.value = previousValue;
			break;
		}
	}
}


//basically the same as loadDests but loads the monster-item-select seletion element and area-item-select element.
function loadItems() {
	var items = document.getElementById("area-item-select");
	items.innerHTML = null;
	for (var i=0;i<global_itemArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_itemArray[i].name;
		items.append(option);
	}
	var items = document.getElementById("monster-item-select");
	items.innerHTML = null;
	for (var i=0;i<global_itemArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_itemArray[i].name;
		items.append(option);
	}
	
	var items = document.getElementById("item");
	var previousValue = items.value;
	items.innerHTML = null;
	var blankOption = document.createElement("option");
	blankOption.setAttribute("value",null);
	items.append(blankOption);
	var newItemOption = document.createElement("option");
	newItemOption.setAttribute("value",-1);
	newItemOption.innerText="new Item";
	items.append(newItemOption);
	for (var i=0;i<global_itemArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_itemArray[i].name;
		items.append(option);
	}
	
	for(var i=0;i<items.children.length;i++) {
		if(previousValue == items.children[i].value) {
			items.value = previousValue;
			break;
		}
	}
	
}

//as above
function loadMonsters() {
	var monsters = document.getElementById("area-monster-select");
	monsters.innerHTML = null;
	for (var i=0;i<global_monsterArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_monsterArray[i].name;
		monsters.append(option);
	}
	var monsters = document.getElementById("monster");
	var previousValue = monsters.value;
	monsters.innerHTML = null;
	var blankOption = document.createElement("option");
	blankOption.setAttribute("value",null);
	monsters.append(blankOption);
	var newMonsterOption = document.createElement("option");
	newMonsterOption.setAttribute("value",-1);
	newMonsterOption.innerText="new Monster";
	monsters.append(newMonsterOption);
	for (var i=0;i<global_monsterArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_monsterArray[i].name;
		monsters.append(option);
	}
	
	for(var i=0;i<monsters.children.length;i++) {
		if(previousValue == monsters.children[i].value) {
			monsters.value = previousValue;
			break;
		}
	}
}


//used to show/hide certain options (the different class panels and adding/removing of Dest/item/monster sections
function areaPanel() {
	loadDests();				//on changing panel reload different select element options
	loadItems();
	loadMonsters();
	loadAreaPanel(document.getElementById("area").value);			//load up area of selected value
	document.getElementById("area-edit").style.display=null;		//show area by setting display to null
	document.getElementById("item-edit").style.display='none';		//hide item-edit by setting display to none
	document.getElementById("monster-edit").style.display='none';	//hide monster-edit by setting display to none
}

//same as above
function itemPanel() {
	loadDests();
	loadItems();
	loadMonsters();
	document.getElementById("item-edit").style.display=null;
	document.getElementById("area-edit").style.display='none';
	document.getElementById("monster-edit").style.display='none';
}
//same as above
function monsterPanel() {
	loadDests();
	loadItems();
	loadMonsters();
	document.getElementById("monster-edit").style.display=null;
	document.getElementById("item-edit").style.display='none';
	document.getElementById("area-edit").style.display='none';
}



//Code surrounding loading/saving and starting game

//sets up starting environment variables for the interpreter
function start() {
	display(global_currentArea.name, true);		//display name of starting area
	display(global_currentArea.description);	//display description of starting area
	player = new Player();						//creates a new instance of player (used for inventory, etc);
	eventHandler = new EventHandler();			//creates a new instance of eventhandler [Functionality to be implemented in next version. Allows actions to be sparked by different events (like a sword appearing when pressing a lever)]
	var input = document.getElementById("input");	//undisable input field (in circumstance of death input is disabled
	input.disabled = false;	
	//eventHandler.report(["start"]);			//was used when event handler was an active function
	
}

//load Project
function loadProject() {
	var pan = document.getElementById("pan");		//grab pan and remove all child elements (graphical map of areas)
	for(var i=0; i<pan.childElementCount;i++) {
		pan.removeChild(pan.firstChild);
	}
	var file = loadedFile.split("\r\n\r\n");		//split the loaded file into seperate lines to be interpreted by json
	for (var i=0; i < file.length; i++) {			//iterate through lines, taking appropriate action depending on different circumstances
		var loadedObject = JSON.parse(file[i]);
		if(loadedObject.class == "area") {			//if loadObject is an area add to global_areaArray
			global_areaArray[loadedObject.index] = loadedObject;
			global_areaArray[loadedObject.index].__proto__ = Area.prototype;
			if(global_areaArray[loadedObject.index].startArea == true) {	//if object is startarea set startarea to it
				global_startArea = global_areaArray[loadedObject.index];
			}
			if(global_areaArray[loadedObject.index].currentArea == true) {	//if it was saved as current area then set current area to it.
				global_currentArea = global_areaArray[loadedObject.index];
			}
			var element = document.createElement("button");					//create graphical map node of area
			element.setAttribute("id", loadedObject.index);
			element.setAttribute("class", "area");
			element.style.left = -pan.offsetLeft + 100;				//place area at an offset of 100 from left of viewport
			element.style.top = -pan.offsetTop + 100;				// place area at an offset of 100 from top of viewport
			element.addEventListener("mouseenter", function () {overArea=this.id;console.log(this.id);})	//add event listeners that enable panning
			element.addEventListener("mouseleave", function () {overArea=false;})
			element.innerText = loadedObject.name;					//set text to name
			pan.append(element);									//append to pan
		}
		if(loadedObject.class == "item") {							//if item add to global_itemArray
			global_itemArray[loadedObject.index] = loadedObject;
		}
		if(loadedObject.class == "monster") {						//if monster add to global_monsterArray
			global_monsterArray[loadedObject.index] = loadedObject;
		}
	}
	var old = document.getElementById("history");					//remove text that may have been in console before loading of file
	var iconsole = document.getElementById("console");
	var input = document.getElementById("input");
	iconsole.removeChild(old);
	var newHistory = document.createElement("div");					//replace encapsulation of previous commands elemnt
	newHistory.setAttribute("id", "history");
	iconsole.insertBefore(newHistory, input);
	document.getElementById("area").value = global_currentArea.index;	//set selected area to edit to the global_currentArea
	loadAreaPanel();												//reload area panel
}


//when a local file is loaded this function triggers and calls appropriate loading functions
function receiveText(e) {
	loadedFile = e.target.result;		//loadedFile -- for use in loadProject -- is the result of loaded local file
	loadProject();						//call loadProject -- imports objects using json, etc
	start();							//calls start which prepares environment variables for interpreter
}

//load a local project/game/save
function loadLocalProjectFile() {
	// uploading the file through the FileReader api
	if(typeof window.FileReader !== 'function') {						//if File reader api not supported alert user
		alert("Your browser does not support the fileReader api");
		return;
	}
	var input = document.getElementById("srcFile");						// if no file selected alert user
	if(!input.files[0]) {
		alert("please select a file");
	}
	else {
		var fileReader = new window.FileReader();						//otherwise set up FleReader object and when loaded call recieveText function
		fileReader.onload = receiveText; 
		file = fileReader.readAsText(input.files[0]);					//load up file using fileReader object
	}
}



//save a project
function saveProject() {
	var outfile = "";													//create empty output file
	for (i in global_areaArray) {										//iterate over areas
		outfile = outfile + JSON.stringify(global_areaArray[i]);		//add Json export of file to outfile
		if(i == global_areaArray.length - 1) {							//somehow fixes formating error, though I can't remember why it errors without
			if(global_monsterArray[0] != undefined) {
				outfile = outfile + "\r\n\r\n";
			}
		}
		else {
			outfile = outfile + "\r\n\r\n";
		}
		
	}
	for (i in global_itemArray) {										// basically the same as for areas
		outfile = outfile + JSON.stringify(global_itemArray[i]);
		if(i == global_itemArray.length - 1) {
			if(global_itemArray[0] != undefined) {
				outfile = outfile + "\r\n\r\n";
			}
		}
		else {
			outfile = outfile + "\r\n\r\n";
		}
		
	}
	for (i in global_monsterArray) {									//and for monsters
		outfile = outfile + JSON.stringify(global_monsterArray[i]);
		if(i != global_monsterArray.length - 1) {
			outfile = outfile + "\r\n\r\n";
		}
	}
	save("project.json", outfile);										//call the save function which sets up downloading of file
}

//Set up saved project for download
function save(filename, data) {
	var blob = new Blob([data], {type: 'text/json'});					//create Blob object of type text/json, with data provided [outfile from saveProject]
	var element = window.document.createElement('a');					//create a link element that links to blob
	element.href = window.URL.createObjectURL(blob);
	element.download = filename;										//sets it so that downloads the file rather than navigating to link
	document.body.appendChild(element);									//append to body
	element.click();													//artificially click link to cause download
	element.remove();													//remove element
}