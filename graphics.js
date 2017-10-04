//Graphical Interface Script

//declare variables
global_areaArray = [];
global_areaArray = [];
global_areaArray = [];
//global zoom value and different zoom functions
var zoom=1;

function zoomIn(e) {
	zoom = zoom + 0.5;
	if(zoom < 1 && zoom > -1) {										//used to help prevent repeated zoom frames from equal fraction stuff (i.e 1/0.5 == 2 and so the 2 times zoom has the potential to be repeated at -0.5 and 2
		zoom = 1;
	}
	if(Math.sign(zoom) == -1) {
		$(".window").animate({"zoom": 1/Math.abs(zoom)}, 0);		//if negative use fractional zoom out
	}
	else {
		$(".window").animate({"zoom": zoom}, 0);
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


function saveArea() {
	var area = global_areaArray[document.getElementById("area").value];
	area.name = document.getElementById("area-name").value;
	area.description = document.getElementById("area-description").value;
	area.startArea = document.getElementById("area-startArea").checked;
	area.currentArea = document.getElementById("area-startArea").checked;		//used so that startarea = currentarea and will load game. not used for saves, would muck those up.
	global_currentArea = area;
	loadAreaPanel(area.index);
}

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

function saveArea() {
	var area = global_areaArray[document.getElementById("area").value];
	area.name = document.getElementById("area-name").value;
	area.description = document.getElementById("area-description").value;
	area.startArea = document.getElementById("area-startArea").checked;
	area.currentArea = document.getElementById("area-startArea").checked;		//used so that startarea = currentarea and will load game. not used for saves, would muck those up.
	global_currentArea = area;
	loadAreaPanel(area.index);
}

function areaAddDest() {
	global_areaArray[document.getElementById("area").value].destinations[document.getElementById("area-dest-dir").value.toUpperCase()] = parseInt(document.getElementById("area-dest-select").value);
	loadAreaPanel(document.getElementById("area").value);
}
function areaRemoveDest() {
	delete global_areaArray[document.getElementById("area").value].destinations[document.getElementById("area-dest-dir").value.toUpperCase()];
	loadAreaPanel(document.getElementById("area").value);
}

function areaAddItem() {
	global_areaArray[document.getElementById("area").value].items.push(global_itemArray[document.getElementById("area-item-select").value]);
	loadAreaPanel(document.getElementById("area").value);
}
function areaRemoveItem() {
	global_areaArray[document.getElementById("area").value].items.splice(parseInt(document.getElementById("area-item-select").value), 1);
	loadAreaPanel(document.getElementById("area").value);
}

function monsterAddItem() {
	global_monsterArray[document.getElementById("monster").value].drop.push(global_itemArray[document.getElementById("monster-item-select").value]);
	loadMonsterPanel(document.getElementById("monster").value);
}

//remakes the select element for areas which is used for selecting destinations
function reloadAreaDataList() {
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
	var monsterDataList = document.createElement("select");
	monsterDataList.setAttribute("id", "monsterDataList");
	for(var i=0;i<global_monsterArray;i++) {				//iterate through areas adding them as options with index as value as that is used in game code, and name as seen value as that is how users differentiate between areas.
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.append(document.createTextNode(global_monsterArray[i].name));
		monsterDataList.append(option);
	}
	return monsterDataList;
}


//Load area into edit panel
function loadAreaPanel(index) {
	var area;
	//if the index equals -1 create a new Area (the new area option has a value of -1)
	if(index == -1) {
		index = global_areaArray.length;		//grab length before pushing new area to save a math operation
		new Area();
		loadDests();
		document.getElementById("area").value = index;
	}
	else {
		loadDests();
	}
	//document.getElementById("area").value = index;
	// assign area to var to make easier
	if(index == 'null') {
		area = {'name':"", 'description':'', 'destinations':{}, 'items':[], 'monsters':[], 'startArea':false}
		//alert("test");
	}
	else {
		area = global_areaArray[index];
	}
	console.log(index, area);
	//set the edit-panel name input to the area name
	document.getElementById("area-name").value = area.name;
	
	//set the edit-panel description to the area description
	document.getElementById("area-description").innerText = area.description;
	
	//set the edit-panel destinations list to area destinations
	var destText = document.getElementById("area-destinations-text");
	destText.innerText = "";
	
	// get keys of destinations so can iterate over and display each key pair
	var keys = Object.keys(area.destinations);
	for(var i=0;i<keys.length;i++) {
		destText.innerText = destText.innerText + "|" + keys[i] + ":" + global_areaArray[area.destinations[keys[i]]].name;
	}
	destText.innerText = destText.innerText + "|";
	
	
	//Same as destinations except for items
	var itemText = document.getElementById("area-items-text");
	itemText.innerText = "";
	for(var i=0;i<area.items.length;i++) {
		itemText.innerText = itemText.innerText + "|" + area.items[i].name;
	}
	itemText = itemText + "|";
	
	//Same as destinations except for monsters
	var monsterText = document.getElementById("area-monsters-text").innerText="";
	for(var i=0;i<area.monsters.length;i++) {
		monstersText = monstersText + "|" + area.monsters[i].name;
	}
	monsterText = monsterText + "|";
	
	// if the area is start area checks the check box, else unchecks it.
	document.getElementById("area-startArea").checked = area.startArea;
}


function loadItemPanel(index) {
	var item;
	if(index == -1) {
		index = global_itemArray.length;		//saves a math operation
		new Item();
		loadItems();
		document.getElementById("item").value = index;
	}
	else {
		loadItems();
	}
	
	if(index == 'null') {
		//alert(index);
		item = {'name':'', 'moveable':false, 'pickable':false, 'edible':false, 'drinkable':false, 'examine':'', 'smell':'', 'listen':'', 'moveMessage':'', 'heal':'', 'dp':''}
	}
	else {
		item = global_itemArray[index]; 			//load item instance into var for easy writing
	}
	console.log(index, item);
	document.getElementById("item-name").value = item.name;
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
	if(index == -1) {
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
	console.log(index, monster);
	document.getElementById("monster-name").value = monster.name;
	document.getElementById("monster-examine").innerText = monster.examine;
	document.getElementById("monster-hp").value = monster.hp;
	document.getElementById("monster-dp").value = monster.dp;
	
	var itemText = document.getElementById("monster-items-text");
	itemText.innerText = '';
	for(var i=0;i<monster.drop.length;i++) {
		itemText.innerText = itemText.innerText + "|" + monster.drop[i].name;
	}
	itemText.innerText = itemText.innerText + "|";
	
}


//while hardcoded repeating is generally presumed to be bad, this will be repeated a lot so I think hardcoded instructions will save more time than jumping (looping and using functions, I presume its based upon the jump assembly commands at some level)
function loadDests() {
	var dest = document.getElementById("area-dest-select");
	dest.innerHTML = null;
	for (var i=0;i<global_areaArray.length;i++) {
		var option = document.createElement("option");
		option.setAttribute("value",i);
		option.innerText=global_areaArray[i].name;
		dest.append(option);
	}
	var dest = document.getElementById("area");
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
	for(var i=0;i<dest.children.length;i++) {
		if(previousValue == dest.children[i].value) {
			dest.value = previousValue;
			break;
		}
	}
}

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
	loadDests();
	loadItems();
	//loadMonsters(document.getElementById("area").value);
	loadAreaPanel(document.getElementById("area").value);
	document.getElementById("area-edit").style.display=null;
	document.getElementById("item-edit").style.display='none';
	document.getElementById("monster-edit").style.display='none';
}

function itemPanel() {
	loadDests();
	loadItems();
	loadMonsters();
	document.getElementById("item-edit").style.display=null;
	document.getElementById("area-edit").style.display='none';
	document.getElementById("monster-edit").style.display='none';
}

function monsterPanel() {
	loadDests();
	loadItems();
	loadMonsters();
	document.getElementById("monster-edit").style.display=null;
	document.getElementById("item-edit").style.display='none';
	document.getElementById("area-edit").style.display='none';
}

function addArea() {
	
}


/*function addArea(iname = "Untitled Area", idescription = "Blank", idestinations = {}, iitems = {}, imonsters = {}, istartArea = false, index=global_areaArray.length) {
	//create div which all elements in body window attatch to.
	var body = document.createElement("div");
	body.setAttribute("class", "window");
	body.setAttribute("id", index);
	
	//create window bar and attatch to main div
	var windowbar = document.createElement("div");
	windowbar.setAttribute("class", "window-bar");
	var title = document.createElement("p")
	title.append(document.createTextNode("---AREA---"));
	windowbar.append(title);
	body.append(windowbar);
	
	//create list which contains all the parameters used for areas
	var ul = document.createElement("ul");
	// create name section
	var name = document.createElement("li");
	//add name text
	nameText = document.createElement("p");
	nameText.append(document.createTextNode("NAME:"));
	nameText.setAttribute("class", "title");
	name.append(nameText);
	//add name Input
	var nameInput = document.createElement("input");
	nameInput.setAttribute("type", "text");
	nameInput.setAttribute("class", "inline");
	nameInput.setAttribute("id", "name");
	nameInput.setAttribute("value", iname);
	name.append(nameInput);
	ul.append(name);
	
	//create Description section
	var description = document.createElement("li");
	//add name text
	descriptionText = document.createElement("p");
	descriptionText.append(document.createTextNode("DESCRIPTION:"));
	descriptionText.setAttribute("class", "title");
	description.append(descriptionText);
	//add description Input
	var descriptionInput = document.createElement("textarea");
	descriptionInput.setAttribute("type", "text");
	descriptionInput.setAttribute("class", "inline");
	descriptionInput.setAttribute("id", "name");
	descriptionInput.setAttribute("value", idescription);
	description.append(descriptionInput);
	ul.append(description);
	
	//create Destinations section
	var dest = document.createElement("li");
	//add dest text
	var destText = document.createElement("p");
	destText.append(document.createTextNode("DESTINATIONS:"));
	destText.setAttribute("class", "title");
	dest.append(destText);
	//add Dest input (to be populated by javascript later)
	var destLocs = document.createElement("p");
	destLocs.setAttribute("id", "dest");
	destLocs.setAttribute("class", "inline");
	
	// populate dest input with the locations it joins to
	destLocs.textContent = "";
	var keys = Object.keys(idestinations);
	for(var i=0;i<keys.length;i++) {
		destLocs.textContent = destLocs.textContent + keys[i] + ":" + global_areaArray[idestinations[keys[i]][0]].name + ", ";
	}
	dest.append(destLocs);
	var destInput = document.createElement("select")
	destInput.setAttribute("id", "destinations");
	var destSubmit = document.createElement("button");
	destSubmit.setAttribute("onlick", "addDest()")
	destInput.append(destSubmit);
	dest.append(destInput);
	ul.append(dest);
	
	//create Items section
	var items = document.createElement("li");
	//add dest text
	var itemsText = document.createElement("p");
	itemsText.append(document.createTextNode("ITEMS:"));
	itemsText.setAttribute("class", "title");
	items.append(itemsText);
	//add items input (to be populated by javascript later)
	var itemsList = document.createElement("p");
	itemsList.setAttribute("id", "items");
	itemsList.setAttribute("class", "inline");
	items.append(itemsList);
	var itemsInput = document.createElement("select")
	itemsInput.setAttribute("id", "items");
	var itemsSubmit = document.createElement("button");
	itemsSubmit.setAttribute("onlick", "additems()")
	itemsInput.append(itemsSubmit);
	items.append(itemsInput);
	ul.append(items);
	
	
	//create Monsters section
	var monster = document.createElement("li");
	//add dest text
	var monsterText = document.createElement("p");
	monsterText.append(document.createTextNode("MONSTERS:"));
	monsterText.setAttribute("class", "title");
	monster.append(monsterText);
	//add monster input (to be populated by javascript later)
	var monsterList = document.createElement("p");
	monsterList.setAttribute("id", "monsters");
	monsterList.setAttribute("class", "inline");
	monster.append(monsterList);
	var monsterInput = document.createElement("select")
	monsterInput.setAttribute("id", "monster");
	var monsterSubmit = document.createElement("button");
	monsterSubmit.setAttribute("onlick", "addmonster()")
	monsterInput.append(monsterSubmit);
	monster.append(monsterInput);
	ul.append(monster);
	
	//create startArea section
	var startArea = document.createElement("li");
	var startAreaText = document.createElement("p");
	startAreaText.setAttribute("class","title");
	startAreaText.append(document.createTextNode("STARTAREA"));
	startArea.append(startAreaText);
	//create startArea input (checkbox)
	var startAreaInput = document.createElement("input");
	startAreaInput.setAttribute("type", "checkbox");
	startAreaInput.setAttribute("id", "startArea");
	startArea.append(startAreaInput);
	ul.append(startArea);
	
	body.append(ul);
	
	//add body to pan
	document.getElementById("pan").append(body);
	$("#"+index).draggable();
	if(index == global_areaArray.length) {
		global_areaArray[index] = new Area(iname, idescription, idestinations, iitems, imonsters, istartArea, index);
	}
	
	
}*/






//Code surrounding loading/saving and starting game
function start() {
	loadProject();
	display(global_currentArea.name, true);
	display(global_currentArea.description);
	player = new Player();
	eventHandler = new EventHandler();
	eventHandler.addListener("player_addItem", "start", [], 0, 0);
	var input = document.getElementById("input");
	input.disabled = false;
	eventHandler.report(["start"]);
	
}

//load Project
function loadProject() {
	var file = loadedFile.split("\r\n\r\n");
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
		if(loadedObject.class == "item") {
			global_itemArray[loadedObject.index] = loadedObject;
		}
		if(loadedObject.class == "monster") {
			global_monsterArray[loadedObject.index] = loadedObject;
		}
	}
	/*for(var i=0;i<global_areaArray.length;i++) {
		addArea(global_areaArray[i].name, global_areaArray[i].description, global_areaArray[i].destinations, global_areaArray[i].items, global_areaArray[i].monsters, global_areaArray[i].startArea, global_areaArray[i].index);
	}*/
	var old = document.getElementById("history");
	var iconsole = document.getElementById("console");
	var input = document.getElementById("input");
	iconsole.removeChild(old);
	var newHistory = document.createElement("div");
	newHistory.setAttribute("id", "history");
	iconsole.insertBefore(newHistory, input);
}

function receiveText(e) {
	loadedFile = e.target.result;
	start();
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
	for (i in global_itemArray) {
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