// ------------------- DOM ELEMENTS -------------------
const questionEl = document.getElementById("question");
const questionNrSpan = document.querySelector("#question-nr span");
const currentQuestionSpan = document.getElementById("current-question");
const buttonsContainer = document.getElementById("button");
const welcomeLine1 = document.querySelector(".welcome-line-1");
const welcomeLine2 = document.querySelector(".welcome-line-2");
const pickSubjectText = document.getElementById("pick-subject-text");
const submitBtn = document.getElementById("submitBtn");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.querySelector(".progress-container");

const categoryImage = document.querySelector("#catImage img");
const categoryName = document.querySelector("#categoryName span");
const categoryContainer = document.querySelector(".category");
const toggleContainer = document.querySelector(".toggle-container");

const endBox = document.getElementById("quiz-end-box");
const endCategoryIcon = document.getElementById("end-category-icon");
const endCategoryName = document.getElementById("end-category-name");
const endScore = document.getElementById("end-score");
const endTotal = document.getElementById("end-total");
const playAgainBtn = document.getElementById("play-again-btn");


// ------------------- QUIZ STATE -------------------
let quizData = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;
let selectedCategory = null;
let quizStarted = false;
let isSubmitted = false;

const categoryIcons = {
  HTML: "assets/images/icon-html.svg",
  CSS: "assets/images/icon-css.svg",
  JavaScript: "assets/images/icon-js.svg",
  Accessibility: "assets/images/icon-accessibility.svg",
};

// ------------------- INIT TOGGLE SWITCH -------------------
function initToggleSwitch() {
  if (!toggleContainer) return;

  toggleContainer.innerHTML = `
    <label class="toggle-switch">
      <input type="checkbox" id="themeToggle">
      <span class="slider"></span>
    </label>
  `;

  const themeToggle = document.getElementById("themeToggle");

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.documentElement.classList.add("dark");
      applyDarkMode();
    } else {
      document.documentElement.classList.remove("dark");
      applyLightMode();
    }
  });

  themeToggle.checked = document.documentElement.classList.contains("dark");
  if (themeToggle.checked) applyDarkMode();
  else applyLightMode();
}

// ------------------- APPLY DARK / LIGHT MODE -------------------
function applyDarkMode() {
  document.body.style.background = "#313e51";
  document.body.style.backgroundImage = 'url("assets/images/pattern-background-mobile-dark.svg")';
  if (welcomeLine1) welcomeLine1.style.color = "white";
  if (welcomeLine2) welcomeLine2.style.color = "white";
  if (pickSubjectText) pickSubjectText.style.color = "#abc1e1";
  if (currentQuestionSpan) currentQuestionSpan.style.color = "white";
  if (categoryName) categoryName.style.color = "white";

  if (progressContainer) progressContainer.style.backgroundColor = "#3b4d66";
  if (progressBar) progressBar.style.backgroundColor = "purple";

  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.style.backgroundColor = "#3b4d66";
    btn.style.color = "white";
  });

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.style.backgroundColor = "#3b4d66";
    btn.style.color = "white";
  });

  // Score box dark mode (if visible)
  if (endBox && !endBox.classList.contains("hidden")) {
    endBox.style.backgroundColor = "#3b4d66";
    endBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
    if (endCategoryName) endCategoryName.style.color = "white";
    if (endScore) endScore.style.color = "white";
    if (endTotal) endTotal.style.color = "#abc1e1";
  }
}

