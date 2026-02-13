document.addEventListener("DOMContentLoaded", () => {
  const brandLink = document.getElementById("brand-link");

  if (!brandLink) return;

  const currentUser = localStorage.getItem("currentUser");

  if (currentUser) {
    brandLink.href = "home-loggedin.html";   // logged in version
  } else {
    brandLink.href = "home.html";            // public version
  }
});
