const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUsername = localStorage.getItem("currentUser");

if (!currentUsername) {
  window.location.href = "signin.html";
}

const currentUser = users.find(u => u.username === currentUsername);

if (!currentUser) {
  window.location.href = "signin.html";
}

// Fill fields
document.getElementById("first-name").value = currentUser.firstName || "";
document.getElementById("last-name").value = currentUser.lastName || "";
document.getElementById("email").value = currentUser.email || "";
document.getElementById("username").value = currentUser.username || "";
document.getElementById("major").querySelector("select").value = currentUser.major || "";
document.getElementById("school-year").querySelector("select").value = currentUser.schoolYear || "";
document.getElementById("group-size").querySelector("select").value = currentUser.groupSize || "";
document.getElementById("biography-box").value = currentUser.biography || "";

// availability checkboxes
const savedAvailability = currentUser.availability || [];
document.querySelectorAll('#availability input[type="checkbox"]').forEach(cb => {
  cb.checked = savedAvailability.includes(cb.value);
});

const savedMeetingPref = currentUser.meetingPreference || [];
document.querySelectorAll('#meeting-preference input[type="checkbox"]').forEach(cb => {
  cb.checked = savedMeetingPref.includes(cb.value);
});

// Load My Study Groups
const groups = JSON.parse(localStorage.getItem("groups")) || [];
const myGroups = groups.filter(g => g.leaderUsername === currentUsername);

const myGroupsContainer = document.getElementById("my-groups");
if (myGroups.length === 0) {
  myGroupsContainer.innerHTML = "<div style='color: rgba(229,231,235,0.55); font-size: 14px; text-align: center; padding: 20px;'>No groups created yet</div>";
} else {
  myGroupsContainer.style.display = "grid";
  myGroupsContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
  myGroupsContainer.style.gap = "12px";
  myGroupsContainer.innerHTML = myGroups.map((group, idx) => `
    <div class="group-item" data-index="${idx}" style="padding: 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
      <div style="font-weight: 600; color: #e5e7eb; margin-bottom: 4px; font-size: 14px;">${group.groupName || 'Unnamed Group'}</div>
      <div style="font-size: 12px; color: rgba(229,231,235,0.65);">${group.courseName && group.courseName.trim() ? group.courseName : 'No course assigned'}</div>
    </div>
  `).join("");
  
  // Add click handlers
  document.querySelectorAll('.group-item').forEach(item => {
    item.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      localStorage.setItem('currentGroup', JSON.stringify(myGroups[index]));
      window.location.href = './group-management.html';
    });
    item.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(255,255,255,0.10)';
      this.style.borderColor = 'rgba(255,255,255,0.20)';
      this.style.transform = 'translateY(-2px)';
    });
    item.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(255,255,255,0.06)';
      this.style.borderColor = 'rgba(255,255,255,0.12)';
      this.style.transform = 'translateY(0)';
    });
  });
}