function applyLightMode() {
  document.body.style.background = "var(--grey-50)";
  document.body.style.backgroundImage = 'url("assets/images/pattern-background-mobile-light.svg")';
  if (welcomeLine1) welcomeLine1.style.color = "black";
  if (welcomeLine2) welcomeLine2.style.color = "black";
  if (pickSubjectText) pickSubjectText.style.color = "black";
  if (currentQuestionSpan) currentQuestionSpan.style.color = "black";
  if (categoryName) categoryName.style.color = "black";

  if (progressContainer) progressContainer.style.backgroundColor = "";
  if (progressBar) progressBar.style.backgroundColor = "purple";

  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.style.backgroundColor = "";
    btn.style.color = "black";
  });

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.style.backgroundColor = "";
    btn.style.color = "black";
  });

  // Score box light mode (if visible)
  if (endBox && !endBox.classList.contains("hidden")) {
    endBox.style.backgroundColor = "white";
    endBox.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    if (endCategoryName) endCategoryName.style.color = "#313e51";
    if (endScore) endScore.style.color = "#313e51";
    if (endTotal) endTotal.style.color = "#626c7f";
  }
}

// ------------------- FETCH QUIZ DATA -------------------
fetch("data.json")
  .then(res => res.ok ? res.json() : Promise.reject("Failed to load data.json"))
  .then(data => {
    quizData = data.quizzes;
    showCategories();
  })
  .catch(err => console.error("Error loading data:", err));

// ------------------- SHOW CATEGORIES -------------------
function showCategories() {
  buttonsContainer.innerHTML = "";
  currentQuiz = null;
  currentQuestionIndex = 0;
  selectedCategory = null;
  score = 0;
  selectedAnswer = null;
  quizStarted = false;
  isSubmitted = false;

  if (playAgainBtn) playAgainBtn.style.display = "none";

  submitBtn.style.display = "block";
  submitBtn.textContent = "Start Quiz";

  welcomeLine1?.classList.remove("hidden");
  welcomeLine2?.classList.remove("hidden");
  pickSubjectText?.classList.remove("hidden");

  progressContainer.style.display = "none";
  progressBar.style.width = "0%";

  questionNrSpan.parentElement.classList.add("hidden");
  currentQuestionSpan.classList.add("hidden");

  if (categoryContainer) categoryContainer.style.display = "none";
  toggleContainer?.classList.remove("hidden");
  endBox.classList.add("hidden");

  quizData.forEach(quiz => {
    const btn = document.createElement("button");
    btn.className = "quiz-button category-btn";
    const iconPath = categoryIcons[quiz.title] || "assets/images/icon-default.svg";
    btn.innerHTML = `
      <img src="${iconPath}" alt="${quiz.title} icon" class="category-icon" />
      <span class="category-name Text-Preset-4-Mobile bold">${quiz.title}</span>
    `;
    btn.addEventListener("click", () => {
      selectedCategory = quiz;
      Array.from(buttonsContainer.querySelectorAll(".quiz-button")).forEach(b => {
        b.classList.remove("selected");
        b.style.border = "";
      });
      btn.classList.add("selected");
      btn.style.border = "2px solid purple";
      updateHeader(quiz.title);
      if (categoryContainer) categoryContainer.style.display = "flex";
    });
    buttonsContainer.appendChild(btn);
  });

  if (document.documentElement.classList.contains("dark")) {
    document.querySelectorAll(".category-btn").forEach(btn => {
      btn.style.backgroundColor = "#3b4d66";
      btn.style.color = "white";
    });
  }
}

// ------------------- START QUIZ -------------------
function startQuiz() {
  if (!selectedCategory) {
    alert("⚠️ Please select a category!");
    return;
  }
  currentQuiz = selectedCategory;
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = null;
  quizStarted = true;
  isSubmitted = false;

  welcomeLine1?.classList.add("hidden");
  welcomeLine2?.classList.add("hidden");
  pickSubjectText?.classList.add("hidden");

  progressContainer.style.display = "block";
  if (categoryContainer) categoryContainer.style.display = "flex";

  endBox.classList.add("hidden");
  updateHeader(currentQuiz.title);
  showQuestion();
}

// ------------------- UPDATE HEADER -------------------
function updateHeader(title) {
  if (!categoryImage || !categoryName) return;
  categoryImage.src = categoryIcons[title] || "assets/images/icon-default.svg";
  categoryName.textContent = title;
  categoryName.className = "Text-Preset-4-Mobile bold";
  categoryName.style.color = document.documentElement.classList.contains("dark") ? "white" : "black";
}

