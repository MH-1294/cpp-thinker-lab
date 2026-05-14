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
  },
  {
    category: "Core Fundamentals & Gotchas",
    items: [
      {
        title: "Pre vs Post Increment (with cout)",
        code: "int x = 5;\n// Post-increment: Prints current value FIRST, then adds 1\ncout << x++; // Output: 5 (but x is now 6 behind the scenes)\n\n// Pre-increment: Adds 1 FIRST, then prints the new value\ncout << ++x; // Output: 7 (adds 1 to 6, then prints 7)\n\n// Rule of thumb: If ++ is AFTER, the action happens AFTER.",
        explanation: "A very common pitfall! Using x++ inside a cout statement will print the old value before updating it."
      },
      {
        title: "Type Casting (When to use it)",
        code: "int total = 45;\nint items = 7;\n\n// Integer division drops the decimal: 45/7 = 6\ndouble badAvg = total / items; // badAvg = 6.0 (Wrong!)\n\n// We NEED casting to get the exact decimal (6.428...)\ndouble goodAvg = (double)total / items;\n//               ^^^^^^^^\n//               └──> Temporarily treats 'total' as 45.0\n\n// Modern C++ safer approach:\ndouble bestAvg = static_cast<double>(total) / items;\n//               ^^^^^^^^^^^^^^^^^^^\n//               └──> Explicitly and safely converts to double",
        explanation: "You need Type Casting when you are doing math with integers but want a precise decimal (double) result."
      },
      {
        title: "Integer vs Float Division",
        code: "cout << 5 / 2;   // Outputs 2 (Int / Int = Int)\ncout << 5.0 / 2; // Outputs 2.5 (Float / Int = Float)",
        explanation: "If both numbers are integers, C++ chops off the decimal. At least one must have a .0 to keep precision."
      },
      {
        title: "The Modulo Operator (%)",
        code: "int num = 10;\n// Modulo gives the REMAINDER of division\nint remainder = num % 3; // 10 / 3 = 3 with a remainder of 1\n\n// The most common use: Checking Even/Odd\nif (num % 2 == 0) {\n  cout << \"Even!\";\n}",
        explanation: "The % operator is essential for finding even/odd numbers or cycling through arrays."
      }
    ]
  }
];
