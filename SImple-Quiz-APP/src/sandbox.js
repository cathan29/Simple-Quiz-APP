let question;
let form;
let res;
let qno;
let score;
const questions = [];

// Load questions from the text file
fetch('question.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n');
        lines.forEach(line => {
            const [title, answer] = line.split('|');
            if (title && answer) {
                questions.push({ title: title.trim(), answer: answer.trim(), score: 1 });
            }
        });
        init();
    });

function restartScreen() {
    score = 0; 
    qno = -1;  // Reset the question number

    document.querySelector('.quiz-heading').innerHTML = `Quiz`;
    
    // Reset the question card UI
    const card = document.querySelector('.question-card');
    card.innerHTML = `
        <h2 id='question'>Question</h2>
        <form>
            <label for="answer">Your Answer:</label><br>
            <input type="text" id="answer" name="answer"><br>
            <div id="res" class="idle">Empty</div><br>
            <input type="submit" name="submit" value='Submit' class='submit'/>
        </form>
    `;

    // Hide answer key and restart button
    document.querySelector('.answer-key').style.display = 'none';
    document.querySelector('#restart-btn').style.display = 'none';

    // Reinitialize elements
    question = document.querySelector('#question');
    form = document.querySelector('form');
    res = document.querySelector('#res');
    
    // Load first question again
    getNextQuestion();

    // Reset event listeners
    form.addEventListener('submit', handleSubmit);
}

function evaluate() {
    const userAnswer = form.answer.value.trim();
    if (userAnswer.toLowerCase() === questions[qno].answer.toLowerCase()) {
        res.setAttribute("class", "correct");
        res.innerHTML = "Correct";
        score += questions[qno].score;
    } else {
        res.setAttribute("class", "incorrect");
        res.innerHTML = `Incorrect. The correct answer is ${questions[qno].answer}`;
    }
}

function getNextQuestion() {
    qno++;
    if (qno < questions.length) {
        const ques = questions[qno];
        question.innerHTML = ques.title;
    }
}

function handleSubmit(e) {
    e.preventDefault();
    if (!form.answer.value) {
        alert('Please fill in the blank');
    } else if (form.submit.classList.contains('submit')) {
        evaluate();
        form.submit.classList.remove('submit');
        form.submit.value = "Next";
        form.submit.classList.add('next');
    } else if (qno < questions.length - 1 && form.submit.classList.contains('next')) {
        getNextQuestion();
        res.setAttribute("class", "idle");
        res.innerHTML = "Empty";
        form.submit.classList.remove('next');
        form.submit.value = "Submit";
        form.submit.classList.add('submit');
        form.reset();
    } else if (form.submit.classList.contains('next')) {
        showAnswerKey();
        form.submit.classList.remove('next');
        form.submit.value = "Submit";
        form.submit.classList.add('submit');
        form.reset();
    }
}

function showAnswerKey() {
    document.querySelector('.quiz-heading').innerHTML = `Score: ${score}`;
    const card = document.querySelector('.question-card');
    card.innerHTML = "<ul>";
    questions.forEach((ques) => {
        const html = `<li>${ques.title} <div class="answer-label">${ques.answer}</div></li>`;
        card.innerHTML += html;
    });
    card.innerHTML += "</ul>";
    
    // Show answer key and restart button
    document.querySelector('.answer-key').style.display = 'block';
    document.querySelector('#restart-btn').style.display = 'block';
}

function init() {
    question = document.querySelector('#question');
    form = document.querySelector('form');
    res = document.querySelector('#res');
    qno = -1;
    score = 0;
    form.addEventListener('submit', handleSubmit);
    document.querySelector('#restart-btn').addEventListener('click', restartScreen);
    getNextQuestion();
}
