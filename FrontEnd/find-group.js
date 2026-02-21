document.addEventListener("DOMContentLoaded", () => {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  const currentUser = localStorage.getItem("currentUser");
  const groupsGrid = document.getElementById("groups-grid");
  const searchBar = document.getElementById("search-bar");

  // Check if user is logged in
  if (!currentUser) {
    window.location.href = "signin.html";
    return;
  }

  // Function to render groups
  function renderGroups(groupsToRender) {
    groupsGrid.innerHTML = "";

    if (groupsToRender.length === 0) {
      groupsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: rgba(229,231,235,0.75);">No groups found.</div>';
      return;
    }

    groupsToRender.forEach(group => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <h3>${group.groupName || "Unnamed Group"}</h3>
        <div class="group-details">
          <p><strong>Course:</strong> ${group.courseName || "N/A"}</p>
          <p><strong>Leader:</strong> ${group.leaderName || "Unknown"}</p>
          <p><strong>Size:</strong> ${group.groupSize || "N/A"}</p>
          <p><strong>Members:</strong> ${group.members?.length || 1}</p>
          <p><strong>Meeting Times:</strong> ${(group.meetingTime || []).join(", ") || "N/A"}</p>
          <p><strong>Days:</strong> ${(group.meetingDay || []).join(", ") || "N/A"}</p>
        </div>
      `;
      card.addEventListener("click", () => {
        localStorage.setItem("selectedGroup", JSON.stringify(group));
        window.location.href = "group-management.html";
      });
      groupsGrid.appendChild(card);
    });
  }

  // Function to filter and search groups
  function filterGroups(searchTerm) {
    const filtered = groups.filter(group => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (group.groupName || "").toLowerCase().includes(searchLower) ||
        (group.courseName || "").toLowerCase().includes(searchLower) ||
        (group.leaderName || "").toLowerCase().includes(searchLower)
      );
    });
    renderGroups(filtered);
  }

  // Initial render
  renderGroups(groups);

  // Search functionality
  searchBar.addEventListener("input", (e) => {
    filterGroups(e.target.value);
  });
});

