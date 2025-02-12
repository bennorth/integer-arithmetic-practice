document.addEventListener('DOMContentLoaded', function() {
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const feedbackDiv = document.getElementById('feedback');
    const feedbackMessage = document.getElementById('feedback-message');
    const correctAnswerDiv = document.getElementById('correct-answer');
    const answerValue = document.getElementById('answer-value');
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
    let isNegative = false;

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

        num1Span.textContent = num1;
        num2Span.textContent = num2;
        operatorSpan.textContent = operator;
        currentAnswer = answer;
    }

    function showFeedback(correct) {
        feedbackDiv.className = `alert ${correct ? 'alert-success' : 'alert-danger'}`;
        feedbackMessage.textContent = correct ? 'Correct! 🎉' : 'Try again! 💪';
        feedbackDiv.classList.remove('d-none');

        if (!correct) {
            correctAnswerDiv.classList.remove('d-none');
            answerValue.textContent = currentAnswer;
            dismissButton.classList.remove('d-none');
        } else {
            correctAnswerDiv.classList.add('d-none');
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
                isNegative = false;
            } else if (value === '-') {
                // Toggle negative sign
                if (answerInput.value.startsWith('-')) {
                    answerInput.value = answerInput.value.substring(1);
                } else {
                    answerInput.value = '-' + answerInput.value;
                }
            } else {
                // Add number
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
            correctAnswerDiv.classList.add('d-none');
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
        generateProblem();
        answerInput.focus();
    });

    // Initialize the first problem
    generateProblem();
    // Focus on input when page loads
    answerInput.focus();
});