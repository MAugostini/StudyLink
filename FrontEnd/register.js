document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    /* ==========================
       BASIC TEXT INPUTS
    ========================== */
    const Fname = document.getElementById("Fname").value.trim();
    const Lname = document.getElementById("Lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const school = document.getElementById("school").value.trim();
    const major = document.getElementById("major").value.trim();

    /* ==========================
       DROPDOWN (School Year)
    ========================== */
    const schoolYear = Number(
      document.getElementById("schoolYear").value
    );

    /* ==========================
       CHECKBOXES (Study Style)
    ========================== */
    const studyStyle = Array.from(
      document.querySelectorAll('input[name="studyStyle"]:checked')
    ).map(cb => cb.value);

    /* ==========================
       AVAILABILITY (checkboxes)
    ========================== */
    const days = Array.from(
      document.querySelectorAll('input[name="days"]:checked')
    ).map(cb => cb.value);

    const time = Array.from(
      document.querySelectorAll('input[name="time"]:checked')
    ).map(cb => cb.value);

    /* ==========================
       COURSES (comma separated)
    ========================== */
    const coursesInput = document.getElementById("courses").value;
    const courses = coursesInput
      .split(",")
      .map(course => course.trim())
      .filter(course => course !== "");

    /* ==========================
       FINAL OBJECT (MATCHES SCHEMA)
    ========================== */
    const studentData = {
      Fname,
      Lname,
      email,
      username,
      password,
      school,
      major,
      schoolYear,
      courses,
      availability: {
        days,
        time
      },
      preferences: {
        studyStyle,
        groupSize: Number(
          document.getElementById("groupSize").value
        )
      }
    };

    console.log("Sending to server:", studentData);

    /* ==========================
       SEND TO EXPRESS
    ========================== */
    try {
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Registration failed");
        return;
      }

      alert("Student registered successfully!");
      form.reset();

    } catch (error) {
      console.error("Error:", error);
      alert("Server connection failed");
    }
  });
});
