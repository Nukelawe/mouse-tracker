const min_width = 15;
const max_width = 100;
const game_length = 43;

var canvas = document.getElementById('canvas');
var results = document.getElementById('results');
var timeScore = document.getElementById('time');
var missClickScore = document.getElementById('missclicks');

var context = canvas.getContext('2d');

var missClick = false;
var clickCount = 0;
var missClickCount = 0;
var startTime = null;

var target = { x: 0, y: 0, width: 0 };

function startGame() {
	canvas.style.display = "block";
	results.style.display = "none";
	timeScore.style.display = "none";
	missClickScore.style.display = "none";

	clickCount = 0;
	missClickCount = 0;
	startTime = Date.now().valueOf();
}

function endGame() {
	canvas.style.display = "none";
	results.style.display = "block";
	timeScore.style.display = "block";
	missClickScore.style.display = "block";
	setResults();
	target.width = 0;
}

function newTarget() {
	target.width = min_width + Math.floor(Math.random() * (max_width - min_width));
	target.x = Math.floor(Math.random() * (canvas.clientWidth - target.width));
	target.y = Math.floor(Math.random() * (canvas.clientHeight - target.width));
}

function setResults() {
	let timeResult = document.getElementById("time");
	let missClickResult = document.getElementById("missclicks");
	let time = Date.now().valueOf() - startTime;
	timeResult.innerHTML = "Time: " + (time / 1000 + missClickCount);
	missClickResult.innerHTML = "Miss clicks: " + missClickCount;
}

function render() {
	if (clickCount >= game_length) endGame();
	context.fillStyle = missClick ? '#5a1e1e' : '#000000';
	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
	context.fillStyle = '#ffffff';
	context.fillRect(target.x, target.y, target.width, target.width);
	context.fillStyle = '#ggff00';
	context.fillRect(target.x+1, target.y+1, target.width-2, target.width-2);
}

document.onmousedown = function(event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.x;
	let y = event.clientY - rect.y;
	if (target.width === 0) {
		startGame();
		newTarget();
	} else if (x >= target.x && x <= target.x + target.width && y >= target.y && y <= target.y + target.width) {
		++clickCount;
		newTarget();
	} else {
		++missClickCount;
		missClick = true;
	}
	render();
};

document.onmouseup = function(event) {
	missClick = false;
	render();
}

document.onmousemove = function(event) {
	console.log(event);
}
