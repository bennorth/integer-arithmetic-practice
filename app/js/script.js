document.addEventListener("DOMContentLoaded", function () {
  const getElt = document.getElementById.bind(document);
  const answerInput = getElt("user-answer");
  const answerInputFeedback = getElt("user-answer-feedback-symbol");
  const num1Span = getElt("num1");
  const num2Span = getElt("num2");
  const operatorSpan = getElt("operator");
  const scoreSpan = getElt("score");
  const totalSpan = getElt("total");
  const keypadButtons = document.querySelectorAll(".keypad-btn");
  const correctAnswerEq = getElt("correct-answer-eq");
  const correctAnswer = getElt("correct-answer-display");
  const resetScore = getElt("reset-score");

  let score = 0;
  let total = 0;
  let currentAnswer = 0;
  let gameState = "booting";

  let addMaxOperand = 20;
  let mulMaxOperand = 10;

  let settingsShown = false;

  function generateProblem() {
    const operators = ["+", "-", "×"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    const maxMagnitude = operator === "×" ? mulMaxOperand : addMaxOperand;
    const operandRange = 2 * maxMagnitude + 1;
    const num1 = Math.floor(Math.random() * operandRange) - maxMagnitude;
    const num2 = Math.floor(Math.random() * operandRange) - maxMagnitude;

    let answer;
    if (operator === "+") {
      answer = num1 + num2;
    } else if (operator === "-") {
      answer = num1 - num2;
    } else {
      // multiplication
      answer = num1 * num2;
    }

    // Display problem
    displayProblem(num1, num2, operator);
    currentAnswer = answer;
  }

  function displayProblem(num1, num2, operator) {
    num1Span.textContent = num1;
    num2Span.textContent = num2;
    operatorSpan.textContent = operator;
  }

  function showFeedback(correct) {
    answerInputFeedback.innerText = correct ? "✓" : "✗";
    if (!correct) {
      correctAnswerEq.classList.remove("d-none");
      correctAnswer.innerText = currentAnswer;
    }
  }

  function updateScore(correct) {
    if (correct) {
      score++;
    }
    total++;
    refreshScoreDisplay();
  }

  function refreshScoreDisplay() {
    scoreSpan.textContent = score;
    totalSpan.textContent = total;
  }

  resetScore.addEventListener("click", () => {
    total = score = 0;
    refreshScoreDisplay();
    nextQuestion();
  });

  function nextQuestion() {
    const button = getElt("enter-or-next-button");
    button.setAttribute("data-value", "ENTER");
    button.innerText = "ENTER";
    correctAnswerEq.classList.add("d-none");
    correctAnswer.innerText = "";
    generateProblem();
    answerInput.innerText = "";
    answerInputFeedback.innerText = "";
    gameState = "awaiting-user-answer";
  }

  // Handle keypad input
  keypadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");

      if (gameState === "showing-feedback" && value !== "NEXT") return;

      if (value === "del") {
        // Handle backspace
        const currentValue = answerInput.innerText;
        answerInput.innerText = currentValue.slice(0, -1);
      } else if (value === "clear") {
        // Clear the input
        answerInput.innerText = "";
      } else if (value === "ENTER") {
        const userAnswer = parseInt(answerInput.innerText);
        const answerCorrect = userAnswer === currentAnswer;
        updateScore(answerCorrect);
        showFeedback(answerCorrect);
        button.innerText = "NEXT";
        button.setAttribute("data-value", "NEXT");
        gameState = "showing-feedback";
      } else if (value === "NEXT") {
        nextQuestion();
      } else {
        // Add number or minus sign as a character
        answerInput.innerText += value;
      }
    });
  });

  // Initialize the first problem
  nextQuestion();

  const settingsSection = getElt("settings-section");
  getElt("toggle-settings").addEventListener("click", () => {
    settingsShown = !settingsShown;
    if (settingsShown) settingsSection.classList.add("shown");
    else settingsSection.classList.remove("shown");
  });

  const difficultyButtons = [
    { id: "settings-easy", addMaxOp: 10, mulMaxOp: 5 },
    { id: "settings-med", addMaxOp: 15, mulMaxOp: 8 },
    { id: "settings-hard", addMaxOp: 20, mulMaxOp: 10 },
  ];

  function configureDifficultyButton(cfg) {
    const thisBtn = getElt(cfg.id);
    thisBtn.addEventListener("click", () => {
      difficultyButtons.forEach((cfg1) => {
        const btn = getElt(cfg1.id);
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline-secondary");
      });
      thisBtn.classList.add("btn-success");
      addMaxOperand = cfg.addMaxOp;
      mulMaxOperand = cfg.mulMaxOp;
    });
  }

  difficultyButtons.forEach(configureDifficultyButton);
});
