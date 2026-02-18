const groups = JSON.parse(localStorage.getItem("groups")) || [];
const currUsername = localStorage.getItem("currentUser");

if (!currentUsername) {
  window.location.href = "signin.html";
}

//Link objects in database elements together on PK and FK
const currUser = users.find(u => u.username === currUsername);
const currUID = currUser.UID;
const currProfile = currentUser.find(u => u.UID === currUID);
const currPID = currProfile.PID;
const currPreference = currProfile.find(u => u.PID === currPID);

//List of courses user is taking
const courseList = currProfile.courses || [];
//List of user's preferred availability
const availabilityList = currPreference.availability || [];

const outputCourseList = [];

//adds if user is enrolled in the same course and has availability during meeting time
for (let i = 0; i < groups.length; i ++) {
    if (courseList.includes(groups[i]) && availabilityList.includes(groups[i].meetingTime)) {
        outputCourseList.push(groups[i]);
    }
}

