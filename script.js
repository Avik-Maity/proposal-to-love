
/*
  GOOGLE FORMS SETTINGS
  Replace these placeholders with your real values.
*/

const GOOGLE_FORM_ID = "YOUR_FORM_ID";

const ENTRY_NAME = "entry.YOUR_NAME_ENTRY_ID";
const ENTRY_ANSWER = "entry.YOUR_ANSWER_ENTRY_ID";
const ENTRY_MESSAGE = "entry.YOUR_MESSAGE_ENTRY_ID";

const heading = document.getElementById("heading");
const message = document.getElementById("message");
const continueBtn = document.getElementById("continueBtn");
const responseForm = document.getElementById("responseForm");
const userName = document.getElementById("userName");
const userMessage = document.getElementById("userMessage");
const statusText = document.getElementById("status");
const hearts = document.getElementById("hearts");

let isSubmitting = false;

// Open the proposal form.
continueBtn.addEventListener("click", () => {
  heading.textContent = "You Make Me Smile! 💗";
  message.textContent =
    "There is something special I have wanted to ask you...";

  responseForm.hidden = false;
  continueBtn.hidden = true;

  userName.focus();
  createHearts(8);
});

// Submit a response to Google Forms.
responseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isSubmitting) return;

  if (!responseForm.reportValidity()) return;

  const answer = event.submitter?.dataset.answer;

  if (!["Yes ❤️", "No"].includes(answer)) {
    statusText.textContent = "Please choose Yes or No.";
    return;
  }

  const placeholdersPresent =
    GOOGLE_FORM_ID === "YOUR_FORM_ID" ||
    ENTRY_NAME.includes("YOUR_") ||
    ENTRY_ANSWER.includes("YOUR_") ||
    ENTRY_MESSAGE.includes("YOUR_");

  if (placeholdersPresent) {
    statusText.textContent =
      "Setup incomplete: add your Google Form ID and entry IDs in script.js.";
    return;
  }

  const name = userName.value.trim();
  const note = userMessage.value.trim();

  // Create a hidden iframe to keep the visitor on this page.
  let frame = document.getElementById("googleFormFrame");

  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "googleFormFrame";
    frame.name = "googleFormFrame";
    frame.hidden = true;
    frame.title = "Google Forms response";
    document.body.appendChild(frame);
  }

  const googleForm = document.createElement("form");
  googleForm.method = "POST";
  googleForm.target = frame.name;
  googleForm.action =
    `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
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

  statusText.textContent = "Submitting your response... 💌";

  try {
    googleForm.submit();
    googleForm.remove();

    // The browser cannot verify Google's cross-origin response.
    // This message confirms only that submission was attempted.
    window.setTimeout(() => {
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
        "Submission attempted. Please verify the response in Google Forms.";

      createHearts(answer === "Yes ❤️" ? 25 : 5);
    }, 1200);
  } catch (error) {
    console.error("Google Forms submission error:", error);

    googleForm.remove();
    isSubmitting = false;

    buttons.forEach((button) => {
      button.disabled = false;
    });

    statusText.textContent =
      "Could not submit. Please check your Google Form settings and try again.";
  }
});

function addField(form, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.appendChild(input);
}

// Floating hearts animation.
function createHearts(count = 1) {
  const types = ["❤️", "💕", "💖", "💗", "💘"];

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = types[Math.floor(Math.random() * types.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = 16 + Math.random() * 22 + "px";
    heart.style.animationDuration = 3 + Math.random() * 4 + "s";

    hearts.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

window.setInterval(() => createHearts(1), 1200);
createHearts(8);
