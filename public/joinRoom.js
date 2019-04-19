function joinRoom(roomName) {
    // First send room name to server.
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers)=>{
        //We want to update the number of members in the group here.
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers}  <span class="glyphicon glyphicon-user"></span>`
    })
    nsSocket.on('historyCatchup', (history)=>{
        console.log(history);
        const messagesUl = document.querySelector('#messages');
        messagesUl.innerHTML = '';
        history.forEach((msg)=>{
            const newMsg = buildHTML(msg)
            const currentMessages = messagesUl.innerHTML;
            messagesUl.innerHTML = currentMessages + newMsg;
        })
        // Scroll to the bottom of the messages AHHHH THIS IS NOT WORKING!!!!
        messagesUl.scrollTo(0,messagesUl.scrollHeight);
    })
    nsSocket.on('updateMembers', (numMembers)=>{
        document.querySelector('.curr-room-num-users').innerHTML = `${numMembers}  <span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${roomName}`

    })
};