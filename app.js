let token = null
let socket = null
const API = "https://darcord-backend.up.railway.app"

async function register() {
  await fetch(API + "/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
}

async function login() {
  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  const data = await res.json()
  token = data.token
  connectWS()
}

function connectWS() {
  socket = new WebSocket(API.replace("https", "wss") + "/ws")

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data)
    chat.innerHTML += `<p><b>${msg.username}:</b> ${msg.message}</p>`
  }
}

function sendMessage() {
  socket.send(JSON.stringify({
    token: token,
    message: message.value
  }))
}
