const form = document.getElementById("create-group-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUserKey = localStorage.getItem("currentUser"); // could be username OR email

  // Must be logged in
  if (!currentUserKey) {
    alert("You must be logged in to create a group.");
    window.location.href = "login.html";
    return;
  }

  // Leader lookup (robust: match username OR email)
  const leaderUser = users.find(u =>
    u.username === currentUserKey || u.email === currentUserKey
  );

  const leaderUsername = leaderUser?.username || currentUserKey;
  const leaderName = leaderUser
    ? `${leaderUser.firstName || ""} ${leaderUser.lastName || ""}`.trim()
    : leaderUsername; // fallback, not "Unknown"

  // Read form values (MATCHES YOUR HTML)
  const groupName = (document.getElementById("group-name")?.value || "").trim();
  const courseName = document.getElementById("course-name")?.value || "";
  const groupSize = document.querySelector("#group-size select")?.value || "";

  const meetingTime = Array.from(
    document.querySelectorAll("#meeting-time input[type=checkbox]:checked")
  ).map(cb => cb.value);

  const meetingDay = Array.from(
    document.querySelectorAll("#meeting-day input[type=checkbox]:checked")
  ).map(cb => cb.value);

  const meetingPreference = Array.from(
    document.querySelectorAll("#meeting-preference input[type=checkbox]:checked")
  ).map(cb => cb.value);

  // Validation
  if (!groupName) {
    alert("Please enter a group name.");
    return;
  }

  if (courseName === "Select course") {
    alert("Please select a course.");
    return;
  }

  if (groupSize === "Select size") {
    alert("Please select a group size.");
    return;
  }

  // Prevent duplicate group name (case-insensitive)
  const exists = groups.some(g =>
    (g.groupName || "").toLowerCase() === groupName.toLowerCase()
  );
  if (exists) {
    alert("That group name is already taken.");
    return;
  }

  const newGroup = {
    leaderName,
    leaderUsername,
    groupName,
    groupSize,
    courseName,
    meetingTime,
    meetingDay,
    meetingPreference,
    bio: "",
    goals: "",
    members: [leaderUsername],
    createdAt: new Date().toISOString()
  };

  groups.push(newGroup);
  localStorage.setItem("groups", JSON.stringify(groups));
  localStorage.setItem("currentGroup", JSON.stringify(newGroup));

  alert("Group created! Returning to group management page.");
  window.location.href = "group-management.html";
});
