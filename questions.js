// questions.js

const questions = {
    cpp: [
      {
        q: "What is function overloading in C++?",
        a: [
          { text: "Defining multiple functions with the same name but different parameters", isCorrect: true },
          { text: "Using functions from a different file", isCorrect: false },
          { text: "Declaring functions in multiple source files", isCorrect: false },
          { text: "Creating functions with the same name and same parameters", isCorrect: false },
        ],
      },
      {
        q: "What is the 'new' operator used for in C++?",
        a: [
          { text: "Creating a new variable", isCorrect: false },
          { text: "Allocating memory for an object or a primitive type", isCorrect: true },
          { text: "Declaring a new class", isCorrect: false },
          { text: "Initializing a new array", isCorrect: false },
        ],
      },
      {
        q: "What is the 'namespace' feature in C++ used for?",
        a: [
          { text: "To define a new class", isCorrect: false },
          { text: "To create a new scope for identifiers", isCorrect: true },
          { text: "To include external libraries", isCorrect: false },
          { text: "To declare global variables", isCorrect: false },
        ],
      },
      
    ],
    java: [
      {
        q: "What is the difference between '==' and '.equals()' in Java?",
        a: [
          { text: "'==' compares object references, while '.equals()' compares the content of objects", isCorrect: true },
          { text: "'==' is used for primitive types, '.equals()' is used for objects", isCorrect: false },
          { text: "'==' is used for objects, '.equals()' is used for primitive types", isCorrect: false },
          { text: "There is no difference; they can be used interchangeably", isCorrect: false },
        ],
      },
      {
        q: "What is the purpose of the 'super' keyword in Java?",
        a: [
          { text: "To call the superclass constructor", isCorrect: true },
          { text: "To access static methods of the superclass", isCorrect: false },
          { text: "To define a superclass", isCorrect: false },
          { text: "To create an instance of the superclass", isCorrect: false },
        ],
      },
      {
        q: "What is the purpose of the 'final' keyword in Java?",
        a: [
          { text: "To indicate that a class cannot be extended", isCorrect: true },
          { text: "To specify the initial value of a variable", isCorrect: false },
          { text: "To mark a method as abstract", isCorrect: false },
          { text: "To define a constant variable", isCorrect: false },
        ],
      },
      
    ],
    python: [
      {
        q: "What is a list comprehension in Python?",
        a: [
          { text: "A syntax error in Python", isCorrect: false },
          { text: "A way to create lists using a concise syntax", isCorrect: true },
          { text: "A method to compress lists", isCorrect: false },
          { text: "A built-in function for sorting lists", isCorrect: false },
        ],
      },
      {
        q: "In Python, what does the 'pass' statement do?",
        a: [
          { text: "It terminates the program", isCorrect: false },
          { text: "It does nothing and acts as a placeholder", isCorrect: true },
          { text: "It skips the current iteration in a loop", isCorrect: false },
          { text: "It raises an exception", isCorrect: false },
        ],
      },
      {
        q: "What is the purpose of the 'lambda' function in Python?",
        a: [
          { text: "To create anonymous functions", isCorrect: true },
          { text: "To declare variables without assigning values", isCorrect: false },
          { text: "To perform mathematical operations", isCorrect: false },
          { text: "To generate random numbers", isCorrect: false },
        ],
      },
      // Add more Python questions
    ],
  };
  
  module.exports = questions;
  