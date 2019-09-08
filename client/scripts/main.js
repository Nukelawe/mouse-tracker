const min_width = 15;
const max_width = 100;
const game_length = 3;

var canvas = document.getElementById('canvas');
var results = document.getElementById('results');
var timeScore = document.getElementById('time');
var missClickScore = document.getElementById('missclicks');

var context = canvas.getContext('2d');

var missClick = false;
var clickCount = 0;
var missClickCount = 0;
var startTime = null;
var target = null;
var data = null;
var path = null;

function startGame() {
	canvas.style.display = "block";
	results.style.display = "none";
	timeScore.style.display = "none";
	missClickScore.style.display = "none";

	data = [];
	clickCount = 0;
	missClickCount = 0;
	startTime = Date.now().valueOf();
}

function endGame() {
	canvas.style.display = "none";
	results.style.display = "block";
	timeScore.style.display = "block";
	missClickScore.style.display = "block";
	let time = Date.now().valueOf() - startTime;
	document.getElementById("time").innerHTML = "Time: " + (time / 1000 + missClickCount);
	document.getElementById("missclicks").innerHTML = "Miss clicks: " + missClickCount;
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/data", true);
	xhttp.send(JSON.stringify(data));
	target = null;
	data = null;
	path = null;
}

function newTarget() {
	width = min_width + Math.floor(Math.random() * (max_width - min_width));
	target = {
		width: width,
		x: Math.floor(Math.random() * (canvas.clientWidth - width)),
		y: Math.floor(Math.random() * (canvas.clientHeight - width))
	};
}

function render() {
	if (target == null) return;
	context.fillStyle = missClick ? '#5a1e1e' : '#000000';
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.fillStyle = '#ffffff';
	context.fillRect(target.x, target.y, target.width, target.width);
	context.fillStyle = '#ggff00';
	context.fillRect(target.x+1, target.y+1, target.width-2, target.width-2);
}

function onMouseEvent(event) {
	if (path == null) return;
	let canvasRect = canvas.getBoundingClientRect();
	let x = event.clientX - canvasRect.x;
	let y = event.clientY - canvasRect.y;
	path.push({
		type: event.type,
		timestamp: event.timeStamp,
		x: x - (target.x + target.width/2),
		y: y - (target.y + target.width/2)
	});
}

document.onmousedown = function(event) {
	onMouseEvent(event);
	let canvasRect = canvas.getBoundingClientRect();
	let x = event.clientX - canvasRect.x;
	let y = event.clientY - canvasRect.y;

	if (path == null) {
		startGame();
		path = [];
		newTarget();
	} else if (x >= target.x && x <= target.x + target.width && y >= target.y && y <= target.y + target.width) {
		data.push({
			path: path,
			target: target
		});
		path = [];
		++clickCount;
		newTarget();
	} else {
		++missClickCount;
		missClick = true;
	}

	if (clickCount >= game_length) endGame();
	render();
};
document.onmouseup = function(event) {
	onMouseEvent(event);
	missClick = false;
	render();
}
document.onmousemove = function(event) {
	onMouseEvent(event);
}
