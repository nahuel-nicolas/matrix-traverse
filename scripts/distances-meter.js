export function getMaxNumberOfCells(buttonsContainer, matrix, cellSize, margin=0) {
    const distance = getDistanceBetweenElements(buttonsContainer, matrix);
    const maxNumberOfCellFromCenters = Math.floor(distance / cellSize);
    return maxNumberOfCellFromCenters * 2 - margin;
}

//Get the distance among two elements
function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b); 
    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);  
}

function getPositionAtCenter(element) {
    const {top, left, width, height} = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2
    };
}
 
 // const distance = getDistanceBetweenElements(document.getElementById("x"), document.getElementById("y"));