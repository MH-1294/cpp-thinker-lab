export const cheatsheet = [
  {
    category: "Variables & Data Types",
    items: [
      {
        title: "Declaring Variables",
        code: "int age = 20;\ndouble pi = 3.14159;\nchar grade = 'A';\nstring name = \"Alice\";\nbool isStudent = true;",
        explanation: "C++ requires you to declare the type of variable before the variable name."
      }
    ]
  },
  {
    category: "Control Structures",
    items: [
      {
        title: "If-Else Statement",
        code: "if (score >= 90) {\n  cout << \"A\";\n} else if (score >= 80) {\n  cout << \"B\";\n} else {\n  cout << \"C\";\n}",
        explanation: "Executes different blocks of code based on conditions."
      },
      {
        title: "For Loop",
        code: "for (int i = 0; i < 5; i++) {\n  cout << i << endl;\n}",
        explanation: "Used when you know exactly how many times you want to loop."
      },
      {
        title: "While Loop",
        code: "int count = 0;\nwhile (count < 5) {\n  cout << count << endl;\n  count++;\n}",
        explanation: "Loops as long as the condition remains true."
      }
    ]
  },
  {
    category: "Functions",
    items: [
      {
        title: "Basic Function",
        code: "int add(int a, int b) {\n  return a + b;\n}\n\n// Calling it:\nint result = add(5, 3);",
        explanation: "A block of code that only runs when it is called. You can pass data, known as parameters, into a function."
      }
    ]
  },
  {
    category: "Arrays & Pointers",
    items: [
      {
        title: "Array Declaration",
        code: "int numbers[5] = {10, 20, 30, 40, 50};\ncout << numbers[0]; // Prints 10",
        explanation: "Arrays store multiple values of the same type in a single variable."
      },
      {
        title: "Pointers",
        code: "int var = 20;\nint* ptr = &var; // ptr stores address of var\ncout << *ptr; // Prints 20 (dereferencing)",
        explanation: "Pointers hold the memory address of another variable."
      }
    ]
  }
];
