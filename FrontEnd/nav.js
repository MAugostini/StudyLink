document.addEventListener("DOMContentLoaded", () => {
  const brandLink = document.getElementById("brand-link");

  if (brandLink) {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      brandLink.href = "home-loggedin.html";   // logged in version
    } else {
      brandLink.href = "home.html";            // public version
    }
  }

  // Search bar functionality
  const searchBars = document.querySelectorAll(".nav-search");
  searchBars.forEach(searchBar => {
    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const searchTerm = searchBar.value.trim().toLowerCase();
        if (!searchTerm) return;

        const groups = JSON.parse(localStorage.getItem("groups")) || [];
        const matchedGroup = groups.find(group =>
          (group.groupName || "").toLowerCase() === searchTerm
        );

        if (matchedGroup) {
          localStorage.setItem("selectedGroup", JSON.stringify(matchedGroup));
          window.location.href = "group-management.html";
        } else {
          alert("Group not found. Please try another search.");
        }
      }
    });
  });
});

// logs user out when they click logout button.
document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("selectedGroup");
  window.location.href = "login.html";
});
