var symbolSize = 13;
var streams = [];

function setup() {
	createCanvas(
		window.innerWidth, 
		window.innerHeight);
	background(0);


	let x = 0;
	for (var i=0; i<=width/symbolSize; i++) {
		stream = new Stream();
		stream.generateSymbols(
			x, 
			random(-1000, 0)
			);	
		streams.push(stream);
		x += symbolSize;
	}

	textSize(symbolSize);
}

function draw() {
	background(0, 150);
	streams.forEach(function(stream) {
		stream.render();	
	});
	
}

function Symbol(x, y, speed, isShiner, alpha) {
	this.x = x;
	this.y = y;
	this.value;
	this.speed = speed;
	this.switchInterval = round(random(2, 20));
	this.isShiner = isShiner;
	this.alpha = alpha;

	this.setToRandomSymbol = function() {
		this.value = String.fromCharCode(
			0x30A0 + round(random(0,96))
			);

	}

	this.render = function() {
		if (this.isShiner) {
			fill(190, 255, 190);
		} else {
			fill(0, 255, 70, this.alpha);	
		}
		
		text(this.value, this.x, this.y);
		this.rain();
		if (frameCount % this.switchInterval == 0) {
			this.setToRandomSymbol();
			this.switchInterval = round(random(2, 20));	
		}
	}

	this.rain = function() {
		this.y = (this.y >= height*1.5) ? 0 : this.y += this.speed;

	}
}

function Stream() {
	this.symbols = [];
	this.totalSymbols = round(random(5, 40));
	this.speed = random(5, 20);

	this.generateSymbols = function(x, y) {
		let isShiner = round(random(0, 4)) == 1;
		for (var i=0; i<=this.totalSymbols; i++) {
			// Fade with position in stream
			let alpha = map(i, 0, this.totalSymbols, 255, 90);
			symbol = new Symbol(x, y, this.speed, isShiner, alpha);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize;
			isShiner = false;
		}
	}

	this.render = function() {
		this.symbols.forEach(function(symbol) {
			 symbol.render();
			});
	}
}