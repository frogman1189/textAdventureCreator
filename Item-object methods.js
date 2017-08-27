Object methods

//get/take/pick	-> Items --> actually an area/container function
//get/take/pick all -> Items --> as above
throw _ at _ -> Items
open container -> Container
//open exit -> Door/exit
read -> Item
drop -> Item --> also area
put _ in _ -> Item, Container
turn control with -> Control, item
turn on _ -> Control, Item
turn off _ -> Control, item
//move -> All
attack/kill _ with _ -> Item, Creature --> Area
//examine -> All
eat -> Food (item) [edible = true] --> Player
//close [door] -> Door/exit (Object on open event(door opened) exit _ locked = false)
//tie _ to _ -> Item, Object
//break _ with _ -> object, item
drink -> Food (item)
//smell -> Object
//listen -> Creature/Object