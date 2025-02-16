document.addEventListener("DOMContentLoaded", function () {
  const getElt = document.getElementById.bind(document);
  const answerInput = getElt("user-answer");
  const answerInputFeedback = getElt("user-answer-feedback-symbol");
  const feedbackDiv = getElt("feedback");
  const feedbackMessage = getElt("feedback-message");
  const dismissButton = getElt("dismiss-feedback");
  const num1Span = getElt("num1");
  const num2Span = getElt("num2");
  const operatorSpan = getElt("operator");
  const scoreSpan = getElt("score");
  const totalSpan = getElt("total");
  const keypadButtons = document.querySelectorAll(".keypad-btn");
  const correctAnswer = getElt("correct-answer-display");

  let score = 0;
  let total = 0;
  let currentAnswer = 0;

  function generateProblem() {
    const num1 = Math.floor(Math.random() * 41) - 20; // -20 to 20
    const num2 = Math.floor(Math.random() * 41) - 20; // -20 to 20
    const operators = ["+", "-", "×"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

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
    answerInputFeedback.innerText = correct ? "Y" : "N";
    if (!correct) {
      correctAnswer.innerText = `= ${currentAnswer}`;
    }
  }

  function updateScore(correct) {
    if (correct) {
      score++;
    }
    total++;
    scoreSpan.textContent = score;
    totalSpan.textContent = total;
  }

  // Handle keypad input
  keypadButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");

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
        button.innerText = "↦";
        button.setAttribute("data-value", "NEXT");
      } else if (value === "NEXT") {
        button.setAttribute("data-value", "ENTER");
        button.innerText = "⏎";
        correctAnswer.innerText = "";
        generateProblem();
        answerInput.innerText = "";
        answerInputFeedback.innerText = "";
      } else {
        // Add number or minus sign as a character
        answerInput.innerText += value;
      }
    });
  });

  dismissButton.addEventListener("click", function () {
    feedbackDiv.classList.add("d-none");
    // Clear the equals sign and answer spans
    const problemContainer = num1Span.parentElement;
    const existingAnswer = problemContainer.querySelector(".answer");
    if (existingAnswer) existingAnswer.remove();
    // Generate new problem
    generateProblem();
  });

  // Initialize the first problem
  generateProblem();
});
