function joinNs(endpoint) {
    if (nsSocket) {
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
<<<<<<< HEAD
    nsSocket.on('messageToClients', (msg) => {
        console.log(msg)
=======
    nsSocket.on('messageToClients',(msg)=>{
        // console.log(msg)
>>>>>>> 64765606d0ebcd00e4f86b3ffc77ef91909c253c
        const newMsg = buildHTML(msg);
        document.querySelector('#messages').innerHTML += newMsg;
    })
    document.querySelector('.message-form').addEventListener('submit', formSubmission)
};

function formSubmission(event) {
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
<<<<<<< HEAD

    nsSocket.emit('newMessageToServer', { text: newMessage })
    $.post("http://localhost:3000/api/message/new", {
        "nickName": "BOB SANDERS",
        "message": newMessage,
        "picture": "test.png",
        "userID": "12345",
        "lon": 55555,
        "lat": 11111,
        "namespace": "group",
        "date": Date.now()
    }, function () {
        console.log("sent to db")
    });
    // axios.post('http://localhost:3000/api/message/new', {
    //     "nickName": "Sam",
    //     "message": newMessage,
    //     "picture": "test.png",
    //     "userID": "12345",
    //     "lon": 55555,
    //     "lat": 11111,
    //     "namespace": "group",
    //     "date": Date.now()
    // })
    //     .then(async function (response) {
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
=======
    nsSocket.emit('newMessageToServer',{text: newMessage})
    console.log(`This is sending a message to the SERVER using 'newMessagetoServer' on joinNs.js
    ---------------------
    the message is: ${newMessage}`)
>>>>>>> 64765606d0ebcd00e4f86b3ffc77ef91909c253c
}

function buildHTML(msg) {
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