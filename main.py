from flask import Flask, render_template, request, jsonify, session
import random
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = 'math_practice_secret_key'  # Required for session

def generate_problem():
    """Generate a random math problem with numbers between -20 and 20"""
    num1 = random.randint(-20, 20)
    num2 = random.randint(-20, 20)
    operators = ['+', '-', '×']
    operator = random.choice(operators)
    
    if operator == '+':
        answer = num1 + num2
    elif operator == '-':
        answer = num1 - num2
    else:  # multiplication
        answer = num1 * num2
        
    return {
        'num1': num1,
        'num2': num2,
        'operator': operator,
        'answer': answer
    }

@app.route('/')
def index():
    """Initialize the session and render the main page"""
    if 'score' not in session:
        session['score'] = 0
        session['total'] = 0
    
    problem = generate_problem()
    session['current_answer'] = problem['answer']
    
    return render_template('index.html', 
                         num1=problem['num1'],
                         num2=problem['num2'],
                         operator=problem['operator'],
                         score=session['score'],
                         total=session['total'])

@app.route('/check_answer', methods=['POST'])
def check_answer():
    """Check if the submitted answer is correct"""
    try:
        user_answer = int(request.form.get('answer', ''))
        correct_answer = session.get('current_answer')
        
        if user_answer == correct_answer:
            session['score'] = session.get('score', 0) + 1
            result = True
        else:
            result = False
            
        session['total'] = session.get('total', 0) + 1
        
        # Generate new problem
        problem = generate_problem()
        session['current_answer'] = problem['answer']
        
        return jsonify({
            'correct': result,
            'new_problem': {
                'num1': problem['num1'],
                'num2': problem['num2'],
                'operator': problem['operator']
            },
            'score': session['score'],
            'total': session['total']
        })
        
    except ValueError:
        return jsonify({'error': 'Invalid input. Please enter a number.'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
