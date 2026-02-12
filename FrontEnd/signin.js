console.log("signin.js loaded ✅");

document.getElementById("signin-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const match = users.find(u => u.username === username && u.password === password);

  if (!match) {
    alert("Invalid username or password.");
    return;
  }

  // store who is logged in
  localStorage.setItem("currentUser", JSON.stringify(match));

  window.location.href = "home-loggedin.html"; // or profile.html
});
