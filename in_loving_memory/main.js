import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBI5qz5eMV0X8aYUQA5vjjCZIguNHcoG6A",
  authDomain: "memorial-database-ddf62.firebaseapp.com",
  projectId: "memorial-database-ddf62",
  storageBucket: "memorial-database-ddf62.appspot.com",
  messagingSenderId: "761574010569",
  appId: "1:761574010569:web:8c94ff7410d1c3cacc6718",
  measurementId: "G-QYS9X126YH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const notesContainer = document.querySelector(".notes_area");
const input = document.getElementById("noteInput");
const signatureInput = document.getElementById("signature");
const locationInput = document.getElementById("location");
const postBtn = document.getElementById("post_button");
const loading = document.getElementById("loading_button");

// Real-time listener using modular API
const notesQuery = query(collection(db, "notes"), orderBy("timestamp"));
onSnapshot(notesQuery, (snapshot) => {
  notesContainer.innerHTML = '<h2>Messages left behind</h2>';
  loading.style.display = "none";
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    const msg = document.createElement("p");
    msg.textContent = data.text;
    noteDiv.appendChild(msg);

    const sign = document.createElement("span");
    sign.className = "signature";
    sign.textContent = `— ${data.signature}, ${data.location}`;
    noteDiv.appendChild(sign);

    notesContainer.appendChild(noteDiv);
  });
});

// Posting a note using modular API
postBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  const signature = signatureInput.value.trim();
  const location = locationInput.value.trim();

  if (!text || !signature || !location) {
    alert("Please write a message and sign your name with your location");
    return;
  }

  await addDoc(collection(db, "notes"), {
    text,
    signature,
    location,
    timestamp: serverTimestamp()
  });

  input.value = "";
  signatureInput.value = "";
  locationInput.value = "";
});