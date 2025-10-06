document.addEventListener("DOMContentLoaded", () => {
  // === Elements ===
  const profileContainer = document.getElementById("profile-container");
  const profileDropdown = document.getElementById("profile-dropdown");
  const profileUsername = document.getElementById("profile-username");
  const logoutButton = document.getElementById("logout-button");
  const profileIcon = document.getElementById("profile-icon");
  const profileUpload = document.getElementById("profile-upload");
  const profileEditOverlay = document.getElementById("profile-edit-overlay");

  // === Load Username ===
  const firstName = localStorage.getItem("firstName") || "Hemanth";
  const lastName = localStorage.getItem("lastName") || "D";
  profileUsername.textContent = `Hello, ${firstName} ${lastName}!`;

  // === Load Profile Picture ===
  const savedProfilePic = localStorage.getItem("profilePic");
  if (savedProfilePic) profileIcon.src = savedProfilePic;

  // === Toggle Dropdown ===
  profileIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("hidden");

    profileIcon.setAttribute(
      "aria-expanded",
      profileDropdown.classList.contains("hidden") ? "false" : "true"
    );
  });

  // === Profile Picture Upload via Overlay Click ===
  profileEditOverlay.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent dropdown toggle
    profileUpload.click();
  });

  profileUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      profileIcon.src = evt.target.result;
      localStorage.setItem("profilePic", evt.target.result);
    };
    reader.readAsDataURL(file);
  });

  // === Close Dropdown when Clicking Outside ===
  document.addEventListener("click", (e) => {
    if (!profileDropdown.classList.contains("hidden") && !profileContainer.contains(e.target)) {
      profileDropdown.classList.add("hidden");
      profileIcon.setAttribute("aria-expanded", "false");
    }
  });

  // Prevent clicks inside dropdown from closing it
  profileDropdown.addEventListener("click", (e) => e.stopPropagation());

  // === Logout ===
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("profilePic");
    window.location.href = "../authentication-page/index.html";
  });
});
