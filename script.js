
const heading = document.getElementById("heading");
const message = document.getElementById("message");
const proposal = document.getElementById("proposal");
const continueBtn = document.getElementById("continueBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hearts = document.getElementById("hearts");

continueBtn.addEventListener("click", () => {
  heading.textContent = "You Make Me Smile! 💗";
  message.textContent =
    "There is something I've wanted to tell you for a while...";

  proposal.hidden = false;
  continueBtn.hidden = true;
});

yesBtn.addEventListener("click", () => {
  heading.textContent = "You Made Me So Happy! 💖";
  message.textContent =
    "Thank you for making this moment unforgettable. " +
    "Here's to more smiles, beautiful memories, and happiness together! 🥰";

  proposal.hidden = true;
  continueBtn.hidden = false;
  continueBtn.textContent = "Forever & Always 💞";

  createHearts(30);
});

continueBtn.addEventListener("click", () => {
  if (continueBtn.textContent === "Forever & Always 💞") {
    heading.textContent = "Forever & Always 💞";
    message.textContent =
      "You are truly special to me. Sending you all my love! ❤️";
    proposal.hidden = true;
  }
});

noBtn.addEventListener("click", () => {
  message.textContent =
    "No pressure at all 😊 Your happiness matters to me. " +
    "Take your time, and know that you're special!";
});

function createHearts(count = 1) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.textContent = ["❤️", "💕", "💖", "💗", "💘"][
      Math.floor(Math.random() * 5)
    ];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = 16 + Math.random() * 22 + "px";
    heart.style.animationDuration = 3 + Math.random() * 4 + "s";

    hearts.appendChild(heart);

    heart.addEventListener("animationend", () => heart.remove());
  }
}

setInterval(() => createHearts(1), 800);