// ------------------- SHOW QUESTION -------------------
function showQuestion() {
  if (!currentQuiz) return;
  const questionObj = currentQuiz.questions[currentQuestionIndex];

  questionNrSpan.parentElement.classList.remove("hidden");
  questionNrSpan.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
  currentQuestionSpan.classList.remove("hidden");
  currentQuestionSpan.textContent = questionObj.question;
  currentQuestionSpan.style.color = document.documentElement.classList.contains("dark") ? "white" : "black";

  const progressPercent = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  progressContainer.style.backgroundColor = document.documentElement.classList.contains("dark") ? "#3b4d66" : "";
  progressBar.style.backgroundColor = "purple";

  buttonsContainer.innerHTML = "";
  selectedAnswer = null;
  isSubmitted = false;

  questionObj.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-button option-btn";
    btn.dataset.option = option;

    const leftBox = document.createElement("span");
    leftBox.className = "left-box bold";
    leftBox.textContent = String.fromCharCode(65 + i);
    leftBox.style.backgroundColor = "";
    leftBox.style.color = "black";

    const optionText = document.createElement("span");
    optionText.className = "option-text bold";
    optionText.textContent = option;

    const iconSpan = document.createElement("span");
    iconSpan.className = "option-icon";
    iconSpan.style.marginLeft = "auto";
    iconSpan.style.display = "flex";
    iconSpan.style.alignItems = "center";

    btn.appendChild(leftBox);
    btn.appendChild(optionText);
    btn.appendChild(iconSpan);

    if (document.documentElement.classList.contains("dark")) {
      btn.style.backgroundColor = "#3b4d66";
      btn.style.color = "white";
    }

    btn.addEventListener("click", () => selectOption(btn, option));
    buttonsContainer.appendChild(btn);
  });

  submitBtn.textContent = "Submit Answer";
}

// ------------------- SELECT OPTION -------------------
function selectOption(button, option) {
  if (isSubmitted) return;
  selectedAnswer = option;

  buttonsContainer.querySelectorAll(".quiz-button").forEach(btn => {
    btn.classList.remove("selected");
    btn.style.border = "";
  });

  button.classList.add("selected");
  button.style.border = "2px solid purple";
}

// ------------------- SUBMIT BUTTON -------------------
submitBtn.addEventListener("click", () => {
  if (!quizStarted) {
    startQuiz();
    return;
  }

  const optionButtons = buttonsContainer.querySelectorAll(".quiz-button");

  if (!isSubmitted) {
   const errorDiv = document.getElementById("submit-error");
if (!selectedAnswer) {
  if (errorDiv) errorDiv.classList.remove("hidden"); // show error
  return;
} else {
  if (errorDiv) errorDiv.classList.add("hidden"); // hide error if previously shown
}

    const correctAnswer = currentQuiz.questions[currentQuestionIndex].answer;

    optionButtons.forEach(btn => {
      const leftBox = btn.querySelector(".left-box");
      const iconSpan = btn.querySelector(".option-icon");
      btn.classList.remove("correct-answer", "wrong-answer", "selected");
      btn.style.border = "none";
      leftBox.style.backgroundColor = "";
      leftBox.style.color = document.documentElement.classList.contains("dark") ? "white" : "black";
      iconSpan.innerHTML = "";
      btn.style.backgroundColor = document.documentElement.classList.contains("dark") ? "#3b4d66" : "";
      btn.style.color = document.documentElement.classList.contains("dark") ? "white" : "black";
    });

    optionButtons.forEach(btn => {
      if (btn.dataset.option === selectedAnswer) {
        const leftBox = btn.querySelector(".left-box");
        const iconSpan = btn.querySelector(".option-icon");
        if (selectedAnswer === correctAnswer) {
          btn.classList.add("correct-answer");
          btn.style.border = "2px solid var(--green-500)";
          leftBox.style.backgroundColor = "var(--green-500)";
          leftBox.style.color = "white";

          iconSpan.innerHTML = `<img src="assets/images/icon-correct.svg" alt="Correct">`;
          score++;
        } else {
          btn.classList.add("wrong-answer");
          btn.style.border = "2px solid var(--red-500)";
          leftBox.style.backgroundColor = "var(--red-500)";
          leftBox.style.color = "white";

          iconSpan.innerHTML = `<img src="assets/images/icon-incorrect.svg" alt="Incorrect">`;
        }
      }
    });

    isSubmitted = true;
    submitBtn.textContent =
      currentQuestionIndex < currentQuiz.questions.length - 1 ? "Next Question" : "View Score";

    if (currentQuestionIndex === currentQuiz.questions.length - 1) progressBar.style.width = "100%";
  } else if (submitBtn.textContent === "Next Question") {
    currentQuestionIndex++;
    showQuestion();
  } else if (submitBtn.textContent === "View Score") {
    showQuizEnd();
  }
});

