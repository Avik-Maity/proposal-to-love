```javascript
// ============================================
// GOOGLE FORMS CONFIGURATION
// Replace these placeholders with your own IDs.
// ============================================

const GOOGLE_FORM_ID = "YOUR_FORM_ID";

const ENTRY_NAME = "entry.YOUR_NAME_ENTRY_ID";
const ENTRY_ANSWER = "entry.YOUR_ANSWER_ENTRY_ID";
const ENTRY_MESSAGE = "entry.YOUR_MESSAGE_ENTRY_ID";

// ============================================
// GET EXISTING WEBSITE ELEMENTS
// ============================================

const heading = document.getElementById("heading");
const message = document.getElementById("message");
const continueBtn = document.getElementById("continueBtn");
const responseForm = document.getElementById("responseForm");
const userName = document.getElementById("userName");
const userMessage = document.getElementById("userMessage");
const statusText = document.getElementById("status");
const hearts = document.getElementById("hearts");

let selectedAnswer = "";
let isSubmitting = false;

// ============================================
// OPEN PROPOSAL FORM
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
// RECORD WHICH ANSWER WAS CLICKED
// ============================================

responseForm.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-answer]");

  if (button) {
    selectedAnswer = button.dataset.answer;
  }
});

// ============================================
// SUBMIT RESPONSE TO GOOGLE FORMS
// ============================================

responseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  if (!responseForm.reportValidity()) return;

  if (!["Yes ❤️", "No"].includes(selectedAnswer)) {
    statusText.textContent = "Please choose Yes or No.";
    return;
  }

  if (
    GOOGLE_FORM_ID === "YOUR_FORM_ID" ||
    ENTRY_NAME.includes("YOUR_") ||
    ENTRY_ANSWER.includes("YOUR_") ||
    ENTRY_MESSAGE.includes("YOUR_")
  ) {
    statusText.textContent =
      "Google Forms setup is incomplete. Please configure the form IDs.";
    return;
  }

  const answer = selectedAnswer;
  const name = userName.value.trim();
  const note = userMessage.value.trim();

  // Create a hidden iframe so the visitor stays on this website.
  let frame = document.getElementById("googleFormFrame");

  if (!frame) {
    frame = document.createElement("iframe");
    frame.name = "googleFormFrame";
    frame.id = "googleFormFrame";
    frame.hidden = true;
    frame.title = "Google Forms submission";
    document.body.appendChild(frame);
  }

  // Build a form that posts directly to Google Forms.
  const googleForm = document.createElement("form");

  googleForm.method = "POST";
  googleForm.action =
    `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
  googleForm.target = "googleFormFrame";
  googleForm.hidden = true;

  addField(googleForm, ENTRY_NAME, name);
  addField(googleForm, ENTRY_ANSWER, answer);
  addField(googleForm, ENTRY_MESSAGE, note);

  document.body.appendChild(googleForm);

  isSubmitting = true;

  const buttons = responseForm.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = true;
  });

  statusText.textContent = "Sending your response... 💌";

  try {
    googleForm.submit();
    googleForm.remove();

    // Cross-origin restrictions prevent this page from verifying
    // Google's response. This is a submission attempt, not proof
    // that Google accepted the response.
    setTimeout(() => {
      heading.textContent =
        answer === "Yes ❤️"
          ? "Thank You! 💖"
          : "Thank You for Being Honest ❤️";

      message.textContent =
        answer === "Yes ❤️"
          ? "Thank you for sharing this special moment with me! 🥰"
          : "Thank you for sharing your feelings. I respect your answer.";

      responseForm.hidden = true;
      continueBtn.hidden = true;

      statusText.textContent =
        "Your response was sent for submission. Thank you! ❤️";

      createHearts(answer === "Yes ❤️" ? 25 : 5);
    }, 1000);
  } catch (error) {
    console.error("Google Forms submission error:", error);

    googleForm.remove();
    isSubmitting = false;

    buttons.forEach((button) => {
      button.disabled = false;
    });

    statusText.textContent =
      "Something went wrong. Please try again.";
  }
});

// Helper for adding Google Forms fields.
function addField(form, fieldName, value) {
  const input = document.createElement("input");

  input.type = "hidden";
  input.name = fieldName;
  input.value = value;

  form.appendChild(input);
}

// ============================================
// FLOATING HEARTS
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

    heart.addEventListener("animationend", () => heart.remove());
  }
}

setInterval(() => createHearts(1), 1200);

createHearts(8);
```
