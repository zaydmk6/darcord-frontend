const API = "https://darcord-backend.up.railway.app"

let token = null
let socket = null
let currentChannel = 1

async function register(){
  await fetch(API+"/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:username.value,
      password:password.value
    })
  })
  alert("Registered")
}

async function login(){
  const res = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:username.value,
      password:password.value
    })
  })
  const data = await res.json()
  token = data.token
  connect()
}

function connect(){
  socket = new WebSocket(API.replace("https","wss")+"/ws/"+currentChannel)
  socket.onmessage = (e)=>{
    const msg = JSON.parse(e.data)
    messages.innerHTML += `<p><b>${msg.username}:</b> ${msg.message}</p>`
  }
}

function sendMessage(){
  socket.send(JSON.stringify({
    token:token,
    message:message.value
  }))
}

async function createServer(){
  const name = prompt("Server name?")
  await fetch(API+"/create_server",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      token:token,
      name:name
    })
  })
  alert("Server created")
}
