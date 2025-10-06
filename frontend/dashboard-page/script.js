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
    if (!datePicker.contains(e.target) && e.target !== taskDate)
      datePicker.classList.add("hidden");
    if (!timePicker.contains(e.target) && e.target !== taskTime)
      timePicker.classList.add("hidden");
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
  const tasksList = document.getElementById("tasks");

  let taskPriorityValue = "";
  let taskStatusValue = "";

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
  }

  tasksList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-task")) {
      const index = e.target.dataset.index;
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  });

  renderTasks();

  // --------- CUSTOM DROPDOWNS ---------
  document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
    const selected = dropdown.querySelector(".dropdown-selected");
    const options = dropdown.querySelector(".dropdown-options");

    selected.addEventListener("click", () => {
      options.classList.toggle("hidden");
    });

    options.querySelectorAll(".dropdown-option").forEach((option) => {
      option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        options.classList.add("hidden");

        // Set values
        if (dropdown.id === "task-priority-dropdown") {
          taskPriorityValue = option.dataset.value;
        } else if (dropdown.id === "task-status-dropdown") {
          taskStatusValue = option.dataset.value;
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) options.classList.add("hidden");
    });
  });

  // --------- CUSTOM DATE PICKER ---------
  const datePicker = document.getElementById("date-picker");
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  taskDate.addEventListener("click", (e) => {
    e.stopPropagation();
    datePicker.classList.toggle("hidden");
    renderCalendar(currentYear, currentMonth);
  });

  function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let html = `
      <div class="calendar-header">
        <button id="prev-month" class="month-btn" title="Previous Month">&lt;</button>
        <span class="month-label">${new Date(year, month).toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        )}</span>
        <button id="next-month" class="month-btn" title="Next Month">&gt;</button>
      </div>`;

    html += "<table><tr>";
    for (let d of days) html += `<th>${d}</th>`;
    html += "</tr><tr>";

    for (let i = 0; i < firstDay; i++) html += "<td></td>";
    for (let day = 1; day <= daysInMonth; day++) {
      html += `<td>${day}</td>`;
      if ((day + firstDay) % 7 === 0) html += "</tr><tr>";
    }
    html += "</tr></table>";

    datePicker.innerHTML = html;

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

    document.getElementById("prev-month").addEventListener("click", () => {
      month--;
      if (month < 0) {
        month = 11;
        year--;
      }
      renderCalendar(year, month);
    });

    document.getElementById("next-month").addEventListener("click", () => {
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
      renderCalendar(year, month);
    });
  }

  // --------- CUSTOM TIME PICKER ---------
  const timePicker = document.getElementById("time-picker");
  const hourSlider = document.getElementById("time-hour");
  const minuteSlider = document.getElementById("time-minute");
  const timeDisplay = document.getElementById("time-display");
  const timeSetBtn = document.getElementById("time-set");

  function updateTimeDisplay() {
    const hh = String(hourSlider.value).padStart(2, "0");
    const mm = String(minuteSlider.value).padStart(2, "0");
    timeDisplay.textContent = `${hh}:${mm}`;
  }

  taskTime.addEventListener("click", (e) => {
    e.stopPropagation();
    timePicker.classList.toggle("hidden");
    updateTimeDisplay();
  });

  hourSlider.addEventListener("input", updateTimeDisplay);
  minuteSlider.addEventListener("input", updateTimeDisplay);

  timeSetBtn.addEventListener("click", () => {
    taskTime.value = timeDisplay.textContent;
    timePicker.classList.add("hidden");
  });

  datePicker.addEventListener("click", (e) => e.stopPropagation());
  timePicker.addEventListener("click", (e) => e.stopPropagation());

  // --------- SUBMIT TASK FORM ---------
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!taskDate.value || !taskTime.value) {
      alert("Please select both date and time");
      return;
    }
    if (!taskPriorityValue || !taskStatusValue) {
      alert("Please select priority and status");
      return;
    }

    const [dd, mm, yyyy] = taskDate.value.split("-");
    const datetimeISO = `${yyyy}-${mm}-${dd}T${taskTime.value}`;

    const newTask = {
      title: taskTitle.value,
      description: taskDescription.value,
      datetime: datetimeISO,
      priority: taskPriorityValue,
      status: taskStatusValue,
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    addTaskForm.reset();

    // Reset custom dropdown display
    document.querySelectorAll(".custom-dropdown .dropdown-selected").forEach(
      (sel) => (sel.textContent = sel.id.includes("priority") ? "Select Priority" : "Select Status")
    );
    taskPriorityValue = "";
    taskStatusValue = "";
  });
});
