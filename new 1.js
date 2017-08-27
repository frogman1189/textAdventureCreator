class object {
	constructor(name = "Unamed_Object",
				smell = "It has no smell",
				listen = "It makes no noise",
				examine = "There is nothing special about it", 
				movable = false,
				moveMessage = undefined,
				edible = false,
				heal = undefined,
				pickable = false,
				dp = 0) {
		//attributes
		this.class = "object";
		this.name = name;
		this.smell = smell;
		this.listen = listen;
		this.examine = examine;
		this.movable = moveable;
		this.moveMessage = moveMessage;
		this.edible = edible;
		this.heal = heal;
		this.pickable = pickable;
		this.dp = dp;
		
	}
}

class item extends object {
	constructor() {
		super();
		
	}
}




Event system

listeners = []

addListener(eventType /*[area_addItem, etc]*/, eventToListenFor, Arrayofconditions /*x,y,x,y format*/, addedIndex, locIndex /*-1 = player*/) {
	if (Event.report(event) == this.event) {
		if (Other conditions met) {
			addItem();
		}
	}
}
class Event {
	constructor(eventType, eventToListenFor, arrayOfConditions, addedIndex, locIndex) {
		this.type = eventType;
		this.listener = eventToListenFor;
		this.conditions = arrayOfConditions;
		this.addedIndex = addedIndex;
		this.locIndex = locIndex;
	}
}

class



































