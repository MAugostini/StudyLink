const currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "login.html";
