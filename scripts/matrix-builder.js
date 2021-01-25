import {getMaxNumberOfCells} from './distances-meter.js';

export class Matrix {
    constructor(cellSize) {
        this.isTraversed = false;
        this.cellSize = cellSize;
        this.domMatrix = this.getNewDomMatrix();
        this.domAccesMatrixCells = [];
        this.domAccesMatrixRows = [];
        this.fillUpMatrix();
    }

    getNewDomMatrix() {
        const matrixContainer = document.getElementById("matrix-container");

        const matrixAndButtons = document.createElement("div");
        matrixAndButtons.setAttribute("class", "matrix-and-buttons");
        matrixContainer.appendChild(matrixAndButtons);

        this.buildSizeButtonsPair({"up": true, "down": false}, "eccentric", matrixAndButtons);

        const matrixAndCenterButtons = document.createElement("div");
        matrixAndCenterButtons.setAttribute("class", "matrix-and-center-buttons");
        matrixAndButtons.appendChild(matrixAndCenterButtons);

        // Within "matrix-and-center-buttons"
        this.buildSizeButtonsPair({"left": true, "right": false}, "side", matrixAndCenterButtons);

        // Building the actual domMatrix
        const domMatrix = document.createElement("div");
        domMatrix.setAttribute("class", "matrix");
        matrixAndCenterButtons.appendChild(domMatrix);

        this.buildSizeButtonsPair({"left": false, "right": true}, "side", matrixAndCenterButtons);
        // Without "matrix-and-center-buttons"

        this.buildSizeButtonsPair({"up": false, "down": true}, "eccentric", matrixAndButtons);

        return domMatrix;
    }

    buildSizeButtonsPair(isSizeGrowButton, sideType, parentContainer) {
        // isSizeGrowButton is an object with 2 keys, each key
        // indicates the button's side. If the key maps to true
        // means that the button has to increase the matrix 
        // size. Otherwise, if the key maps to false, means
        // that the button has to decrease the matrix size.
        const buttonsContainer = document.createElement("div");
        buttonsContainer.setAttribute("class", "buttons-container");
        buttonsContainer.classList.add(sideType + "container");
        for (const currentSide in isSizeGrowButton) {
            const buttonAction = isSizeGrowButton[currentSide] ? "increase" : "decrease";
            this.buildGrowButton(buttonsContainer, [currentSide, buttonAction, sideType, "size-button"]);
        }
        parentContainer.appendChild(buttonsContainer);
        return buttonsContainer;
    }

    buildGrowButton(buttonsContainer, buttonClasses) {
        const button = document.createElement("button");
        const classAtt = document.createAttribute("class");
        const btnSideClass = buttonClasses[0];

        const btnIcon = document.createElement("i");
        const btnIconClassName = "fas fa-chevron-" + btnSideClass;
        btnIcon.setAttribute("class", btnIconClassName);
        button.appendChild(btnIcon);

        button.setAttributeNode(classAtt);
        for (const buttonClass of buttonClasses) {
            button.classList.add(buttonClass);
        }
        buttonsContainer.appendChild(button);
    }

    fillUpMatrix() {
        const maxRowNumber = this.getMaxNumOf("row");
        const maxColNumber = this.getMaxNumOf("col");
        for (let i = 0; i < maxRowNumber; i++) {
            this.buildNewDomRow(maxColNumber);
        }
    }

    getMaxNumOf(element) {
        let currentButtonsContainer;
        if (element === "row" || element === "rows") {
            currentButtonsContainer = this.domMatrix.
            parentElement.parentElement.querySelector(".eccentric");
        } else if (element === "col" || "cols") {
            currentButtonsContainer = this.domMatrix.
                parentElement.querySelector(".side");
        }
        
        // For instance maxRowNumber (Element = Row and btnsContainerType = "eccentric")
        const maxElementNumber = getMaxNumberOfCells(currentButtonsContainer,
            this.domMatrix, this.cellSize, 6);
        
        return Math.max(maxElementNumber, 2);
    }

    buildNewDomRow(rowLength) {
        const domRow = document.createElement("div");
        domRow.setAttribute("class", "row");
        const domAccesRow = [];

        // Fill up row with cells
        for (let j = 0; j < rowLength; j++) {
            const domCell = this.newDomCell();
            domAccesRow.push(domCell);
            domRow.appendChild(domCell);
        }

        this.domAccesMatrixCells.push(domAccesRow);
        this.domAccesMatrixRows.push(domRow);
        this.domMatrix.appendChild(domRow);
        return domRow;
    }

    newDomCell() {
        // Create number within the cell
        const domSpan = document.createElement("span");

        // Create the cell
        const domCell = document.createElement("div");
        domCell.setAttribute("class", "cell");
        domCell.appendChild(domSpan);
        return domCell;
    }

    renew() {
        if (this.isTraversed) {
            for (let i = 0; i < this.domAccesMatrixCells.length; i++) {
                for (let j = 0; j < this.domAccesMatrixCells[i].length; j++) {
                    this.renewCell(i, j);
                }
            }
            this.isTraversed = false;
        }
    }

    renewCell(row, col) {
        const cell = this.domAccesMatrixCells[row][col];
        const cellSpan = cell.querySelector("span");
        cellSpan.textContent = "";
    }

    totalResize() {
        const maxNumOfRow = this.getMaxNumOf("row");
        while (this.domAccesMatrixCells.length < maxNumOfRow) {
            this.eccentricIncrease();
        }
        while (this.domAccesMatrixCells.length > maxNumOfRow) {
            this.eccentricDecrease();
        }

        const maxNumOfCol = this.getMaxNumOf("col");
        while (this.domAccesMatrixCells[0].length < maxNumOfCol) {
            this.sideIncrease();
        }
        while (this.domAccesMatrixCells[0].length > maxNumOfCol) {
            this.sideDecrease();
        }
        
        this.renew();
    }

    eccentricIncrease() {
        this.buildNewDomRow(this.domAccesMatrixCells[0].length);
        this.renew();
    }

    eccentricDecrease() {
        this.domAccesMatrixCells.pop();
        const rowToRemove = this.domAccesMatrixRows.pop();
        rowToRemove.remove();
        this.renew();
    }

    sideIncrease() {
        this.sideResizer(true);
        this.renew();
    }

    sideDecrease() {
        this.sideResizer(false);
        this.renew();
    }

    sideResizer(isIncrease) {
        for (let i = 0; i < this.domAccesMatrixCells.length; i++) {
            if (isIncrease) {
                const newCell = this.newDomCell();
                this.domAccesMatrixCells[i].push(newCell);
                this.domAccesMatrixRows[i].appendChild(newCell);
            } else {
                const cellToRemove = this.domAccesMatrixCells[i].pop();
                cellToRemove.remove();
            } 
        }
    }

    printCell(row, col) {
        const cell = this.domAccesMatrixCells[row][col];
        cell.style.backgroundColor = "red";
    }
}

