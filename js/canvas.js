var vizCanvas = document.getElementById('visualizer');
var wrapper = document.getElementById('wrapper');
var c = vizCanvas.getContext('2d');

vizCanvas.width = $('.visualizer').innerWidth();
vizCanvas.height = $('.visualizer').innerHeight();

console.log(vizCanvas.height);

var x = 50;
var y = 50;
var dx = 3;
var dy = 3;
var radius = 15;

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
	c.beginPath();
	c.arc(x, y, radius, 0, Math.PI * 2, false);
	c.strokeStyle = 'lime';
	c.stroke();

	if (x + radius > vizCanvas.width || x - radius < 0) {
		dx = -dx;
	}

	if (y + radius > vizCanvas.height || y - radius < 0) {
		dy = -dy;
	}

	x += dx;
	y += dy;
}

animate();