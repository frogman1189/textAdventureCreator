//Event system
//
//listeners = []
//
//addListener(eventType /*[area_addItem, etc]*/, eventToListenFor, Arrayofconditions /*x,y,x,y format*/, addedIndex, locIndex /*-1 = player*/) {
//	if (Event.report(event) == this.event) {
//		if (Other conditions met) {
//			addItem();
//		}
//	}
//}*/


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
		for (a in this.listeners) {
			if (this.listeners[a].listener == event) {
				checking = true;
				for(b in this.listeners[a].conditions) {
					if(this.listeners[a].conditions[b] != this.listeners[a].conditions[b+1]) {
						checking = false;
						break;
					}
					b = b + 1;
					
				}
				if(checking == true) {
					if(this.listeners[a].type == "area_addObject") {
						global_areaArray[this.listeners[a].locIndex].items.push(global_objectArray[this.listeners[a].addedIndex]);
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
						player.items.push(global_objectArray[this.listeners[a].addedIndex]);
					}
					if(this.listeners[a].type == "player_addItem") {
						player.items.push(global_objectArray[this.listeners[a].addedIndex]);
					}
					
					if(this.listeners[a].tmp  == 1) {
						this.listeners.pop(a);
					}
					
				}
				else {
					if(this.listeners[a].tmp == 0) {
						this.listeners.pop(a);
					}
				}
			}
		}
	}
	addListener(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, locIndex) {
		this.listeners.push(new Event(eventType, eventToListenFor, arrayOfConditions, addedIndex, tmp, locIndex))
	}
}