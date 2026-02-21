// group-chat.js
// Client-side group chat using Firebase Firestore.
//https://github.com/googleapis/java-firestore

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  // Replace these values with your Firebase project's config
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function escapeHtml(s){
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getGroupId(){
  const gEl = document.getElementById('group-name');
  const fromEl = gEl && gEl.value ? gEl.value.trim() : null;
  return fromEl || (new URLSearchParams(location.search).get('group')) || 'demo-group';
}

const groupId = getGroupId();
const messagesRef = collection(db, 'groups', groupId, 'messages');

const listEl = document.getElementById('message-list');
const inputEl = document.getElementById('message-input');
const sendBtn = document.getElementById('sendBTN');

function getCurrentUserFullName(){
  const username = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username);
  if(!username) return 'Anonymous';
  if(user) return `${user.firstName || ''} ${user.lastName || ''}`.trim() || username;
  return username;
}

async function sendMessage(){
  const text = inputEl.value.trim();
  const name = getCurrentUserFullName();
  if(!text) return;
  // Ensure user is a member before allowing send
  if(!isCurrentUserMember()){
    alert('Please join the group to participate in the chat.');
    return;
  }
  await addDoc(messagesRef, {
    name,
    text,
    createdAt: serverTimestamp()
  });
  inputEl.value = '';
}

sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    sendMessage();
  }
});

function isCurrentUserMember(){
  const username = localStorage.getItem('currentUser');
  if(!username) return false;
  let currentGroup = JSON.parse(localStorage.getItem('currentGroup')) || null;
  if(!currentGroup){
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    currentGroup = groups.find(g => g.groupName === getGroupId()) || null;
  }
  return currentGroup && Array.isArray(currentGroup.members) && currentGroup.members.includes(username);
}

function setChatAvailability(){
  const member = isCurrentUserMember();
  if(!inputEl || !sendBtn) return;
  inputEl.disabled = !member;
  sendBtn.disabled = !member;
  inputEl.placeholder = member ? 'Enter a message...' : 'Join the group to enable chat';
}

// enable/disable chat based on membership on load
setChatAvailability();

// listen for a custom event emitted when the user joins a group
document.addEventListener('studylink:joinedGroup', (e)=>{
  // refresh availability
  setChatAvailability();
});
// also listen for leaving
document.addEventListener('studylink:leftGroup', (e)=>{
  setChatAvailability();
});

// realtime listener
const q = query(messagesRef, orderBy('createdAt'));
onSnapshot(q, (snapshot)=>{
  listEl.innerHTML = '';
  snapshot.forEach(doc => {
    const m = doc.data();
    const li = document.createElement('li');
    li.className = 'chat';
    const who = escapeHtml(m.name || 'Anon');
    const text = escapeHtml(m.text || '');
    li.innerHTML = `<strong style="color:#fff; display:block;">${who}</strong><div style="color:#ddd;">${text}</div>`;
    listEl.appendChild(li);
  });
  listEl.scrollTop = listEl.scrollHeight;
});

// Export helper for debugging
window.__studylink_group_chat = { groupId };
