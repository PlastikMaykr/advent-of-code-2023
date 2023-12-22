// console.log(input);
const $grid = document.getElementById('grid');

const grid = new Grid($grid, input);
const path = new Path(grid);

$grid.addEventListener('click', () => {
    path.animate();
}, {once: true});

$grid.addEventListener('wheel', () => {
    path.update();
});

