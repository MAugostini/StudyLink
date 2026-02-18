console.log("edit-groups.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];

  // Grab currentGroup (your project sometimes uses different casing)
  let raw =
    localStorage.getItem("currentGroup") ||
    localStorage.getItem("currentgroup");

  if (!raw) {
    if (!groups.length) {
      alert("No group selected to edit.");
      window.location.href = "./find-groups.html";
      return;
    }
    // No explicit currentGroup stored — fall back to the first saved group
    console.warn('No currentGroup in localStorage; falling back to first stored group');
    raw = JSON.stringify(groups[0]);
  }

  let currentGroup = null;

  // currentGroup is saved as JSON in create-group.js
  try {
    currentGroup = JSON.parse(raw);
  } catch {
    // fallback: if it's just a groupName string
    currentGroup = groups.find(g => g.groupName === raw) || null;
  }

  if (!currentGroup) {
    alert("Group not found.");
    window.location.href = "./find-groups.html";
    return;
  }

  // Always use the canonical version from groups[] (not the stale stored object)
  let currIndex = groups.findIndex(g =>
    g.groupName === currentGroup.groupName &&
    (g.leaderUsername || "") === (currentGroup.leaderUsername || "")
  );

  // fallback match just by name
  if (currIndex === -1) {
    currIndex = groups.findIndex(g => g.groupName === currentGroup.groupName);
  }

  if (currIndex === -1) {
    alert("Group not found.");
    window.location.href = "./find-groups.html";
    return;
  }

  currentGroup = groups[currIndex];

  // ---- leader fallback (in case older groups don't have leaderName saved) ----
  let leaderName = currentGroup.leaderName || "";
  if (!leaderName) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const leaderUsername = currentGroup.leaderUsername || "";
    const leaderUser = users.find(u => u.username === leaderUsername);

    if (leaderUser) {
      leaderName = `${leaderUser.firstName || ""} ${leaderUser.lastName || ""}`.trim();
    } else {
      leaderName = leaderUsername || "Unknown";
    }

    // persist the fix so it stays correct next load
    currentGroup.leaderName = leaderName;
    groups[currIndex] = currentGroup;
    localStorage.setItem("groups", JSON.stringify(groups));
  }


  // ---- Populate fields ----
  const groupNameEl = document.getElementById("group-name");
  const leaderNameEl = document.getElementById("leader-name");
  const courseNameEl = document.getElementById("course-name");
  const groupSizeSelect = document
    .getElementById("group-size")
    ?.querySelector("select");

if (groupNameEl) groupNameEl.value = currentGroup.groupName || "";
if (leaderNameEl) leaderNameEl.value = leaderName || "";
if (courseNameEl) courseNameEl.value = currentGroup.courseName || "";
if (groupSizeSelect) groupSizeSelect.value = currentGroup.groupSize || "";

const bioEl = document.getElementById("group-bio-input");
const goalsEl = document.getElementById("group-goals-input");
if (bioEl) bioEl.value = currentGroup.bio || "";
if (goalsEl) goalsEl.value = currentGroup.goals || "";


// lock non-editable fields
if (groupNameEl) groupNameEl.disabled = true;
if (leaderNameEl) leaderNameEl.disabled = true;

  // Meeting time checkboxes
  const mt = currentGroup.meetingTime || [];
  document.querySelectorAll("#meeting-time input[type='checkbox']").forEach(cb => {
    cb.checked = mt.includes(cb.value);
  });

  // Meeting day checkboxes
  const md = currentGroup.meetingDay || [];
  document.querySelectorAll("#meeting-day input[type='checkbox']").forEach(cb => {
    cb.checked = md.includes(cb.value);
  });

  // Meeting preference checkboxes
  const mp = currentGroup.meetingPreference || [];
  document.querySelectorAll("#meeting-preference input[type='checkbox']").forEach(cb => {
    cb.checked = mp.includes(cb.value);
  });

  // ---- Save edits ----
  const form = document.getElementById("edit-group-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

  const editedGroup = {
    ...currentGroup,

    // keep these locked
    leaderName: currentGroup.leaderName,
    leaderUsername: currentGroup.leaderUsername,
    groupName: currentGroup.groupName,

    // editable fields
    groupSize: groupSizeSelect?.value || currentGroup.groupSize,
    courseName: document.getElementById("course-name")?.value || currentGroup.courseName,

    meetingTime: Array.from(document.querySelectorAll("#meeting-time input[type=checkbox]"))
      .filter(cb => cb.checked)
      .map(cb => cb.value),

    meetingDay: Array.from(document.querySelectorAll("#meeting-day input[type=checkbox]"))
      .filter(cb => cb.checked)
      .map(cb => cb.value),

    meetingPreference: Array.from(document.querySelectorAll("#meeting-preference input[type=checkbox]"))
      .filter(cb => cb.checked)
      .map(cb => cb.value),

    // (optional but recommended since your edit page has these inputs)
    bio: document.getElementById("group-bio-input")?.value || currentGroup.bio || "",
    goals: document.getElementById("group-goals-input")?.value || currentGroup.goals || "",
  };


    // Prevent duplicate name if they change groupName
    const nameChanged = editedGroup.groupName !== currentGroup.groupName;
    if (nameChanged) {
      const exists = groups.some((g, i) => i !== currIndex && g.groupName === editedGroup.groupName);
      if (exists) {
        alert("That group name is already taken.");
        return;
      }
    }

    groups[currIndex] = editedGroup;
    localStorage.setItem("groups", JSON.stringify(groups));
    localStorage.setItem("currentGroup", JSON.stringify(editedGroup)); // keep in sync

    alert("Group updated!");
    window.location.href = "./group-management.html";
  });
});
