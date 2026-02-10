
import { MathProblem } from '../types';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
  let level = 1;
  if (difficultyScore > 6000) level = 5;
  else if (difficultyScore > 2500) level = 4;
  else if (difficultyScore > 800) level = 3;
  else if (difficultyScore > 200) level = 2;

  let question = '';
  let answer = '';
  let distractors: string[] = [];

  switch (level) {
    case 1: {
      // Level 1: Arithmetic Translation & Basic Operations
      const type = Math.floor(Math.random() * 5); // 0-4
      const a = getRandomInt(1, 12);
      const b = getRandomInt(1, 12);

      if (type === 0) {
          // Standard: "five plus two"
          const op = Math.random() > 0.5 ? 'plus' : 'minus';
          question = `${numToWords(a)} ${op} ${numToWords(b)}`;
          answer = op === 'plus' ? `${a}+${b}` : `${a}-${b}`;
          // Distractors: wrong op, reversed numbers, wrong sign
          distractors = [
              op === 'plus' ? `${a}-${b}` : `${a}+${b}`,
              `${b}${op === 'plus' ? '+' : '-'}${a}`,
              op === 'plus' ? `${a}*${b}` : `${a}/${b}`
          ];
      } else if (type === 1) {
          // "Sum of"
          question = `the sum of ${numToWords(a)} and ${numToWords(b)}`;
          answer = `${a}+${b}`;
          distractors = [`${a}-${b}`, `${a}*${b}`, `${a}/${b}`];
      } else if (type === 2) {
          // "Difference of"
          question = `the difference between ${numToWords(a)} and ${numToWords(b)}`;
          answer = `${a}-${b}`;
          distractors = [`${a}+${b}`, `${b}-${a}`, `${a}*${b}`];
      } else if (type === 3) {
          // "Product of"
          const smA = getRandomInt(2, 9);
          const smB = getRandomInt(2, 9);
          question = `the product of ${numToWords(smA)} and ${numToWords(smB)}`;
          answer = `${smA}*${smB}`;
          distractors = [`${smA}+${smB}`, `${smA}/${smB}`, `${smA}-${smB}`];
      } else {
          // "Quotient of"
          const divisor = getRandomInt(2, 9);
          const quotient = getRandomInt(2, 9);
          const dividend = divisor * quotient;
          question = `the quotient of ${numToWords(dividend)} and ${numToWords(divisor)}`;
          answer = `${dividend}/${divisor}`;
          distractors = [`${dividend}*${divisor}`, `${dividend}-${divisor}`, `${divisor}/${dividend}`];
      }
      break;
    }
    case 2: {
        // Level 2: Intro to Variables (Add/Sub with phrase variety)
        const type = Math.floor(Math.random() * 4);
        const n = getRandomInt(1, 12);

        if (type === 0) {
            const op = Math.random() > 0.5 ? 'plus' : 'minus';
            question = `a number ${op} ${numToWords(n)}`;
            answer = op === 'plus' ? `x+${n}` : `x-${n}`;
            distractors = [
                op === 'plus' ? `x-${n}` : `x+${n}`, 
                `${n}x`, 
                op === 'plus' ? `${n}-x` : `${n}+x`
            ];
        } else if (type === 1) {
             const isInc = Math.random() > 0.5;
             question = `a number ${isInc ? 'increased' : 'decreased'} by ${numToWords(n)}`;
             answer = isInc ? `x+${n}` : `x-${n}`;
             distractors = [
                 isInc ? `x-${n}` : `x+${n}`,
                 `${n}x`,
                 isInc ? `${n}-x` : `${n}+x`
             ];
        } else if (type === 2) {
             const isMore = Math.random() > 0.5;
             question = `${numToWords(n)} ${isMore ? 'more' : 'less'} than a number`;
             answer = isMore ? `x+${n}` : `x-${n}`;
             distractors = [
                 isMore ? `x-${n}` : `x+${n}`,
                 isMore ? `${n}-x` : `${n}+x`,
                 `${n}x`
             ];
        } else {
             // Subtract from
             question = `subtract ${numToWords(n)} from a number`;
             answer = `x-${n}`;
             distractors = [`${n}-x`, `x+${n}`, `${n}x`];
        }
        break;
    }
    case 3: {
        // Level 3: Coefficients & Special Terms
        const type = Math.floor(Math.random() * 4);
        
        if (type === 0) {
            // Standard Times
            const n = getRandomInt(2, 9);
            question = `${numToWords(n)} times a number`;
            answer = `${n}x`;
            distractors = [`x+${n}`, `x/${n}`, `${n}+x`];
        } else if (type === 1) {
            // Special words
            const sub = Math.random();
            if (sub < 0.33) {
                question = "double a number";
                answer = "2x";
                distractors = ["x+2", "x/2", "x^2"];
            } else if (sub < 0.66) {
                question = "triple a number";
                answer = "3x";
                distractors = ["x+3", "x/3", "x^3"];
            } else {
                question = "half of a number";
                answer = "x/2";
                distractors = ["2x", "x-2", "x+2"];
            }
        } else if (type === 2) {
            // Product
            const n = getRandomInt(2, 9);
            question = `the product of ${numToWords(n)} and a number`;
            answer = `${n}x`;
            distractors = [`x+${n}`, `${n}/x`, `x-${n}`];
        } else {
            // Quotient
            const n = getRandomInt(2, 9);
            question = `the quotient of a number and ${numToWords(n)}`;
            answer = `x/${n}`;
            distractors = [`${n}x`, `${n}/x`, `x-${n}`];
        }
        break;
    }
    case 4: {
        // Level 4: Two Step Expressions
        const n = getRandomInt(2, 5);
        const c = getRandomInt(1, 10);
        const type = Math.floor(Math.random() * 3);

        if (type === 0) {
            // Standard
            question = `${numToWords(n)} times a number plus ${numToWords(c)}`;
            answer = `${n}x+${c}`;
            distractors = [
                `${n}x-${c}`, 
                `${c}x+${n}`, 
                `${n}(x+${c})`
            ];
        } else if (type === 1) {
            // More/Less than product
            const isMore = Math.random() > 0.5;
            question = `${numToWords(c)} ${isMore ? 'more' : 'less'} than ${numToWords(n)} times a number`;
            answer = isMore ? `${n}x+${c}` : `${n}x-${c}`;
            distractors = [
                isMore ? `${n}x-${c}` : `${n}x+${c}`,
                isMore ? `${c}x+${n}` : `${c}x-${n}`,
                isMore ? `${c}- ${n}x` : `${n}x`
            ];
        } else {
            // Double/Triple mixed
            const isDouble = Math.random() > 0.5;
            const term = isDouble ? "double a number" : "triple a number";
            const coeff = isDouble ? 2 : 3;
            const isInc = Math.random() > 0.5;
            question = `${term} ${isInc ? 'increased' : 'decreased'} by ${numToWords(c)}`;
            answer = isInc ? `${coeff}x+${c}` : `${coeff}x-${c}`;
            distractors = [
                isInc ? `${coeff}x-${c}` : `${coeff}x+${c}`,
                isInc ? `x+${coeff + c}` : `x-${coeff + c}`,
                `${c}x`
            ];
        }
        break;
    }
    case 5: {
        // Level 5: Complex Linear (Negatives, Reverse Order)
        const type = Math.floor(Math.random() * 4);
        const n = getRandomInt(2, 5);
        const c = getRandomInt(1, 10);
        
        if (type === 0) {
            // Negative Two-Step Standard: "negative 3 times a number plus 5"
            const op = Math.random() > 0.5 ? 'plus' : 'minus';
            question = `negative ${numToWords(n)} times a number ${op} ${numToWords(c)}`;
            answer = op === 'plus' ? `-${n}x+${c}` : `-${n}x-${c}`;
            distractors = [
                op === 'plus' ? `${n}x+${c}` : `${n}x-${c}`, // Positive coeff
                op === 'plus' ? `-${n}x-${c}` : `-${n}x+${c}`, // Wrong op
                op === 'plus' ? `${c}-${n}x` : `${c}+${n}x`    // Order swap
            ];
        } else if (type === 1) {
             // "Less than" with negative slope: "5 less than negative 2 times a number" -> -2x - 5
            question = `${numToWords(c)} less than negative ${numToWords(n)} times a number`;
            answer = `-${n}x-${c}`;
            distractors = [
                `-${n}x+${c}`,
                `${n}x-${c}`,
                `${c}-${n}x`
            ];
        } else if (type === 2) {
            // "Subtract from" constant (Reverse Order): "subtract 4 times a number from 10" -> 10 - 4x
            question = `subtract ${numToWords(n)} times a number from ${numToWords(c)}`;
            answer = `${c}-${n}x`;
            distractors = [
                `${n}x-${c}`,
                `${c}+${n}x`,
                `-${n}x-${c}`
            ];
        } else {
             // "Subtract from" variable term: "subtract 10 from negative 3 times a number" -> -3x - 10
            question = `subtract ${numToWords(c)} from negative ${numToWords(n)} times a number`;
            answer = `-${n}x-${c}`;
            distractors = [
                `-${n}x+${c}`,
                `${c}-${n}x`,
                `${n}x-${c}`
            ];
        }
        break;
    }
  }

  // Ensure options are unique and cleaned up
  const cleanAnswer = answer.replace(/\s/g, '');
  const cleanDistractors = distractors.map(d => d.replace(/\s/g, ''))
    .filter(d => d !== cleanAnswer); // Remove duplicates of answer
  
  // Fill if we don't have enough distinct distractors (rare but possible with low numbers)
  while (cleanDistractors.length < 3) {
      const randomVal = getRandomInt(1, 20);
      const filler = `${randomVal}x`;
      if (filler !== cleanAnswer && !cleanDistractors.includes(filler)) {
          cleanDistractors.push(filler);
      } else {
          cleanDistractors.push(`${cleanAnswer}+1`);
      }
  }

  const distinctOptions = Array.from(new Set([cleanAnswer, ...cleanDistractors.slice(0, 3)]));
  // If set removed duplicates, pad again
  while (distinctOptions.length < 4) {
      distinctOptions.push(`${getRandomInt(1, 99)}x`);
  }

  const options = shuffleArray(distinctOptions.slice(0, 4));

  return { question, answer: cleanAnswer, options, difficulty: level };
}
