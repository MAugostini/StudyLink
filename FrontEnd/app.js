const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public")); // serves register.html

app.listen(3000, () => console.log("Server running on port 3000"));

const studyStyle = Array.from(
  document.querySelectorAll('input[name="studyStyle"]:checked')
).map(cb => cb.value);
