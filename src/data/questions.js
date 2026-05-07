export const questions = [
  {
    id: 1,
    type: "mcq",
    category: "Basics & Data Types",
    question: "What is the output of the following C++ code?\n\n```cpp\nint main() {\n  cout << 5 / 2;\n  return 0;\n}\n```",
    options: [
      "2.5",
      "2",
      "2.0",
      "Compiler Error"
    ],
    correctAnswer: 1,
    explanation: "In C++, dividing two integers results in an integer division. The fractional part is truncated, so 5 / 2 evaluates to 2."
  },
  {
    id: 2,
    type: "scenario",
    category: "Control Structures",
    question: "Scenario: You are writing a program to calculate the ticket price for a movie. Children under 12 pay $5, adults (12-64) pay $12, and seniors (65+) pay $8. \n\nWhich control structure is most appropriate and readable to handle this logic?",
    options: [
      "A single 'while' loop",
      "A 'switch' statement on the age variable",
      "An 'if-else if-else' chain",
      "A 'for' loop iterating over the ages"
    ],
    correctAnswer: 2,
    explanation: "An 'if-else if-else' chain is best for evaluating continuous ranges of values (e.g., age < 12, age >= 12 && age <= 64)."
  },
  {
    id: 3,
    type: "mcq",
    category: "Loops",
    question: "How many times will the following loop execute?\n\n```cpp\nfor(int i = 0; i <= 5; i++) {\n  cout << i << endl;\n}\n```",
    options: [
      "4 times",
      "5 times",
      "6 times",
      "Infinite loop"
    ],
    correctAnswer: 2,
    explanation: "The loop starts at 0 and goes up to and including 5. It executes for i = 0, 1, 2, 3, 4, 5, which is a total of 6 times."
  },
  {
    id: 4,
    type: "scenario",
    category: "Functions",
    question: "Scenario: You need to write a function that takes a student's score as input and updates their grade. You want the original variable in the main function to be changed directly by this function.\n\nHow should you pass the parameter to the function?",
    options: [
      "Pass by Value (e.g., void updateGrade(int score))",
      "Pass by Reference (e.g., void updateGrade(int& score))",
      "Pass by Array (e.g., void updateGrade(int score[]))",
      "It's not possible to modify the original variable in C++"
    ],
    correctAnswer: 1,
    explanation: "Passing by reference (using the & symbol) allows the function to modify the actual variable that was passed in, rather than just a copy of it."
  },
  {
    id: 5,
    type: "mcq",
    category: "Arrays",
    question: "What is the correct way to declare and initialize an array of 3 integers in C++?",
    options: [
      "int arr[3] = {1, 2, 3};",
      "int arr = [1, 2, 3];",
      "array<int> arr(3) = {1, 2, 3};",
      "int[3] arr = (1, 2, 3);"
    ],
    correctAnswer: 0,
    explanation: "The standard C-style array syntax in C++ is to specify the type, the variable name, the size in brackets, and the values in curly braces: int arr[3] = {1, 2, 3};."
  },
  {
    id: 6,
    type: "mcq",
    category: "Pointers",
    question: "What does the `&` operator do when placed before a variable name in C++ (e.g., `&myVar`)?",
    options: [
      "It returns the value of the variable.",
      "It returns the memory address of the variable.",
      "It creates a copy of the variable.",
      "It deletes the variable from memory."
    ],
    correctAnswer: 1,
    explanation: "The `&` (address-of) operator returns the exact memory address where the variable is stored in the computer's RAM."
  },
  {
    id: 7,
    type: "mcq",
    category: "File I/O",
    question: "Which header file must be included to read from and write to files in C++?",
    options: [
      "<iostream>",
      "<fstream>",
      "<string>",
      "<file>"
    ],
    correctAnswer: 1,
    explanation: "The `<fstream>` (file stream) header provides the `ifstream` (input file stream) and `ofstream` (output file stream) classes needed for file operations."
  },
  {
    id: 8,
    type: "scenario",
    category: "Strings",
    question: "Scenario: You want to read a full sentence from the user, including spaces, into a string variable named `fullName`. \n\nWhich approach should you use?",
    options: [
      "cin >> fullName;",
      "getline(cin, fullName);",
      "cin.read(fullName);",
      "scanf(\"%s\", fullName);"
    ],
    correctAnswer: 1,
    explanation: "`cin >>` stops reading as soon as it encounters a space. `getline(cin, fullName)` will read the entire line, including spaces, until the user presses Enter."
  },
  {
    id: 9,
    type: "mcq",
    category: "Scope",
    question: "What is the output of the following code?\n\n```cpp\nint x = 10;\nint main() {\n  int x = 20;\n  cout << x;\n  return 0;\n}\n```",
    options: [
      "10",
      "20",
      "Compiler Error",
      "Garbage Value"
    ],
    correctAnswer: 1,
    explanation: "The local variable `x = 20` inside `main()` hides (or 'shadows') the global variable `x = 10`. The local scope always takes precedence."
  },
  {
    id: 10,
    type: "mcq",
    category: "Object Oriented",
    question: "In C++ classes, what is the default access specifier for members if you don't explicitly declare one (e.g., public, private, protected)?",
    options: [
      "public",
      "private",
      "protected",
      "There is no default, it causes an error."
    ],
    correctAnswer: 1,
    explanation: "By default, all members (variables and functions) of a C++ `class` are `private` unless specified otherwise. (Note: in a `struct`, they are `public` by default)."
  }
];
