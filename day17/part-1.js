// console.log(input);
const $grid = document.getElementById('grid');

const grid = new Grid($grid, input);
const path = //new Path(grid);
    new Path(grid, grid.getTile(0,0), grid.getTile(8,0))

$grid.addEventListener('click', () => {
    path.animate();
}, {once: true});

$grid.addEventListener('wheel', () => {
    path.update();
});

