document.addEventListener('DOMContentLoaded', function() {
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const feedbackDiv = document.getElementById('feedback');
    const num1Span = document.getElementById('num1');
    const num2Span = document.getElementById('num2');
    const operatorSpan = document.getElementById('operator');
    const scoreSpan = document.getElementById('score');
    const totalSpan = document.getElementById('total');

    let score = 0;
    let total = 0;
    let currentAnswer = 0;

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
        feedbackDiv.className = `alert ${correct ? 'alert-success' : 'alert-danger'} feedback-animation`;
        feedbackDiv.textContent = correct ? 'Correct! 🎉' : 'Try again! 💪';
        feedbackDiv.classList.remove('d-none');

        setTimeout(() => {
            feedbackDiv.classList.add('d-none');
        }, 2000);
    }

    function updateScore(correct) {
        if (correct) {
            score++;
        }
        total++;
        scoreSpan.textContent = score;
        totalSpan.textContent = total;
    }

    answerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            feedbackDiv.className = 'alert alert-danger feedback-animation';
            feedbackDiv.textContent = 'Please enter a valid number';
            feedbackDiv.classList.remove('d-none');
            return;
        }

        const correct = userAnswer === currentAnswer;
        showFeedback(correct);
        updateScore(correct);
        answerInput.value = '';
        generateProblem();
    });

    // Initialize the first problem
    generateProblem();
    // Focus on input when page loads
    answerInput.focus();
});