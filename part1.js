import * as fs from 'node:fs/promises';

let text = await fs.readFile("./input.txt", { encoding: 'utf8' });
let lines = text.split("\n");

let partNumberTotal = 0;

console.time("parse");
for (let i = 0; i < lines.length; i++) {
	partNumberTotal += evaluateLine(i);
}
console.timeEnd("parse");

console.log(`Part number total: ${partNumberTotal}`);

function evaluateLine(lineNumber) {
	const line = lines[lineNumber];

	let consequtiveNumbers = [];
	let lastWasNumber = false;
	let isPartNumber = false;

	let sumLine = 0;

	for (let i = 0; i < line.length; i++) {
		if (isNumber(line[i])) {

			if (!isPartNumber) {
				if (!lastWasNumber) {
					lastWasNumber = true;
					isPartNumber = checkAdjacentSymbolAll(lineNumber, i);
				} else {
					isPartNumber = checkAdjacentSymbol(lineNumber, i);
				}
			}

			consequtiveNumbers.push(line[i]);

			if (i === line.length - 1) {
				if (isPartNumber) {
					sumLine += numberFromDigitArray(consequtiveNumbers);
				}
			}

		} else {

			if (line[i] === ".") {
				if (isPartNumber && consequtiveNumbers.length > 0) {
					sumLine += numberFromDigitArray(consequtiveNumbers);
				}
				isPartNumber = false;
			} else {
				//	Exclude the newline char
				if (line[i].charCodeAt(0) !== 13) {
					isPartNumber = true;
				}

				if (isPartNumber && consequtiveNumbers.length > 0) {
					sumLine += numberFromDigitArray(consequtiveNumbers);
				}
			}

			consequtiveNumbers = [];
			lastWasNumber = false;
		}
	}

	return sumLine;
}

function numberFromDigitArray(array) {
	let accumulator = 0;

	for (let i = 0; i < array.length; i++) {
		const place = (array.length - 1) - i;
		accumulator += array[i] * Math.pow(10, place);
	}

	return accumulator;
}

function isNumber(char) {
	return !!char.match(/\d/);
}

//	Returns true if the character is not a number, period or newline character
function isSymbol(char) {
	return (!isNumber(char)) && (char !== ".") && (char.charCodeAt(0) !== 13);
}


//	Checks for symbols in all adjacent directions except same line one before 
//	(we never run this if that was a number)
//	and same line next, we catch that anyway in the main loop
function checkAdjacentSymbolAll(lineNumber, index) {

	//Check previous line
	if (lineNumber > 0) {

		const lastLine = lines[lineNumber - 1];

		if (index > 0) {
			if (isSymbol(lastLine[index - 1])) {
				return true;
			}
		}

		if (isSymbol(lastLine[index])) {
			return true;
		}

		if (index < lastLine.length - 1) {
			if (isSymbol(lastLine[index + 1])) {
				return true;
			}
		}
	}

	//Check next line
	if (lineNumber < lines.length - 1) {

		const nextLine = lines[lineNumber + 1];

		if (index > 0) {
			if (isSymbol(nextLine[index - 1])) {
				return true;
			}
		}

		if (isSymbol(nextLine[index])) {
			return true;
		}

		if (index < nextLine.length - 1) {
			if (isSymbol(nextLine[index + 1])) {
				return true;
			}
		}
	}

	return false;
}

//	Checks for symbols in the next position over in the row above and below
//	This covers all options for subsequent digits if the above function is run for the first
function checkAdjacentSymbol(lineNumber, index) {

	if (index < lines[lineNumber].length - 1) {
		//Check previous line
		if (lineNumber > 0) {

			if (isSymbol(lines[lineNumber - 1][index + 1])) {
				return true;
			}

		}

		//Check next line
		if (lineNumber < lines.length - 1) {

			if (isSymbol(lines[lineNumber + 1][index + 1])) {
				return true;
			}

		}
	}

	return false;
}