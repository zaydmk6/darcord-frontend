const API = "https://darcord-frontend.vercel.app"

let token = null
let socket = null
let usernameGlobal = null

// ===== LOGIN =====
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
  usernameGlobal = username.value
  connectChat()
  renderMember(usernameGlobal)
}

// ===== CHAT =====
function connectChat(){
  socket = new WebSocket(API.replace("https","wss")+"/ws/1")

  socket.onmessage = (e)=>{
    const msg = JSON.parse(e.data)
    renderMessage(msg.username,msg.message)
  }
}

function sendMessage(){
  if(!message.value) return

  socket.send(JSON.stringify({
    token:token,
    message:message.value
  }))

  message.value=""
}

function renderMessage(user,text){
  const div = document.createElement("div")
  div.className="message"

  const time = new Date().toLocaleTimeString()

  div.innerHTML=`
    <img class="avatar" src="${API}/avatars/${user}.png">
    <div class="msg-content">
      <div class="msg-header">
        <b>${user}</b>
        <span class="timestamp">${time}</span>
      </div>
      <div>${text}</div>
    </div>
  `
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
}

// ===== ONLINE MEMBER =====
function renderMember(user){
  const div = document.createElement("div")
  div.className="member"
  div.innerHTML=`
    <div class="status-dot"></div>
    ${user}
  `
  membersList.appendChild(div)
}

// ===== THEME =====
function toggleTheme(){
  document.body.classList.toggle("light")
  document.body.classList.toggle("dark")
}

// ===== VOICE UI =====
function joinVoice(){
  voiceOverlay.classList.remove("hidden")
  voiceStatus.innerText="Connected 🎤"
}

function leaveVoice(){
  voiceOverlay.classList.add("hidden")
}
