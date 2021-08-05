const grid = document.querySelector('#grid');
const colorPickers = document.querySelectorAll('.color-picker');
const modeButtons = document.querySelectorAll('.button');
const sizeSlider = document.querySelector('#size-slider');
const sizeSpans = document.querySelectorAll('.size');
let isDown = false;
let paintMode = 'color';
let colors = { background: colorPickers[0].value, fill: colorPickers[1].value };
let lastTile;
updateGrid();

function selectColor() {
	colors[this.name] = this.value;
}

function randomColor() {
	const h = Math.floor(Math.random() * 360);
	const l = Math.floor(Math.random() * 50 + 25);
	return `hsl(${h}, 100%, ${l}%)`;
}

function modifyColor([r, g, b], offset) {
	return `rgb(${r + offset}, ${g + offset}, ${b + offset})`;
}

function selectMode() {
	paintMode = this.dataset.mode;
	modeButtons.forEach(button => (button !== this) ? button.classList.remove('active') : button.classList.add('active'));
}

function updateGrid() {
	const size = sizeSlider.value;
	sizeSpans.forEach(span => span.textContent = size);
	grid.innerHTML = '';
	grid.style.grid = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

	for (let i = 0; i < size ** 2; i++) {
		const div = document.createElement('div');
		div.style.backgroundColor = colors.background;
		div.style.border = '1px solid gray';
		grid.appendChild(div);
	}
}

function paint(e) {
	e.preventDefault();
	tile = e.target;
	if (isDown && tile !== lastTile) {
		tileRgb = tile.style.backgroundColor.match(/\d+/g).map(Number);
		switch (paintMode) {
			case 'color':
				tile.style.backgroundColor = colors.fill;
				break;
			case 'rainbow':
				tile.style.backgroundColor = randomColor();
				break;
			case 'lighten':
				tile.style.backgroundColor = modifyColor(tileRgb, 20);
				break;
			case 'shading':
				tile.style.backgroundColor = modifyColor(tileRgb, -20);
				break;
		}
		lastTile = tile;
	}
}

colorPickers.forEach(picker => picker.addEventListener('change', selectColor));
modeButtons.forEach(button => button.addEventListener('click', selectMode))
sizeSlider.addEventListener('change', updateGrid);
grid.addEventListener('mousedown', e => {
	e.preventDefault();
	isDown = true;
});
grid.addEventListener('mouseup', () => isDown = false);
grid.addEventListener('mouseleave', () => isDown = false);
grid.addEventListener('mousemove', paint);
