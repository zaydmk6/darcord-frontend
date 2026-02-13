let localStream;
let peers = {};
let socket;

async function joinVoiceRoom(roomId) {

    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    socket = new WebSocket(`wss://darcord-frontend.vercel.app/ws/voice/${roomId}`);

    socket.onopen = () => {
        document.getElementById("status").innerText = "Connected 🎤";
    };

    socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "offer") {
            await createAnswer(data.offer, data.from);
        }

        if (data.type === "answer") {
            await peers[data.from].setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        if (data.type === "ice") {
            await peers[data.from].addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    };
}

async function createPeer(user) {
    const peer = new RTCPeerConnection();
    peers[user] = peer;

    localStream.getTracks().forEach(track =>
        peer.addTrack(track, localStream)
    );

    peer.onicecandidate = e => {
        if (e.candidate) {
            socket.send(JSON.stringify({
                type: "ice",
                candidate: e.candidate,
                token: localStorage.token
            }));
        }
    };

    peer.ontrack = e => {
        const audio = document.createElement("audio");
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
        document.body.appendChild(audio);
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.send(JSON.stringify({
        type: "offer",
        offer: offer,
        token: localStorage.token
    }));
}

async function createAnswer(offer, user) {
    const peer = new RTCPeerConnection();
    peers[user] = peer;

    localStream.getTracks().forEach(track =>
        peer.addTrack(track, localStream)
    );

    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.send(JSON.stringify({
        type: "answer",
        answer: answer,
        token: localStorage.token
    }));

    peer.ontrack = e => {
        const audio = document.createElement("audio");
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
        document.body.appendChild(audio);
    };
}

function leaveVoice() {
    if (socket) socket.close();
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    document.getElementById("status").innerText = "Disconnected 🔴";
}
