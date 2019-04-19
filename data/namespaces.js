// Bring in the room class
const Namespace =  require('../models/Namespace');
const Room =  require('../models/Room');

// Set up the namespaces
let namespaces = [];
let group = new Namespace(0,'Group','https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png','/group');
let private = new Namespace(1,'Private','https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png','/private');
let event = new Namespace(2,'Event','https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png','/event');
let eventAdmin = new Namespace(3,'Admin Event','https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png','/eventAdmin');


namespaces.push(group, private, event, eventAdmin);

// Make the main room and add it to rooms. it will ALWAYS be 0
group.addRoom(new Room(0,'Group Chat room 1','Group'));
group.addRoom(new Room(0,'Group Chat room 2','Group'));
group.addRoom(new Room(0,'Group Lock room 2','Group', true));
private.addRoom(new Room(1,'Private Chat room 1','Private'));
event.addRoom(new Room(2,'Event Chat room 1','Event'));
event.addRoom(new Room(2,'Event Chat room 2','Event'));
eventAdmin.addRoom(new Room(3,'Event Admin Chat room 1','Admin Event'));



// wikiNs.addRoom(new Room(1,'Editors','Wiki'));
// wikiNs.addRoom(new Room(2,'Other','Wiki'));

// mozNs.addRoom(new Room(0,'Firefox','Mozilla'));
// mozNs.addRoom(new Room(1,'SeaMonkey','Mozilla'));
// mozNs.addRoom(new Room(2,'SpiderMonkey','Mozilla'));
// mozNs.addRoom(new Room(3,'Rust','Mozilla'));

// linuxNs.addRoom(new Room(0,'Debian','Linux'));
// linuxNs.addRoom(new Room(1,'Red Hat','Linux'));
// linuxNs.addRoom(new Room(2,'MacOs','Linux'));
// linuxNs.addRoom(new Room(3,'Kernal Development','Linux'));

module.exports = namespaces;