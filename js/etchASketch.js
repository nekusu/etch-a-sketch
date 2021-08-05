const grid = document.querySelector('#grid');
const sizeSlider = document.querySelector('#size-slider');
const sizeSpans = document.querySelectorAll('.size');
updateGrid();

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

sizeSlider.addEventListener('change', updateGrid);