// ------------------- SHOW END BOX -------------------
function showQuizEnd() {
  progressContainer.style.display = "none";
  buttonsContainer.innerHTML = "";
  questionNrSpan.parentElement.classList.add("hidden");
  currentQuestionSpan.classList.add("hidden");
  submitBtn.style.display = "none";

  if (welcomeLine1) {
    welcomeLine1.textContent = "Quiz Completed";
    welcomeLine1.classList.remove("hidden");
    welcomeLine1.style.display = "block";
    welcomeLine1.style.color = document.documentElement.classList.contains("dark") ? "white" : "black";
  }

  if (welcomeLine2) {
    welcomeLine2.textContent = "You scored...";
    welcomeLine2.classList.remove("hidden");
    welcomeLine2.style.display = "block";
    welcomeLine2.style.color = document.documentElement.classList.contains("dark") ? "#abc1e1" : "black";
  }

  endBox.classList.remove("hidden");
  endBox.classList.add("score-page");

  if (endCategoryIcon) endCategoryIcon.src = categoryIcons[currentQuiz.title] || "assets/images/icon-default.svg";
  if (endCategoryName) {
    endCategoryName.textContent = currentQuiz.title;
    endCategoryName.classList.add("score-category-name");
  }
  if (endScore) {
    endScore.textContent = score;
    endScore.classList.add("score-value");
  }
  if (endTotal) {
    endTotal.textContent = `out of ${currentQuiz.questions.length}`;
    endTotal.classList.add("score-total");
  }

  if (document.documentElement.classList.contains("dark")) {
    endBox.style.backgroundColor = "#3b4d66";
    endBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
    if (endCategoryName) endCategoryName.style.color = "white";
    if (endScore) endScore.style.color = "white";
    if (endTotal) endTotal.style.color = "#abc1e1";
  } else {
    endBox.style.backgroundColor = "white";
    endBox.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    if (endCategoryName) endCategoryName.style.color = "#313e51";
    if (endScore) endScore.style.color = "#313e51";
    if (endTotal) endTotal.style.color = "#626c7f";
  }

  if (playAgainBtn) {
    playAgainBtn.style.display = "block";
    playAgainBtn.classList.add("play-again-btn");
    endBox.parentElement.insertBefore(playAgainBtn, endBox.nextSibling);

    playAgainBtn.onclick = () => {
      if (welcomeLine1) {
        welcomeLine1.textContent = "Welcome to the ";
        welcomeLine1.style.display = "block";
        welcomeLine1.style.color = document.documentElement.classList.contains("dark") ? "white" : "black";
      }
      if (welcomeLine2) {
        welcomeLine2.textContent = "Frontend Quiz!";
        welcomeLine2.style.display = "block";
        welcomeLine2.style.color = document.documentElement.classList.contains("dark") ? "#abc1e1" : "black";
      }

      endBox.classList.add("hidden");
      playAgainBtn.style.display = "none";

      showCategories();
    };
  }
}

// ------------------- INIT -------------------
document.addEventListener("DOMContentLoaded", () => {
  initToggleSwitch();
});
