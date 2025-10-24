import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZw9d3n-FWx4qpKiZFsLdzI3iOYwTtBTA",
  authDomain: "ad-thingy.firebaseapp.com",
  projectId: "ad-thingy",
  storageBucket: "ad-thingy.firebasestorage.app",
  messagingSenderId: "495656585285",
  appId: "1:495656585285:web:ea9ce2497566216d50fb2c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Modal logic
const modal = document.getElementById("serverModal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.querySelector(".close-btn");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target === modal) modal.style.display = "none"; };

// Elements
const serverListEl = document.getElementById('serverList');
const addBtn = document.getElementById('addServerBtn');

// Add server
addBtn.addEventListener('click', async () => {
  const name = document.getElementById('serverName').value;
  const icon = document.getElementById('serverIcon').value;
  const desc = document.getElementById('serverDesc').value;
  const invite = document.getElementById('serverInvite').value;
  const importance = parseInt(document.getElementById('serverImportance').value) || 1;

  if(name && icon && desc && invite){
    await addDoc(collection(db, "servers"), {
      name, icon, desc, invite, importance, timestamp: Date.now()
    });

    // Clear inputs
    document.getElementById('serverName').value = '';
    document.getElementById('serverIcon').value = '';
    document.getElementById('serverDesc').value = '';
    document.getElementById('serverInvite').value = '';
    document.getElementById('serverImportance').value = '1';

    modal.style.display = "none";
  }
});

// Real-time listener, sorted by importance then timestamp
onSnapshot(collection(db, "servers"), snapshot => {
  let servers = [];
  snapshot.forEach(doc => servers.push(doc.data()));

  // Sort by importance descending, then timestamp descending
  servers.sort((a,b) => b.importance - a.importance || b.timestamp - a.timestamp);

  serverListEl.innerHTML = '';
  servers.forEach(data => {
    serverListEl.innerHTML += `
      <div class="server-card">
        <img src="${data.icon}" alt="Server Icon">
        <h3>${data.name}</h3>
        <p>${data.desc}</p>
        <a href="${data.invite}" target="_blank">
          <button class="boton-elegante">Join Server</button>
        </a>
      </div>
    `;
  });
});
