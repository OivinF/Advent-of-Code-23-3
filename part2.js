import * as fs from 'node:fs/promises';

let text = await fs.readFile("./input.txt", { encoding: 'utf8' });
let lines = text.split("\n");

let totalRatio = 0;

console.time("parse");
for (let i = 0; i < lines.length; i++) {
	totalRatio += evaluateLine(i);
}
console.timeEnd("parse");

console.log(`\nTotal Gear Ratio: ${totalRatio}`);

function evaluateLine(lineNumber) {
	const line = lines[lineNumber];
	let lineRatios = 0;

	for (let i = 0; i < line.length; i++) {
		if (line[i] === "*") {
			const gearResult = checkAdjacentNumbers(lineNumber, i);
			if (gearResult.gear) {

				//	locations[0] and locations[1] are the two numbers that make up this gear
				//	this chart shows their relative position to the gear *
				//	NW:	0,	N: 1,	NE:	2
				//	W:	3, 		,	E:	5
				//	SW:	6,	S: 7,	SE:	8

				let location = gearResult.locations[0];
				let lineOffset = (location < 3 ? -1 : (location > 5 ? 1 : 0));
				let charOffset = (location % 3) - 1;
				const first = getNumberAtLocation(lineNumber + lineOffset, i + charOffset);

				location = gearResult.locations[1];
				lineOffset = (location < 3 ? -1 : (location > 5 ? 1 : 0));
				charOffset = (location % 3) - 1;
				const second = getNumberAtLocation(lineNumber + lineOffset, i + charOffset);

				lineRatios += first * second;
			}
		}

	}

	return lineRatios;
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

//	Checks for numbers in all adjacent directions
function checkAdjacentNumbers(lineNumber, index) {

	let neighborNumbers = 0;
	//	NW:	0,	N: 1,	NE:	2
	//	W:	3, 		,	E:	5
	//	SW:	6,	S: 7,	SE:	8
	let foundNumberLocations = [];

	function incrementNeighborNumbers() {
		neighborNumbers += 1;
		if (neighborNumbers > 2) {
			return { gear: false, locations: [] };
		}
	}

	//	Check previous line
	if (lineNumber > 0) {

		const lastLine = lines[lineNumber - 1];

		let a = false, b = false;

		if (index > 0) {
			if (isNumber(lastLine[index - 1])) {
				incrementNeighborNumbers();
				foundNumberLocations.push(0);
				a = true;
			}
		}

		if (isNumber(lastLine[index])) {

			if (!a) {
				incrementNeighborNumbers();
				foundNumberLocations.push(1);
			}

			b = true;
		}

		if (!b) {
			if (index < lastLine.length - 1) {
				if (isNumber(lastLine[index + 1])) {
					incrementNeighborNumbers();
					foundNumberLocations.push(2);
				}
			}
		}
	}

	//	Check this line
	const thisLine = lines[lineNumber];

	if (index > 0) {
		if (isNumber(thisLine[index - 1])) {
			incrementNeighborNumbers();
			foundNumberLocations.push(3);
		}
	}

	if (index < thisLine.length - 1) {
		if (isNumber(thisLine[index + 1])) {
			incrementNeighborNumbers();
			foundNumberLocations.push(5);
		}
	}

	//	Check next line
	if (lineNumber < lines.length - 1) {

		const nextLine = lines[lineNumber + 1];

		let a = false, b = false;

		if (index > 0) {
			if (isNumber(nextLine[index - 1])) {
				incrementNeighborNumbers();
				foundNumberLocations.push(6);
				a = true;
			}
		}

		if (isNumber(nextLine[index])) {

			if (!a) {
				incrementNeighborNumbers();
				foundNumberLocations.push(7);
			}

			b = true;
		}

		if (!b) {
			if (index < nextLine.length - 1) {
				if (isNumber(nextLine[index + 1])) {
					incrementNeighborNumbers();
					foundNumberLocations.push(8);
				}
			}
		}
	}

	return { gear: neighborNumbers === 2, locations: foundNumberLocations };
}

function getNumberAtLocation(lineNumber, index) {

	const line = lines[lineNumber];
	//	Check backwards
	let firstIndex = index;

	for (let i = index; i >= 0; i--) {
		if (isNumber(line[i])) {
			firstIndex = i;
		} else {
			break;
		}
	}

	let accumulator = [];

	//	Check forwards
	for (let i = firstIndex; i < line.length; i++) {
		if (isNumber(line[i])) {
			accumulator.push(line[i]);
		} else {
			break;
		}
	}

	return (numberFromDigitArray(accumulator));
}