const grid = document.querySelector('#grid');
const colorPicker = document.querySelector('#color-picker');
const modeButtons = document.querySelectorAll('.button');
const sizeSlider = document.querySelector('#size-slider');
const sizeSpans = document.querySelectorAll('.size');
let isDown = false;
let paintMode = 'color';
let selectedColor, lastTile;
selectColor()
updateGrid();

function selectColor() {
	selectedColor = colorPicker.value;
}

function randomColor() {
	const h = Math.floor(Math.random() * 360);
	const l = Math.floor(Math.random() * 50 + 25);
	return `hsl(${h}, 100%, ${l}%)`;
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
		div.style.border = '1px solid gray';
		grid.appendChild(div);
	}
}

function paint(e) {
	e.preventDefault();
	if (isDown && e.target !== lastTile) {
		switch (paintMode) {
			case 'color':
				e.target.style.backgroundColor = selectedColor;
				break;
			case 'rainbow':
				e.target.style.backgroundColor = randomColor();
				break;
		}
		lastTile = e.target;
	}
}

colorPicker.addEventListener('change', selectColor);
modeButtons.forEach(button => button.addEventListener('click', selectMode))
sizeSlider.addEventListener('change', updateGrid);
grid.addEventListener('mousedown', e => {
	e.preventDefault();
	isDown = true;
});
grid.addEventListener('mouseup', () => isDown = false);
grid.addEventListener('mouseleave', () => isDown = false);
grid.addEventListener('mousemove', paint);
