const users = JSON.parse(localStorage.getItem("users")) || [];
const currentUsername = localStorage.getItem("currentUser");

if (!currentUsername) {
  window.location.href = "signin.html";
}

const currIndex = users.findIndex(u => u.username === currentUsername);
if (currIndex === -1) {
  window.location.href = "signin.html";
}

const currentUser = users[currIndex];

// Fill fields with information fr
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

document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const editedUser = {
    ...currentUser, // keep unchanged fields
    firstName: document.getElementById("first-name").value.trim(),
    lastName: document.getElementById("last-name").value.trim(),
    major: document.getElementById("major").querySelector("select").value,
    schoolYear: document.getElementById("school-year").querySelector("select").value,
    groupSize: document.getElementById("group-size").querySelector("select").value,
    availability: Array.from(document.querySelectorAll("#availability input[type=checkbox]"))
      .filter(cb => cb.checked)
      .map(cb => cb.value),
    meetingPreference: Array.from(document.querySelectorAll("#meeting-preference input[type=checkbox]"))
      .filter(cb => cb.checked)
      .map(cb => cb.value)
  };

  users[currIndex] = editedUser;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Profile updated!");
    window.location.href = "./profile.html";
});