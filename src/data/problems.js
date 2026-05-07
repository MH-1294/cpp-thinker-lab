export const problems = [
  {
    id: "beecrowd-1001",
    title: "1001 - Extremely Basic Summation",
    source: "Beecrowd",
    description: "Read two integer values. After this, calculate the sum between them and assign it to the variable X. Print X as shown below. Don't present any message beyond what is being specified.",
    input: "The input file contains two integer numbers.",
    output: "Print the letter X (uppercase) with a blank space before and after the equal signal followed by the value of X, according to the following example.",
    sampleInput: "10\n9",
    sampleOutput: "X = 19"
  },
  {
    id: "uva-10071",
    title: "10071 - Back to High School Physics",
    source: "UVA Online Judge",
    description: "A particle has initial velocity and constant acceleration. If its velocity after certain time is v then what will its displacement be in twice of that time? Write a program to find the displacement in twice of the given time.",
    input: "The input will contain two integers in each line. Each line makes one set of input. These two integers denote the value of v (-100 <= v <= 100) and t (0 <= t <= 200).",
    output: "For each line of input, print a single integer in one line denoting the displacement in double of that time.",
    sampleInput: "0 0\n5 12",
    sampleOutput: "0\n120"
  },
  {
    id: "cs110-3",
    title: "Area of a Circle",
    source: "CS:110 Fundamental",
    description: "The formula to calculate the area of a circumference is defined as A = π . R2. Considering to this problem that π = 3.14159, calculate the area using the formula given in the problem description.",
    input: "The input contains a value of floating point (double precision), that is the variable R.",
    output: "Present the message \"A=\" followed by the value of the variable, as in the example bellow, with four places after the decimal point.",
    sampleInput: "2.00",
    sampleOutput: "A=12.5664"
  },
  {
    id: "cf-4a",
    title: "4A - Watermelon",
    source: "Codeforces",
    description: "One hot summer day Pete and his friend Billy decided to buy a watermelon. They chose the biggest and the ripest one, in their opinion. After that the watermelon was weighed, and the scales showed w kilos. They rushed home, dying of thirst, and decided to divide the berry, however they faced a hard problem. Pete and Billy are great fans of even numbers, that's why they want to divide the watermelon in such a way that each of the two parts weighs even number of kilos, at the same time it is not obligatory that the parts are equal.",
    input: "The first (and the only) input line contains integer number w (1 <= w <= 100) - the weight of the watermelon bought by the boys.",
    output: "Print YES, if the boys can divide the watermelon into two parts, each of them weighing even number of kilos; and NO in the opposite case.",
    sampleInput: "8",
    sampleOutput: "YES"
  },
  {
    id: "uva-100",
    title: "100 - The 3n + 1 problem",
    source: "UVA Online Judge",
    description: "Consider the following algorithm: 1. input n. 2. print n. 3. if n = 1 then STOP. 4. if n is odd then n = 3n + 1. 5. else n = n / 2. 6. GOTO 2. Given the input 22, the following sequence of numbers will be printed 22 11 34 17 52 26 13 40 20 10 5 16 8 4 2 1. For any two numbers i and j you are to determine the maximum cycle length over all numbers between i and j.",
    input: "The input will consist of a series of pairs of integers i and j, one pair of integers per line. All integers will be less than 1,000,000 and greater than 0.",
    output: "For each pair of input integers i and j you should output i, j, and the maximum cycle length for integers between and including i and j.",
    sampleInput: "1 10\n100 200",
    sampleOutput: "1 10 20\n100 200 125"
  }
];
