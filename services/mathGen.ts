import { MathProblem } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numToWords(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return `negative ${numToWords(Math.abs(n))}`;
  
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  if (n < 20) return ones[n];
  
  const tenDigit = Math.floor(n / 10);
  const oneDigit = n % 10;
  
  if (tenDigit < 10) {
    return tens[tenDigit] + (oneDigit > 0 ? "-" + ones[oneDigit] : "");
  }
  
  if (n === 100) return "one hundred";
  return n.toString(); // Fallback
}

export function generateProblem(difficultyScore: number): MathProblem {
  // Difficulty scales based on accumulated money
  // Goal: User sees "nine plus ten", types "9+10"
  // Goal: User sees "a number plus one", types "x+1"

  let level = 1;
  if (difficultyScore > 6000) level = 5;
  else if (difficultyScore > 2500) level = 4;
  else if (difficultyScore > 800) level = 3;
  else if (difficultyScore > 200) level = 2;

  let question = '';
  let answer = '';

  const getOpWord = (op: string) => {
      switch(op) {
          case '+': return 'plus';
          case '-': return 'minus';
          case '*': return 'times';
          case '/': return 'divided by';
          default: return '';
      }
  };

  switch (level) {
    case 1: {
      // Level 1: Simple Arithmetic (Numbers only)
      // "five plus two" -> "5+2"
      const op = Math.random() > 0.5 ? '+' : '-';
      const a = getRandomInt(1, 15);
      const b = getRandomInt(1, 15);
      
      const first = op === '-' ? Math.max(a,b) : a;
      const second = op === '-' ? Math.min(a,b) : b;
      
      question = `${numToWords(first)} ${getOpWord(op)} ${numToWords(second)}`;
      answer = `${first}${op}${second}`;
      break;
    }
    case 2: {
      // Level 2: Intro to Variables (Add/Sub)
      // "a number plus five" -> "x+5"
      if (Math.random() > 0.4) {
          const op = Math.random() > 0.5 ? '+' : '-';
          const n = getRandomInt(1, 20);
          const varFirst = Math.random() > 0.5;
          
          if (op === '+') {
              if (varFirst) {
                  question = `a number plus ${numToWords(n)}`;
                  answer = `x+${n}`;
              } else {
                  question = `${numToWords(n)} plus a number`;
                  answer = `${n}+x`;
              }
          } else {
              // Minus
              if (varFirst) {
                  question = `a number minus ${numToWords(n)}`;
                  answer = `x-${n}`;
              } else {
                   question = `${numToWords(n)} minus a number`;
                   answer = `${n}-x`;
              }
          }
      } else {
          // Mixed with harder arithmetic
          const a = getRandomInt(10, 40);
          const b = getRandomInt(5, 30);
          const op = Math.random() > 0.5 ? '+' : '-';
          question = `${numToWords(a)} ${getOpWord(op)} ${numToWords(b)}`;
          answer = `${a}${op}${b}`;
      }
      break;
    }
    case 3: {
      // Level 3: Coefficients (Mult/Div with Variables)
      // "three times a number" -> "3x"
      const r = Math.random();
      if (r < 0.4) {
          // Coefficient
          const n = getRandomInt(2, 9);
          question = `${numToWords(n)} times a number`;
          answer = `${n}x`;
      } else if (r < 0.7) {
          // Division
          const n = getRandomInt(2, 9);
          question = `a number divided by ${numToWords(n)}`;
          answer = `x/${n}`;
      } else {
          // Numeric Multiplication
          const a = getRandomInt(2, 12);
          const b = getRandomInt(2, 12);
          question = `${numToWords(a)} times ${numToWords(b)}`;
          answer = `${a}*${b}`;
      }
      break;
    }
    case 4: {
      // Level 4: Two Step Expressions
      // "two times a number plus five" -> "2x+5"
      const coeff = getRandomInt(2, 9);
      const constant = getRandomInt(1, 20);
      const op = Math.random() > 0.5 ? '+' : '-';
      
      question = `${numToWords(coeff)} times a number ${getOpWord(op)} ${numToWords(constant)}`;
      answer = `${coeff}x${op}${constant}`;
      break;
    }
    case 5: {
      // Level 5: Negatives & Complex
      // "negative two times a number" -> "-2x"
      const r = Math.random();
      if (r > 0.5) {
           const coeff = getRandomInt(2, 9);
           const constant = getRandomInt(1, 10);
           question = `negative ${numToWords(coeff)} times a number plus ${numToWords(constant)}`;
           answer = `-${coeff}x+${constant}`;
      } else {
          // Variable subtraction
          const n = getRandomInt(1, 20);
          const m = getRandomInt(1, 20);
          question = `a number minus negative ${numToWords(n)}`;
          answer = `x--${n}`; // Technically correct translation for "minus negative"
      }
      break;
    }
    default:
      question = "one plus one";
      answer = "1+1";
  }

  return { question, answer, difficulty: level };
}