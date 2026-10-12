
// ============================================
// EMAILJS CONFIGURATION
// Replace these 3 values with your own values.
// ============================================

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// Initialize EmailJS only when configured.
const emailConfigured =
  EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
  EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
  EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID";

if (emailConfigured && window.emailjs) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });
}

// ============================================
// GET HTML ELEMENTS
// ============================================

const heading = document.getElementById("heading");
const message = document.getElementById("message");
const continueBtn = document.getElementById("continueBtn");
const responseForm = document.getElementById("responseForm");
const userName = document.getElementById("userName");
const userMessage = document.getElementById("userMessage");
const statusText = document.getElementById("status");
const hearts = document.getElementById("hearts");

// Remember which response the visitor selected.
let selectedAnswer = "";

// ============================================
// OPEN THE PROPOSAL FORM
// ============================================

continueBtn.addEventListener("click", () => {
  heading.textContent = "You Make Me Smile! 💗";

  message.textContent =
    "There is something special I have wanted to ask you...";

  responseForm.hidden = false;
  continueBtn.hidden = true;

  userName.focus();
  createHearts(8);
});

// ============================================
// HANDLE YES / NO SUBMISSION
// ============================================

responseForm.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-answer]");

  if (button) {
    selectedAnswer = button.dataset.answer;
  }
});

responseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!["Yes ❤️", "No"].includes(selectedAnswer)) {
    statusText.textContent = "Please select Yes or No.";
    return;
  }

  if (!responseForm.reportValidity()) {
    return;
  }

  if (!emailConfigured || !window.emailjs) {
    statusText.textContent =
      "Email notifications are not configured yet. Please try again later.";
    return;
  }

  const answer = selectedAnswer;

  const templateParams = {
    user_name: userName.value.trim(),
    proposal_response: answer,
    message: userMessage.value.trim()
  };

  const buttons = responseForm.querySelectorAll("button");

  buttons.forEach((button) => {
    button.disabled = true;
  });

  statusText.textContent = "Sending your response... 💌";

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (answer === "Yes ❤️") {
      heading.textContent = "You Made Me So Happy! 💖";
      message.textContent =
        "Thank you for sharing this special moment with me! 🥰";

      createHearts(30);
    } else {
      heading.textContent = "Thank You for Being Honest ❤️";
      message.textContent =
        "Thank you for sharing your feelings. I respect your answer.";

      createHearts(5);
    }

    responseForm.hidden = true;
    continueBtn.hidden = true;
    statusText.textContent = "";
  } catch (error) {
    console.error("EmailJS error:", error);

    statusText.textContent =
      "Sorry, your response could not be sent. Please try again later.";

    buttons.forEach((button) => {
      button.disabled = false;
    });
  }
});

// ============================================
// FLOATING HEART ANIMATION
// ============================================

function createHearts(count = 1) {
  const heartTypes = ["❤️", "💕", "💖", "💗", "💘"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent =
      heartTypes[Math.floor(Math.random() * heartTypes.length)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = 16 + Math.random() * 22 + "px";
    heart.style.animationDuration = 3 + Math.random() * 4 + "s";

    hearts.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }
}

// Add floating hearts periodically.
setInterval(() => {
  createHearts(1);
}, 1200);

// Initial animation.
createHearts(8);

