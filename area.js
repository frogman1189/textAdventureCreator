class Area {
	constructor(name, description) {
		this.name = name || null;
		this.description = description || null;
		this.items = [];
		this.events = [];
	}
	add_items(items) {
		this.items.push(items);
	}
	add_event() {
	
	}

}
