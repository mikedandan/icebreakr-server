function joinNs(endpoint) {
    if(nsSocket){
        // check to see if the socket is a socket
        nsSocket.close();
        // remove the event listener so there are not mulpible before it's added again
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
    }
    // the nsSocket then uses the selected endpoint to change the Namespace of the socket. BOOM!
    nsSocket = io(`http://localhost:3000${endpoint}`)
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        // console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.forEach((room) => {
            let glyph;
            if (room.privateRoom) {
                glyph = 'lock'
            } else {
                glyph = 'globe'
            }
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
        })
        // Add click listener to EACH room. First set the room variable
        let roomSingle = document.getElementsByClassName('room');
        Array.from(roomSingle).forEach((elm) => {
            elm.addEventListener('click', (e) => {
                console.log("someone Clicked on ", e.target.innerText);
                joinRoom(e.target.innerText);
            })
        })
        // Add room automatically. Group chat catches all when landing here.
        const groupRoom = document.querySelector('.room')
        const groupRoomName = groupRoom.innerText;
        // console.log(groupRoomName);
        joinRoom(groupRoomName);

    })
    nsSocket.on('messageToClients',(msg)=>{
        console.log(msg)
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg;
    })
    document.querySelector('.message-form').addEventListener('submit',formSubmission)
};

function formSubmission (event){
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer',{text: newMessage})
}

function buildHTML(msg){
    const convertedDate = new Date(msg.time).toLocaleString();
    const newHTML = `
    <li>
                    <div class="user-image">
                        <img src="${msg.avatar}" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </li>
                `
                return newHTML;
}