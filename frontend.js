// frontend.js

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            // Save user information or perform actions after successful login
            alert('Login successful!');
            localStorage.setItem('userId', data.userId);
            startQuiz(); // For example, start the quiz after login
        } else {
            alert('Invalid credentials. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors here
    });
}

function showRegistration() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registrationForm").style.display = "block";
}

function createUser() {
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Show a message indicating success or failure
        if (data.message === 'User registered successfully') {
            hideRegistration(); // Hide registration form after successful registration
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors here
    });
}

function hideRegistration() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registrationForm").style.display = "none";
}

function startQuiz() {
    // Placeholder: Navigate to quiz.html for now
    window.location.href = 'quiz.html';
}

