function sleep(ms=0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function writeMatrixCell(cell, number) {
    const cellSpan = cell.querySelector("span");
    await sleep(20);
    cellSpan.textContent = String(number);
}

async function verticalTraverse(matrix) {
    const startRow = 0;
    const endRow = matrix.length - 1;
    const endCol = matrix[0].length - 1;
    let row = 0;
    let col = 0;
    let currentNum = 0;
    let isGoingDown = true;
    while (col <= endCol) {
        console.log([row, col]);
        await writeMatrixCell(matrix[row][col], currentNum++);
        if (isGoingDown) {
            if (row === endRow) {
                col++;
                isGoingDown = false;
            } else {
                row++;
            }
        } else {
            if (row === startRow) {
                col++;
                isGoingDown = true;
            } else {
                row--;
            }
        }
    }
}

async function horizontalTraverse(matrix) {
    const endRow = matrix.length - 1;
    const startCol = 0;
    const endCol = matrix[0].length - 1;
    let row = 0;
    let col = 0;
    let currentNum = 0;
    let isGoingRight = true;
    while (row <= endRow) {
        await writeMatrixCell(matrix[row][col], currentNum++);
        if (isGoingRight) {
            if (col === endCol) {
                row++;
                isGoingRight = false;
            } else {
                col++;
            }
        } else {
            if (col === startCol) {
                row++;
                isGoingRight = true;
            } else {
                col--;
            }
        }
    }
}

async function spiralTraverse(matrix) {
    let startRow = 0;
    let endRow = matrix.length - 1;
    let startCol = 0;
    let endCol = matrix[0].length - 1;
    let currentNum = 0;
    while (startRow <= endRow && startCol <= endCol) {
        for (let col = startCol; col <= endCol; col++) {
            await writeMatrixCell(matrix[startRow][col], currentNum++);
        }

        for (let row = startRow; row <= endRow; row++) {
            await writeMatrixCell(matrix[row][endCol], currentNum++);
        }

        for (let col = endCol - 1; col >= startCol; col--) {
            // Single Row in the midle of the matrix.
            if (startRow === endRow) break;
            await writeMatrixCell(matrix[endRow][col], currentNum++);
        }

        for (let row = endRow - 1; row > startRow; row--) {
            // Single Column in the middle of the matrix
            if (startCol === endCol) break;
            await writeMatrixCell(matrix[row][startCol], currentNum++);
        }

        startRow++;
        endRow--;
        startCol++;
        endCol--;
    }
}

// zigzagTraverse helper
function isNotOutOfRange(row, col, width, height) {
	return row <= height && row >= 0 && col <= width && col >= 0;
}

async function zigzagTraverse(matrix) {
    const width = matrix[0].length - 1;
	const height = matrix.length - 1;
	let row = 0;
	let col = 0;
    let isGoingDown = true;
    let currentNum = 0;
	while (isNotOutOfRange(row, col, width, height)) {
		await writeMatrixCell(matrix[row][col], currentNum++);
		if (isGoingDown) {
			if (row == height || col == 0) {
				isGoingDown = false;
				if (row == height) {col++;}
				else if (col == 0) {row++;} 
			} else {
				row++;
				col--;
			}
		} else if (!(isGoingDown)) {
			if (row == 0 || col == width) {
				isGoingDown = true;
				if (col == width ) {row++;}
				else if (row == 0) {col++;}
			} else {
				row--;
				col++;
			}
		}	
	}
}

export async function traverseAlgorithm(traverseType, matrix) {
    if (traverseType === "vertical") {
        await verticalTraverse(matrix);
    } else if (traverseType === "horizontal") {
        await horizontalTraverse(matrix);
    } else if (traverseType === "spiral") {
        await spiralTraverse(matrix);
    } else {
        await zigzagTraverse(matrix);
    }
}
