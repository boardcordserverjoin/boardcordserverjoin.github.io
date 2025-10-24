// ======================
// FIREBASE SETUP
// ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZw9d3n-FWx4qpKiZFsLdzI3iOYwTtBTA",
  authDomain: "ad-thingy.firebaseapp.com",
  projectId: "ad-thingy",
  storageBucket: "ad-thingy.firebasestorage.app",
  messagingSenderId: "495656585285",
  appId: "1:495656585285:web:ea9ce2497566216d50fb2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======================
// ELEMENT REFERENCES
// ======================
const openModalBtn = document.getElementById("openModalBtn");
const serverModal = document.getElementById("serverModal");
const closeBtn = document.querySelector(".close-btn");
const addServerBtn = document.getElementById("addServerBtn");
const serverList = document.getElementById("serverList");
const loader = document.getElementById("loaderContainer");
const searchInput = document.getElementById("searchInput");

// ======================
// MODAL HANDLING
// ======================
openModalBtn.addEventListener("click", () => {
  serverModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  serverModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === serverModal) serverModal.style.display = "none";
});

// ======================
// ADD SERVER
// ======================
addServerBtn.addEventListener("click", async () => {
  const name = document.getElementById("serverName").value.trim();
  const icon = document.getElementById("serverIcon").value.trim();
  const desc = document.getElementById("serverDesc").value.trim();
  const invite = document.getElementById("serverInvite").value.trim();
  const importance = parseInt(document.getElementById("serverImportance").value) || 1;

  if (!name || !icon || !desc || !invite) return alert("Please fill all fields.");

  loader.style.display = "flex"; // show loader

  try {
    await addDoc(collection(db, "servers"), {
      name,
      icon,
      desc: desc,
      invite,
      importance
    });

    serverModal.style.display = "none";
    loadServers(); // refresh list
  } catch (err) {
    console.error("Error adding server:", err);
    alert("Error adding server.");
  } finally {
    loader.style.display = "none"; // hide loader
  }
});

// ======================
// LOAD SERVERS
// ======================
async function loadServers() {
  loader.style.display = "flex";
  serverList.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "servers"));
    let servers = [];

    querySnapshot.forEach(doc => {
      servers.push({ id: doc.id, ...doc.data() });
    });

    // Sort by importance (higher first)
    servers.sort((a, b) => (b.importance || 1) - (a.importance || 1));

    renderServers(servers);
  } catch (err) {
    console.error("Error loading servers:", err);
  } finally {
    loader.style.display = "none";
  }
}

// ======================
// RENDER SERVERS
// ======================
function renderServers(servers) {
  serverList.innerHTML = "";
  servers.forEach(s => {
    const card = document.createElement("div");
    card.classList.add("server-card");
    card.innerHTML = `
      <img src="${s.icon}" alt="${s.name}">
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <a href="${s.invite}" target="_blank" class="boton-elegante">Join</a>
    `;
    serverList.appendChild(card);
  });
}

// ======================
// SEARCH FUNCTIONALITY
// ======================
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const cards = Array.from(document.querySelectorAll(".server-card"));

  cards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});

// ======================
// INITIAL LOAD
// ======================
loadServers();
