const grid = document.querySelector('#grid');
const gridContainer = document.querySelector('#grid-container');
const colorPickers = document.querySelectorAll('.color-picker');
const modeButtons = document.querySelectorAll('.button.mode');
const sizeSlider = document.querySelector('#size-slider');
const sizeSpans = document.querySelectorAll('.size');
const gridToggle = document.querySelector('#grid-toggle');
const clearButton = document.querySelector('#clear');
const title = document.querySelector('#title');
const colors = { background: colorPickers[0].value, fill: colorPickers[1].value };
let isMouseDown = false;
let paintMode = 'color';
let gridLines = true;
let rainbowCounter = 0;
let lastGridRotation = 0;
let lastTile, rainbowTitleInterval;
title.style.color = colors.fill;
updateGrid();
resizeGrid();

function selectColor() {
	colors[this.name] = this.value;
	title.style.color = colors.fill;
}

function randomColor() {
	const hue = Math.floor(Math.random() * 360);
	const lightness = Math.floor(Math.random() * 50 + 25);
	return `hsl(${hue}, 100%, ${lightness}%)`;
}

function modifyColor([r, g, b], offset) {
	return `rgb(${r + offset}, ${g + offset}, ${b + offset})`;
}

function rainbowTitle() {
	if (paintMode === 'rainbow') {
		rainbowTitleInterval = setInterval(() => title.style.color = `hsl(${rainbowCounter++}, 100%, 50%)`, 5);
	} else {
		clearInterval(rainbowTitleInterval);
		title.style.color = colors.fill;
	}
}

function selectMode() {
	paintMode = this.dataset.mode;
	modeButtons.forEach(button => (button !== this) ? button.classList.remove('active') : button.classList.add('active'));
	rainbowTitle();
}

function previewGridSize() {
	sizeSpans.forEach(span => span.textContent = sizeSlider.value);
}

function updateGrid() {
	const size = sizeSlider.value;
	grid.innerHTML = '';
	grid.style.grid = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

	for (let i = 0; i < size ** 2; i++) {
		const tile = document.createElement('div');
		tile.classList.add('tile');
		tile.style.backgroundColor = colors.background;
		grid.appendChild(tile);
	}
}

function paint(e) {
	e.preventDefault();
	const tile = e.target;
	if (isMouseDown && tile !== lastTile) {
		let tileColor = tile.style.backgroundColor.match(/\d+/g);
		if (tileColor) tileColor = tileColor.map(Number);
		switch (paintMode) {
			case 'color':
				tile.style.backgroundColor = colors.fill;
				break;
			case 'rainbow':
				tile.style.backgroundColor = randomColor();
				break;
			case 'lighten':
				tile.style.backgroundColor = modifyColor(tileColor, 20);
				break;
			case 'shading':
				tile.style.backgroundColor = modifyColor(tileColor, -20);
				break;
			case 'eraser':
				tile.style.backgroundColor = colors.background;
		}
		lastTile = tile;
	}
}

function toggleGridLines() {
	gridLines = !gridLines;
	gridToggle.firstElementChild.innerHTML = gridLines ? 'grid_on' : 'grid_off';
	gridLines ? grid.classList.add('grid-lines') : grid.classList.remove('grid-lines');
}

function clearGrid() {
	for (let tile of grid.children) {
		tile.style.backgroundColor = colors.background;
	}
	grid.classList.remove('grid-lines');
	lastGridRotation += 180;
	grid.style.transform = `rotate(${lastGridRotation / 2}deg) rotateX(${lastGridRotation}deg)`;
}

function resizeGrid() {
	const gridRect = gridContainer.getBoundingClientRect();
	gridContainer.style.height = `${gridRect.width}px`;
}

colorPickers.forEach(picker => picker.addEventListener('change', selectColor));
modeButtons.forEach(button => button.addEventListener('click', selectMode))
sizeSlider.addEventListener('input', previewGridSize);
sizeSlider.addEventListener('change', updateGrid);
gridToggle.addEventListener('click', toggleGridLines);
clearButton.addEventListener('click', clearGrid);
grid.addEventListener('mousedown', e => {
	e.preventDefault();
	isMouseDown = true;
});
grid.addEventListener('mouseup', e => {
	paint(e);
	lastTile = null;
	isMouseDown = false;
});
grid.addEventListener('mouseleave', () => isMouseDown = false);
grid.addEventListener('mousemove', paint);
grid.addEventListener('transitionend', e => {
	if (e.propertyName === 'transform' && gridLines) {
		grid.classList.add('grid-lines');
	}
});
window.addEventListener('resize', resizeGrid);
