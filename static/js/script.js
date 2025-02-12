document.addEventListener('DOMContentLoaded', function() {
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const feedbackDiv = document.getElementById('feedback');
    const feedbackMessage = document.getElementById('feedback-message');
    const dismissButton = document.getElementById('dismiss-feedback');
    const num1Span = document.getElementById('num1');
    const num2Span = document.getElementById('num2');
    const operatorSpan = document.getElementById('operator');
    const scoreSpan = document.getElementById('score');
    const totalSpan = document.getElementById('total');
    const keypadButtons = document.querySelectorAll('.keypad-btn');

    let score = 0;
    let total = 0;
    let currentAnswer = 0;
    let currentProblem = { num1: 0, num2: 0, operator: '+' };

    function generateProblem() {
        const num1 = Math.floor(Math.random() * 41) - 20; // -20 to 20
        const num2 = Math.floor(Math.random() * 41) - 20; // -20 to 20
        const operators = ['+', '-', '×'];
        const operator = operators[Math.floor(Math.random() * operators.length)];

        let answer;
        if (operator === '+') {
            answer = num1 + num2;
        } else if (operator === '-') {
            answer = num1 - num2;
        } else { // multiplication
            answer = num1 * num2;
        }

        // Store current problem
        currentProblem = { num1, num2, operator };

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
        feedbackDiv.className = `alert ${correct ? 'alert-success' : 'alert-danger'}`;
        feedbackMessage.textContent = correct ? 'Correct! 🎉' : 'Try again! 💪';
        feedbackDiv.classList.remove('d-none');

        if (!correct) {
            // Keep the original problem and add the correct answer
            const problemContainer = num1Span.parentElement;

            // Remove any existing answer display
            const existingAnswer = problemContainer.querySelector('.answer');
            if (existingAnswer) existingAnswer.remove();

            // Add correct answer after the existing equals sign
            const answerSpan = document.createElement('span');
            answerSpan.className = 'problem-number answer';
            answerSpan.textContent = currentAnswer;
            problemContainer.appendChild(answerSpan);

            dismissButton.classList.remove('d-none');
        } else {
            dismissButton.classList.add('d-none');
            // For correct answers, automatically generate new problem after brief delay
            setTimeout(() => {
                feedbackDiv.classList.add('d-none');
                generateProblem();
            }, 1500);
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
    keypadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if (value === 'del') {
                // Handle backspace
                const currentValue = answerInput.value;
                answerInput.value = currentValue.slice(0, -1);
            } else if (value === 'clear') {
                // Clear the input
                answerInput.value = '';
            } else {
                // Add number or minus sign as a character
                answerInput.value += value;
            }

            answerInput.focus();
        });
    });

    answerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            feedbackMessage.textContent = 'Please enter a valid number';
            feedbackDiv.className = 'alert alert-danger';
            feedbackDiv.classList.remove('d-none');
            dismissButton.classList.add('d-none');
            return;
        }

        const correct = userAnswer === currentAnswer;
        showFeedback(correct);
        updateScore(correct);
        answerInput.value = '';

        if (correct) {
            answerInput.focus();
        }
    });

    dismissButton.addEventListener('click', function() {
        feedbackDiv.classList.add('d-none');
        // Clear the equals sign and answer spans
        const problemContainer = num1Span.parentElement;
        const existingAnswer = problemContainer.querySelector('.answer');
        if (existingAnswer) existingAnswer.remove();
        // Generate new problem
        generateProblem();
        answerInput.focus();
    });

    // Initialize the first problem
    generateProblem();
    // Focus on input when page loads
    answerInput.focus();
});