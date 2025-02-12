class MathPractice {
    constructor() {
        this.score = 0;
        this.attempts = 0;
        this.currentProblem = null;
        this.operators = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '×': (a, b) => a * b
        };

        // DOM elements
        this.problemEl = document.getElementById('problem');
        this.answerEl = document.getElementById('answer');
        this.submitBtn = document.getElementById('submit');
        this.nextBtn = document.getElementById('next');
        this.feedbackEl = document.getElementById('feedback');
        this.scoreEl = document.getElementById('score');
        this.attemptsEl = document.getElementById('attempts');

        // Operation toggles
        this.additionToggle = document.getElementById('addition');
        this.subtractionToggle = document.getElementById('subtraction');
        this.multiplicationToggle = document.getElementById('multiplication');

        this.initializeEventListeners();
        this.generateNewProblem();
    }

    initializeEventListeners() {
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.nextBtn.addEventListener('click', () => this.generateNewProblem());
        this.answerEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        // Reset feedback when starting to type new answer
        this.answerEl.addEventListener('input', () => {
            this.feedbackEl.classList.add('d-none');
        });
    }

    getRandomNumber() {
        return Math.floor(Math.random() * 41) - 20; // -20 to 20
    }

    getRandomOperator() {
        const availableOperators = [];
        if (this.additionToggle.checked) availableOperators.push('+');
        if (this.subtractionToggle.checked) availableOperators.push('-');
        if (this.multiplicationToggle.checked) availableOperators.push('×');

        if (availableOperators.length === 0) {
            // If no operators selected, default to addition
            this.additionToggle.checked = true;
            return '+';
        }

        return availableOperators[Math.floor(Math.random() * availableOperators.length)];
    }

    generateNewProblem() {
        const num1 = this.getRandomNumber();
        const num2 = this.getRandomNumber();
        const operator = this.getRandomOperator();

        this.currentProblem = {
            num1: num1,
            num2: num2,
            operator: operator,
            answer: this.operators[operator](num1, num2)
        };

        // Format the problem display
        this.problemEl.textContent = `${num1} ${operator} ${num2} = ?`;
        this.answerEl.value = '';
        this.answerEl.focus();
        this.feedbackEl.classList.add('d-none');
    }

    checkAnswer() {
        if (!this.currentProblem) return;

        const userAnswer = parseInt(this.answerEl.value);
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number', 'warning');
            return;
        }

        this.attempts++;
        this.attemptsEl.textContent = this.attempts;

        if (userAnswer === this.currentProblem.answer) {
            this.score++;
            this.scoreEl.textContent = this.score;
            this.showFeedback('Correct! Well done!', 'success');
            setTimeout(() => this.generateNewProblem(), 1500);
        } else {
            this.showFeedback(`Incorrect. Try again! The correct answer was ${this.currentProblem.answer}`, 'danger');
        }
    }

    showFeedback(message, type) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = `alert alert-${type}`;
        this.feedbackEl.classList.remove('d-none');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MathPractice();
});
