console.log("group-management.js loaded ✅");

function loadCurrentGroup() {
  const groups = JSON.parse(localStorage.getItem('groups')) || [];

  let raw = localStorage.getItem('currentGroup') || localStorage.getItem('currentgroup') || null;
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

      attendBtn.addEventListener('click', () => {
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
        // Optionally update attendance UI here
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', loadCurrentGroup);
