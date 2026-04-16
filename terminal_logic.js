const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

themeToggleBtn.addEventListener("click", () => {
  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme");
    themeToggleBtn.textContent = " Dark";
  } else {
    body.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = " Light";
  }
});

const textArray = ["I build things for the web.", "I drink too much coffee.", "Welcome to my corner of the internet."];
let textIndex = 0;
let charIndex = 0;
const typewriterElement = document.getElementById("typewriter");

function type() {
  if (charIndex < textArray[textIndex].length) {
    typewriterElement.textContent += textArray[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 50);
  } else {
    setTimeout(erase, 2000);
  }
}

function erase() {
  if (charIndex > 0) {
    typewriterElement.textContent = textArray[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 30);
  } else {
    textIndex++;
    if (textIndex >= textArray.length) textIndex = 0;
    setTimeout(type, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);
});

let vibeLevel = 0;
const vibeBtn = document.getElementById("vibe-btn");
const vibeCountDisplay = document.getElementById("vibe-count");
const vibeProgress = document.getElementById("vibe-progress");

vibeBtn.addEventListener("click", () => {
  if (vibeLevel < 100) {
    vibeLevel += 10;
    vibeCountDisplay.textContent = vibeLevel;
    vibeProgress.style.width = `${vibeLevel}%`;
  }
  
  if (vibeLevel >= 100) {
    vibeBtn.textContent = "Max Vibes Achieved! 🚀";
    vibeBtn.style.backgroundColor = "#10b981";
    vibeProgress.style.backgroundColor = "#10b981";
    vibeBtn.disabled = true;
    vibeBtn.style.cursor = "not-allowed";
  }
});
