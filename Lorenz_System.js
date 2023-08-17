//Add 3d rotations, zooming in and out, Add depth perception
const canvas = document.getElementById("canvas");
const graphics = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const rotateButtonZ = document.getElementById("rotateButtonZ");
const rotateButtonX = document.getElementById("rotateButtonX");
const pi = Math.PI;

let x = .01;
let y = .01;
let z = .01;

let angleZ = 0;
let angleX = 0;

const sigma = document.getElementById("sigma");
const beta = document.getElementById("beta");
const rho = document.getElementById("rho");
const button = document.getElementById("button");

let dx, dy, dz;

let dt = .005;
let scale = 5;

let sigmaValue = Number(sigma.value);
let betaValue = Number(beta.value);
let rhoValue = Number(rho.value);

let oldList = [];
let newList = [];

//plotting a new lorenz attactor when the button is pressed
button.onclick = () => {
	graphics.clearRect(-width/2, -height/2, width, height);

	x = .01;
	y = .01;
	z = .01;

	angleZ = 0;
	angleX = 0;

	dx = 0;
	dy = 0;
	dz = 0;

	sigmaValue = Number(sigma.value);
	betaValue = Number(beta.value);
	rhoValue = Number(rho.value);

	oldList = [];
	newList = [];
}

let mouseDown = false;

canvas.addEventListener("mousedown", function(mouse) {
	mouseDown = true;
});

document.addEventListener("mouseup", function() {
	mouseDown = false;
});

document.addEventListener("mousemove", function(mouse) {
	if (mouseDown) {
		angleZ -= mouse.movementX/100;
		angleX -= mouse.movementY/100;
	}
});

let totalZoom = 1;

canvas.addEventListener("wheel", function(wheel) {
	const scale = Math.sign(wheel.wheelDelta)/50;

	totalZoom /= 1+scale;

	graphics.scale(1+scale, 1+scale);
})

function rotateAngleZ() {
	angleZ += .01;
}

function rotateAngleX() {
	angleX += .01;
}

function dist(x1, y1, x2, y2) {
	const a = x1-x2;
	const b = y1-y2;

	return Math.sqrt(a*a+b*b);
}

//Translating the canvas
graphics.translate(width/2, height/2);

function draw() {
	graphics.clearRect((-width/2)*totalZoom, (-height/2)*totalZoom, width*totalZoom, height*totalZoom);

	oldList.push({x:x*scale, y:y*scale, z:z*scale});

	dx = (sigmaValue*(y-x)) * dt
	dy = (x*(rhoValue-z)-y) * dt
	dz = (x*y-betaValue*z) * dt

	x += dx;
	y += dy;
	z += dz;

	newList.push({x:x*scale, y:y*scale, z:z*scale})

	graphics.strokeStyle = "white";
	graphics.lineWidth = 1;

	for (let i = 0; i < oldList.length; i++) {
		graphics.strokeStyle = `hsl(0, 0%, ${5000/dist(oldList[i].x*Math.cos(angleZ)-oldList[i].y*Math.sin(angleZ), oldList[i].y*Math.cos(angleX)-oldList[i].z*Math.sin(angleX), 0, 0)}%)`;
		graphics.beginPath();
		graphics.moveTo(oldList[i].x*Math.cos(angleZ)-oldList[i].y*Math.sin(angleZ), oldList[i].y*Math.cos(angleX)-oldList[i].z*Math.sin(angleX));
		graphics.lineTo(newList[i].x*Math.cos(angleZ)-newList[i].y*Math.sin(angleZ), newList[i].y*Math.cos(angleX)-newList[i].z*Math.sin(angleX));
		graphics.stroke();
	}

	if (rotateButtonZ.checked) {
		rotateAngleZ();
	}

	if (rotateButtonX.checked) {
		rotateAngleX();
	}
}

function update() {
	draw();

	requestAnimationFrame(update);
}

update();