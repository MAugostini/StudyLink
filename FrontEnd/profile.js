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

// availability checkboxes
const savedAvailability = currentUser.availability || [];
document.querySelectorAll('#availability input[type="checkbox"]').forEach(cb => {
  cb.checked = savedAvailability.includes(cb.value);
});

const savedMeetingPref = currentUser.meetingPreference || [];
document.querySelectorAll('#meeting-preference input[type="checkbox"]').forEach(cb => {
  cb.checked = savedMeetingPref.includes(cb.value);
});
