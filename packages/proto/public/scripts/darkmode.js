const toggleLabel = document.querySelector(".mode-toggle");
const checkbox = document.getElementById("darkModeToggle");

// localStorage saves user browser info
if (localStorage.getItem("darkMode") === "on") {
  document.body.classList.add("dark-mode");
  if (checkbox) checkbox.checked = true;
}

if (toggleLabel) {
  toggleLabel.onchange = function (event) {
    event.stopPropagation();

    const isChecked = event.target.checked;

    const darkModeEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { checked: isChecked },
    });

    event.currentTarget.dispatchEvent(darkModeEvent);
  };
}

document.body.addEventListener("darkmode:toggle", function (event) {
  if (event.detail.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "on");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "off");
  }
});