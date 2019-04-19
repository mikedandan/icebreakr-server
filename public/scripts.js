const username = prompt('what is your username?')
// const socket = io('http://localhost:3000'); // the / namespace/endpoint
const socket = io('http://localhost:3000',{
    query: {
        username
    }
}); // the / namespace/endpoint

let nsSocket = '';

// Listen for ALL namespaces
socket.on('nsList', (nsData)=>{
    console.log(nsData)
    // target element on client to take you to specific namespace (nsData). Namespace will need to be the 'class' of each button. This will load on the Dashboard page.
    let namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns)=> {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`
    })
    Array.from(document.getElementsByClassName('namespace')).forEach((e)=> {
        e.addEventListener('click', (elem)=>{
            // 'ns' will need to be added to the </group> and </event> links
            const nsEndpoint = e.getAttribute('ns');

            // This is where we will have to make a distinction between going to a private message
            joinNs(nsEndpoint);
        })
    })
    joinNs('/group');
})


