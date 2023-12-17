document.addEventListener("DOMContentLoaded", function () {
    let quizQuestions = []; // Initialize an empty array for quiz questions

    // Placeholder function to fetch quiz questions based on the selected category
    function fetchQuizQuestions(category) {
        fetch(`http://localhost:3000/questions?category=${category}`)
            .then(response => response.json())
            .then(questions => {
                quizQuestions = questions;
                console.log(quizQuestions);
                loadQuestion();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
        
    // Function to show category selection and hide quiz content
    function showCategorySelection() {
        document.getElementById("categorySelection").style.display = "block";
        document.getElementById("quizContent").style.display = "none";
        document.getElementById("pastScores").style.display = "block";
        document.getElementById("proficiencyLevels").style.display = "block";
    }

    // Function to show quiz content and hide category selection
    function showQuizContent() {
        document.getElementById("categorySelection").style.display = "none";
        document.getElementById("quizContent").style.display = "block";
        document.getElementById("pastScores").style.display = "none";
        document.getElementById("proficiencyLevels").style.display = "none";
    }

    let currentQuestion = 0;
    let score = 0;
    let timerInterval = null;
    const timeLimit = 8;
    let userAnswers = [];

    function loadQuestion() {
        const question = document.getElementById("ques");
        const options = document.getElementById("opt");
    
        if (currentQuestion < quizQuestions.length) {
            const currentQuestionData = quizQuestions[currentQuestion];
    
            question.textContent = currentQuestionData.q;
            options.innerHTML = "";
    
            for (let i = 0; i < currentQuestionData.a.length; i++) {
                const choicesDiv = document.createElement("div");
                const choice = document.createElement("input");
                const choiceLabel = document.createElement("label");
    
                choice.type = "radio";
                choice.name = "answer";
                choice.value = i;
    
                choiceLabel.textContent = currentQuestionData.a[i].text;
                choiceLabel.setAttribute("for", `option_${i}`);
    
                choicesDiv.appendChild(choice);
                choicesDiv.appendChild(choiceLabel);
                options.appendChild(choicesDiv);
            }
    
            clearInterval(timerInterval);
            document.getElementById("timer").textContent = `Time Left: ${timeLimit}`;
            startTimer();
            
            // Add an event listener for the submit button
            const submitButton = document.getElementById("submitBtn");
            submitButton.style.display = "block"; // Display the submit button
            submitButton.addEventListener("click", function () {
                checkAns(); // Call the function to check the answer
            });
        } else {
            const submitButton = document.getElementById("submitBtn");
            const timer = document.getElementById("timer");
    
            options.style.display = "none";
            question.style.display = "none";
            submitButton.style.display = "none";
            timer.style.display = "none";
    
            loadScore();
            stopTimer();
            // displayReview();
        }
    }
    document.getElementById("pastScores").addEventListener("click", displayPastScores);

function displayPastScores() {
    // Fetch both past quiz scores and language proficiency levels for the current user from your backend
    const userId = localStorage.getItem("userId"); // Assuming you store the user ID in local storage

    // Fetch past quiz scores
    const fetchPastScores = fetch(`http://localhost:3000/past-scores?userId=${userId}`)
        .then(response => response.json());

    // Fetch language proficiency levels
    const fetchProficiencyLevels = fetch(`http://localhost:3000/proficiency-levels?userId=${userId}`)
        .then(response => response.json());

    // Wait for both fetch operations to complete
    Promise.all([fetchPastScores, fetchProficiencyLevels])
        .then(([scores, proficiencyLevels]) => {
            const pastScoresContainer = document.getElementById("pastScores");
            pastScoresContainer.innerHTML = "";

            if (scores.length > 0) {
                const scoresList = document.createElement("ul");

                scores.forEach(score => {
                    const scoreItem = document.createElement("li");
                    scoreItem.textContent = `Category: ${score.category}, Score: ${score.score}, Date: ${new Date(score.date).toLocaleDateString()}`;
                    scoresList.appendChild(scoreItem);
                });

                pastScoresContainer.appendChild(scoresList);
            } else {
                const noScoresMessage = document.createElement("p");
                noScoresMessage.textContent = "No past quiz scores available.";
                pastScoresContainer.appendChild(noScoresMessage);
            }

            // Display language proficiency levels
            const proficiencyLevelsContainer = document.getElementById("proficiencyLevels");
            proficiencyLevelsContainer.innerHTML = "";

            if (proficiencyLevels) {
                const proficiencyList = document.createElement("ul");

                const highestCategory = Object.keys(proficiencyLevels).reduce((a, b) => proficiencyLevels[a] > proficiencyLevels[b] ? a : b);

                Object.entries(proficiencyLevels).forEach(([category, level]) => {
                    const levelItem = document.createElement("li");
                    levelItem.textContent = `Language: ${category}, Proficiency Level: ${level}`;
                    proficiencyList.appendChild(levelItem);
                });

                const highestProficiencyMessage = document.createElement("p");
                highestProficiencyMessage.textContent = `Highest Proficiency: ${highestCategory}`;
                proficiencyLevelsContainer.appendChild(highestProficiencyMessage);

                proficiencyLevelsContainer.appendChild(proficiencyList);
            } else {
                const noProficiencyMessage = document.createElement("p");
                noProficiencyMessage.textContent = "No language proficiency data available.";
                proficiencyLevelsContainer.appendChild(noProficiencyMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

    

    function startTimer() {
        let timeLeft = timeLimit;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}`;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").textContent = `Time Left: ${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                checkAns();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function loadScore() {
        const totalScore = document.getElementById("score");
        if (score <= 1) {
            totalScore.textContent = `You scored ${score} out of ${quizQuestions.length}! Try Again!`;
        } else {
            totalScore.textContent = `You scored ${score} out of ${quizQuestions.length}! Great Job!`;
        }
            // Store the score on the backend
            const userId = localStorage.getItem("userId"); // Assuming you store the user ID in local storage
            const category = localStorage.getItem("selectedCategory"); // Assuming you store the selected category in local storage
    
            // Send the score to the backend
            fetch('http://localhost:3000/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, category, score }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Score stored on the backend:', data.message);
                })
                .catch(error => {
                    console.error('Error storing score on the backend:', error);
                    // Handle errors here
                });
    
        const btn = document.getElementById("restart-btn");
        btn.style.display = "block";
        const btn2 = document.getElementById("logout-btn");
        btn2.style.display = "block";
    }
    

    function checkAns() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if (selectedAnswer) {
            const selectedAns = parseInt(selectedAnswer.value);
            const currentQuestionData = quizQuestions[currentQuestion];

            if (currentQuestionData.a[selectedAns].isCorrect) {
                score++;
                console.log("Correct");
            }

            userAnswers.push({ question: currentQuestionData.q, selectedAnswer: currentQuestionData.a[selectedAns].text });

            currentQuestion++;
            loadQuestion();

        } else {
            console.log("Time's up! Submitting unanswered question.");
            userAnswers.push({ question: quizQuestions[currentQuestion].q, selectedAnswer: "Unanswered" });

            currentQuestion++;
            loadQuestion();

        }
    }

    // Initial state: Show category selection
    showCategorySelection();
    
    // Event listener for the "Start Quiz" button
    document.getElementById("startQuizBtn").addEventListener("click", function () {
        const categorySelect = document.getElementById("category");
        const selectedCategory = categorySelect.value;

        // Save selected category to local storage
        localStorage.setItem("selectedCategory", selectedCategory);

        // Fetch quiz questions based on the selected category
        fetchQuizQuestions(selectedCategory);

        // Switch to the quiz content view
        showQuizContent();
    });

    // Event listener for the "Restart" button
    document.getElementById("restart-btn").addEventListener("click", reStart);

    // Event listener for the "Logout" button
    document.getElementById("logout-btn").addEventListener("click", mainPage);

    function reStart() {
        // Reset quiz state
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        
        window.location.href = "quiz.html";
        
    }

    function mainPage() {
        // Redirect to the main page or perform any other action
        window.location.href = "index.html"; // Replace "index.html" with your main page URL
    }

});
