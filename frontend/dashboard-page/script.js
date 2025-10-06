document.addEventListener("DOMContentLoaded", () => {
  // --------- PROFILE LOGIC ---------
  const profileContainer = document.getElementById("profile-container");
  const profileDropdown = document.getElementById("profile-dropdown");
  const profileUsername = document.getElementById("profile-username");
  const logoutButton = document.getElementById("logout-button");
  const profileIcon = document.getElementById("profile-icon");
  const profileUpload = document.getElementById("profile-upload");
  const profileEditOverlay = document.getElementById("profile-edit-overlay");

  const firstName = localStorage.getItem("firstName") || "Hemanth";
  const lastName = localStorage.getItem("lastName") || "D";
  profileUsername.textContent = `Hello, ${firstName} ${lastName}!`;

  const savedProfilePic = localStorage.getItem("profilePic");
  if (savedProfilePic) profileIcon.src = savedProfilePic;

  profileIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("hidden");
    profileIcon.setAttribute(
      "aria-expanded",
      profileDropdown.classList.contains("hidden") ? "false" : "true"
    );
  });

  profileEditOverlay.addEventListener("click", (e) => {
    e.stopPropagation();
    profileUpload.click();
  });

  profileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      profileIcon.src = evt.target.result;
      localStorage.setItem("profilePic", evt.target.result);
    };
    reader.readAsDataURL(file);
  });

  document.addEventListener("click", (e) => {
    if (
      !profileDropdown.classList.contains("hidden") &&
      !profileContainer.contains(e.target)
    ) {
      profileDropdown.classList.add("hidden");
      profileIcon.setAttribute("aria-expanded", "false");
    }
  });

  profileDropdown.addEventListener("click", (e) => e.stopPropagation());

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("profilePic");
    window.location.href = "../authentication-page/index.html";
  });

  // --------- TASK ELEMENTS ---------
  const addTaskForm = document.getElementById("add-task-form");
  const taskTitle = document.getElementById("task-title");
  const taskDescription = document.getElementById("task-description");
  const taskDate = document.getElementById("task-date");
  const taskTime = document.getElementById("task-time");
  const taskPriority = document.getElementById("task-priority");
  const taskStatus = document.getElementById("task-status");
  const tasksList = document.getElementById("tasks");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function renderTasks() {
    tasksList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      const dateObj = new Date(task.datetime);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedDate = dateObj.toLocaleString(undefined, options);

      li.innerHTML = `
        <div>
          <strong>${task.title}</strong> 
          <span style="color: gray;">[${task.status}]</span><br>
          <small>${formattedDate}</small><br>
          <em>${task.description || ""}</em><br>
          <strong>Priority:</strong> ${task.priority}
        </div>
        <button class="delete-task" data-index="${index}">✕</button>
      `;
      tasksList.appendChild(li);
    });

    document.querySelectorAll(".delete-task").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
    });
  }

  // --------- CUSTOM DATE PICKER ---------
  const datePicker = document.getElementById("date-picker");

  taskDate.addEventListener("click", (e) => {
    e.stopPropagation();
    datePicker.classList.toggle("hidden");
    generateCalendar(new Date());
  });

  function generateCalendar(currentDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const tableParts = [];

    tableParts.push("<table>");
    tableParts.push("<tr>");
    for (let d of days) tableParts.push(`<th>${d}</th>`);
    tableParts.push("</tr><tr>");

    for (let i = 0; i < firstDay; i++) tableParts.push("<td></td>");

    for (let day = 1; day <= daysInMonth; day++) {
      tableParts.push(`<td>${day}</td>`);
      if ((day + firstDay) % 7 === 0) tableParts.push("</tr><tr>");
    }

    tableParts.push("</tr></table>");

    datePicker.innerHTML = tableParts.join(""); // join without extra whitespace

    datePicker.querySelectorAll("td").forEach((cell) => {
      if (cell.textContent) {
        cell.addEventListener("click", () => {
          const dd = String(cell.textContent).padStart(2, "0");
          const mm = String(month + 1).padStart(2, "0");
          const yyyy = year;
          taskDate.value = `${dd}-${mm}-${yyyy}`;
          datePicker.classList.add("hidden");
        });
      }
    });
  }

  // --------- CUSTOM TIME PICKER ---------
  const timePicker = document.getElementById("time-picker");
  const hourSlider = document.getElementById("time-hour");
  const minuteSlider = document.getElementById("time-minute");
  const timeDisplay = document.getElementById("time-display");
  const timeSetBtn = document.getElementById("time-set");

  taskTime.addEventListener("click", (e) => {
    e.stopPropagation(); // <-- important
    timePicker.classList.toggle("hidden");
    updateTimeDisplay();
  });

  function updateTimeDisplay() {
    const hh = String(hourSlider.value).padStart(2, "0");
    const mm = String(minuteSlider.value).padStart(2, "0");
    timeDisplay.textContent = `${hh}:${mm}`;
  }

  hourSlider.addEventListener("input", updateTimeDisplay);
  minuteSlider.addEventListener("input", updateTimeDisplay);

  timeSetBtn.addEventListener("click", () => {
    taskTime.value = timeDisplay.textContent;
    timePicker.classList.add("hidden");
  });

  // --------- CLOSE PICKERS WHEN CLICKING OUTSIDE ---------
  datePicker.addEventListener("click", (e) => e.stopPropagation());
  timePicker.addEventListener("click", (e) => e.stopPropagation());

  // --------- SUBMIT TASK FORM ---------
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!taskDate.value || !taskTime.value) {
      alert("Please select both date and time");
      return;
    }
    const [dd, mm, yyyy] = taskDate.value.split("-");
    const datetimeISO = `${yyyy}-${mm}-${dd}T${taskTime.value}`;
    const newTask = {
      title: taskTitle.value,
      description: taskDescription.value,
      datetime: datetimeISO,
      priority: taskPriority.value,
      status: taskStatus.value,
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    addTaskForm.reset();
  });

  renderTasks();
});
