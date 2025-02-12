document.addEventListener('DOMContentLoaded', function() {
    const answerForm = document.getElementById('answer-form');
    const answerInput = document.getElementById('answer-input');
    const feedbackDiv = document.getElementById('feedback');
    const num1Span = document.getElementById('num1');
    const num2Span = document.getElementById('num2');
    const operatorSpan = document.getElementById('operator');
    const scoreSpan = document.getElementById('score');
    const totalSpan = document.getElementById('total');

    function updateProblem(problem) {
        num1Span.textContent = problem.num1;
        num2Span.textContent = problem.num2;
        operatorSpan.textContent = problem.operator;
    }

    function showFeedback(correct) {
        feedbackDiv.className = `alert ${correct ? 'alert-success' : 'alert-danger'} feedback-animation`;
        feedbackDiv.textContent = correct ? 'Correct! 🎉' : 'Try again! 💪';
        feedbackDiv.classList.remove('d-none');
        
        setTimeout(() => {
            feedbackDiv.classList.add('d-none');
        }, 2000);
    }

    answerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const answer = answerInput.value;
        
        fetch('/check_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `answer=${encodeURIComponent(answer)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                feedbackDiv.className = 'alert alert-danger feedback-animation';
                feedbackDiv.textContent = data.error;
                feedbackDiv.classList.remove('d-none');
            } else {
                showFeedback(data.correct);
                updateProblem(data.new_problem);
                scoreSpan.textContent = data.score;
                totalSpan.textContent = data.total;
                answerInput.value = '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            feedbackDiv.className = 'alert alert-danger feedback-animation';
            feedbackDiv.textContent = 'An error occurred. Please try again.';
            feedbackDiv.classList.remove('d-none');
        });
    });

    // Focus on input when page loads
    answerInput.focus();
});
