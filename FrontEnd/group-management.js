console.log("group-management.js loaded ✅");

function loadCurrentGroup() {
  const groups = JSON.parse(localStorage.getItem('groups')) || [];

  let raw = localStorage.getItem('selectedGroup') || localStorage.getItem('currentGroup') || localStorage.getItem('currentgroup') || null;
  let currentGroup = null;

  if (raw) {
    try {
      currentGroup = JSON.parse(raw);
    } catch (e) {
      currentGroup = raw;
    }
  }

  if (!currentGroup) {
    if (groups.length) currentGroup = groups[0];
    else return;
  }

  if (typeof currentGroup === 'string') {
    currentGroup = groups.find(g => g.groupName === currentGroup) || null;
  }

  if (!currentGroup) return;
  console.log('loadCurrentGroup:', currentGroup);

  // leaderName may be missing if group was created before we populated it —
  // fallback to the logged-in user's name
  let leaderName = currentGroup.leaderName || '';
  if (!leaderName) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUsername = localStorage.getItem('currentUser');
    const user = users.find(u => u.username === currentUsername);
    if (user) leaderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || currentUsername;
  }

  document.getElementById('leader-name').value = leaderName || '';
  document.getElementById('group-name').value = currentGroup.groupName || '';
  document.getElementById('group-size').value = currentGroup.groupSize || '';
  document.getElementById('course-name').value = currentGroup.courseName || '';

  const mt = currentGroup.meetingTime || [];
  document.querySelectorAll('#meeting-time input[type="checkbox"]').forEach(cb => {
    cb.checked = mt.includes(cb.value);
  });

  const md = currentGroup.meetingDay || [];
  document.querySelectorAll('#meeting-day input[type="checkbox"]').forEach(cb => {
    cb.checked = md.includes(cb.value);
  });

  const mp = currentGroup.meetingPreference || [];
  document.querySelectorAll('#meeting-preference input[type="checkbox"]').forEach(cb => {
    cb.checked = mp.includes(cb.value);
  });

  document.getElementById('group-bio-content').textContent = currentGroup.bio || 'No biography available';
  document.getElementById('group-goals-content').textContent = currentGroup.goals || 'No goals available';

  // determine whether the logged-in user is the leader
  const currentUsername = localStorage.getItem('currentUser');
  const leaderUsername = currentGroup.leaderUsername || null;
  let isLeader = false;
  if (leaderUsername && currentUsername && leaderUsername === currentUsername) {
    isLeader = true;
  } else if (currentUsername) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === currentUsername);
    const userFull = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : currentUsername;
    if (userFull && leaderName && userFull === leaderName) isLeader = true;
    if (!isLeader && leaderName && leaderName === currentUsername) isLeader = true;
  }

  const attendBtn = document.getElementById('attend-btn');
  const leaveBtn = document.getElementById('leave-btn');
  const editBtn = document.getElementById('edit-btn');

  if(editBtn){
    if(!isLeader){
      editBtn.style.display = 'none';
    }
  }

  if (leaveBtn) {
    if (!currentGroup.members || !currentGroup.members.includes(currentUsername)) {
      leaveBtn.style.display = 'none';
    } else if (currentGroup.members.includes(currentUsername)) {
      leaveBtn.style.display = '';
      leaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = localStorage.getItem('currentUser');
        if (!username) {
          alert('Please sign in to leave groups.');
          return;
        }

        // find and update group in stored groups
        const allGroups = JSON.parse(localStorage.getItem('groups')) || [];
        const idx = allGroups.findIndex(g => g.groupName === currentGroup.groupName);
        if (idx === -1) {
          alert('Group no longer exists.');
          return;
        }

        allGroups[idx].members = allGroups[idx].members.filter(m => m !== username);
        localStorage.setItem('groups', JSON.stringify(allGroups));
        // update currentGroup too
        currentGroup = allGroups[idx];
        localStorage.setItem('currentGroup', JSON.stringify(currentGroup));

        // update UI: hide leave, enable attend
        if (attendBtn) {
          attendBtn.textContent = 'Attend Group';
          attendBtn.disabled = false;
        }
        leaveBtn.style.display = 'none';

        // notify other components (chat) that user left
        try{ document.dispatchEvent(new CustomEvent('studylink:leftGroup',{detail:{group: currentGroup.groupName}})); }catch(e){}
      });
    }
  }

  if (attendBtn) {
    if (isLeader) {
      attendBtn.style.display = 'none';
      leaveBtn.style.display = 'none';
    } else {
      // update button state if already joined
      const members = currentGroup.members || [];
      if (members.includes(currentUsername)) {
        attendBtn.textContent = 'Joined';
        attendBtn.disabled = true;
      }

      attendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const username = localStorage.getItem('currentUser');
        if (!username) {
          alert('Please sign in to join groups.');
          return;
        }

        // find and update group in stored groups
        const allGroups = JSON.parse(localStorage.getItem('groups')) || [];
        const idx = allGroups.findIndex(g => g.groupName === currentGroup.groupName);
        if (idx === -1) {
          alert('Group no longer exists.');
          return;
        }

        allGroups[idx].members = allGroups[idx].members || [];
        if (!allGroups[idx].members.includes(username)) {
          allGroups[idx].members.push(username);
        }

        localStorage.setItem('groups', JSON.stringify(allGroups));
        // update currentGroup too
        currentGroup = allGroups[idx];
        localStorage.setItem('currentGroup', JSON.stringify(currentGroup));

        attendBtn.textContent = 'Joined';
        attendBtn.disabled = true;
        if (leaveBtn) { leaveBtn.style.display = ''; leaveBtn.disabled = false; }
        // notify other components (chat) that user joined
        try{ document.dispatchEvent(new CustomEvent('studylink:joinedGroup',{detail:{group: currentGroup.groupName}})); }catch(e){}
        // Optionally update attendance UI here
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', loadCurrentGroup);

// chatbox code pulled from GeeksforGeeks article: https://www.geeksforgeeks.org/javascript/create-working-chatbot-in-html-css-javascript/
const chatInput = 
    document.querySelector('.chat-input textarea');
const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = 
    "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";
//OpenAI Free APIKey
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = 
        className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi
    .querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    role: "user",
                    content: userMessage
                }
            ]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            messageElement
            .textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement
            .classList.add("error");
            messageElement
            .textContent = "Oops! Something went wrong. Please try again!";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatbox
    .appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox
    .scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);

function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display != 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg)
    }
}
