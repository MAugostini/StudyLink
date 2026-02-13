console.log("register.js loaded ✅");

const form = document.getElementById("register-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value.trim();
  console.log(document.getElementById("first-name"));

  const lastName = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const major = document.getElementById("major").querySelector("select").value;
  const schoolYear = document.getElementById("school-year").querySelector("select").value;
  const groupSize = document.getElementById("group-size").querySelector("select").value;
  const availability = Array.from(document.querySelectorAll("#availability input[type=checkbox]"))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
  const meetingPreference = Array.from(document.querySelectorAll("#meeting-preference input[type=checkbox]"))
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // prevent duplicate username/email
  const exists = users.some(u => u.username === username || u.email === email);
  if (exists) {
    alert("That username or email is already registered.");
    return;
  }

  const newUser = {
  firstName,
  lastName,
  email,
  username,
  password,
  major,
  schoolYear,
  groupSize,
  availability,
  meetingPreference
};

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered! Now log in.");
  window.location.href = "signin.html";
});
