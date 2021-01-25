import { Matrix } from './matrix-builder.js';
import { getMaxNumberOfCells } from './distances-meter.js';
import { traverseAlgorithm } from './traverse-algorithms.js';

const cellSize = 32;
const matrix = new Matrix(cellSize);

const traverseOptionsContainer = document.getElementById("traverse-options");
const traverseOptions = traverseOptionsContainer.getElementsByClassName("option-button");

const sizeButtons = document.querySelector(".matrix-and-buttons").getElementsByClassName("size-button");
const playTraverseBtn = document.getElementById("play-button");
const renewBtn = document.getElementById("renew-button");

const mobileTraverseBtn = document.getElementById("traverse-type").querySelector("button");

let isMobileTraverseBtnActive = false;
let isTraversing = false;
let currentTraverseOption = traverseOptions[0];

document.addEventListener('click', (event) => {
    const windowsWidth = document.documentElement.clientWidth;
    if (windowsWidth < 800 && isMobileTraverseBtnActive) {
        const isMobileTraverseBtn = mobileTraverseBtn.contains(event.target);
        if (!(isMobileTraverseBtn)) {
            changeMobileTraverseBtnStatus();
        }
    }
});

mobileTraverseBtn.addEventListener('click', () => {
    changeMobileTraverseBtnStatus();
});

window.addEventListener('resize', () => {
    const windowsWidth = document.documentElement.clientWidth;
    if (windowsWidth >= 800) {
        if (!(isMobileTraverseBtnActive)) {
            changeMobileTraverseBtnStatus();
        }
    } else {
        if (isMobileTraverseBtnActive) {
            changeMobileTraverseBtnStatus();
        }
    }
    if (matrix) matrix.totalResize();
});

for (const sizeBtn of sizeButtons) {
    if (sizeBtn.classList.contains("eccentric")) {
        if (sizeBtn.classList.contains("increase")) {
            sizeBtn.addEventListener('click', () => eccentricIncreaseEvent(sizeBtn));
        } else {
            sizeBtn.addEventListener('click', () => eccentricDecreaseEvent());
        }
    } else {
        if (sizeBtn.classList.contains("increase")) {
            sizeBtn.addEventListener('click', () => sideIncreaseEvent(sizeBtn));
        } else {
            sizeBtn.addEventListener('click', () => sideDecreaseEvent());
        }
    }
}

for (const traverseOption of traverseOptions) {
    traverseOption.addEventListener('click', () => traverseOptionEvent(traverseOption));
}

playTraverseBtn.addEventListener('click', async function () {
    playTraverseBtn.classList.add("traversing");
    if (matrix.isTraversed) matrix.renew();
    isTraversing = true;
    await traverseAlgorithm(currentTraverseOption.textContent, matrix.domAccesMatrixCells);
    isTraversing = false;
    matrix.isTraversed = true;
    playTraverseBtn.classList.remove("traversing");
});

renewBtn.addEventListener('click', () => matrix.renew());

function changeMobileTraverseBtnStatus() {
    if (isMobileTraverseBtnActive) {
        traverseOptionsContainer.style.display = "none";
        isMobileTraverseBtnActive = false;
        mobileTraverseBtn.querySelector("i").classList.remove("selected");
    } else {
        traverseOptionsContainer.style.display = "flex";
        isMobileTraverseBtnActive = true;
        mobileTraverseBtn.querySelector("i").classList.add("selected");
        debugger;
    }
}

function eccentricIncreaseEvent(sizeBtn) {
    if (!(isTraversing)) {
        const maxNumberOfCells = getMaxNumberOfCells(sizeBtn.parentElement,
            matrix.domMatrix, cellSize, 3);
       if (matrix.domAccesMatrixCells.length < maxNumberOfCells) {
           matrix.eccentricIncrease();
       }
    }  
}

function eccentricDecreaseEvent() {
    if (matrix.domAccesMatrixCells.length > 2 && !(isTraversing)) {
        matrix.eccentricDecrease();
    }
}

function sideIncreaseEvent(sizeBtn) {
    if (!(isTraversing)) {
        const maxNumberOfCells = getMaxNumberOfCells(sizeBtn.parentElement,
            matrix.domMatrix, cellSize, 3);
       if (matrix.domAccesMatrixCells[0].length < maxNumberOfCells) {
           matrix.sideIncrease()
       }
    }
}

function sideDecreaseEvent() {
    if (matrix.domAccesMatrixCells[0].length > 2 && !(isTraversing)) {
        matrix.sideDecrease();
    }
}

function traverseOptionEvent(traverseOption) {
    const mobileTraverseBtnSpan = mobileTraverseBtn.querySelector("span");
    mobileTraverseBtnSpan.textContent = traverseOption.textContent;
    currentTraverseOption.classList.remove("current");
    traverseOption.classList.add("current");
    currentTraverseOption = traverseOption;
}