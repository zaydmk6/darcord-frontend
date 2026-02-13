const API = "https://darcord-backend.up.railway.app"
let token = null
let socket = null
let server_id = 1
let channel_id = 1

async function register(){
  await fetch(API+"/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username.value,password:password.value})
  })
  alert("Registered")
}

async function login(){
  const res = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({username:username.value,password:password.value})
  })
  const data = await res.json()
  token = data.token
  connect()
}

function connect(){
  socket = new WebSocket(API.replace("https","wss")+"/ws/"+channel_id)

  socket.onmessage = (e)=>{
    const msg = JSON.parse(e.data)

    if(msg.type === "chat"){
      messages.innerHTML += `<p><b>${msg.username}</b>: ${msg.message}</p>`
    }

    if(msg.type === "online"){
      onlineUsers.innerHTML = ""
      msg.users.forEach(u=>{
        onlineUsers.innerHTML += `<div class="user">${u}</div>`
      })
    }
  }
}

function sendMessage(){
  socket.send(JSON.stringify({
    token:token,
    message:message.value,
    server_id:server_id
  }))
}

async function createServer(){
  const name = prompt("Server name?")
  await fetch(API+"/create_server",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({token:token,name:name})
  })
  alert("Created")
}
