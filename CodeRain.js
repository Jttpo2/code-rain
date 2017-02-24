var symbolSize = 30;
var streams = [];

function setup() {
	createCanvas(
		window.innerWidth, 
		window.innerHeight);
	background(0);


	var x = 0, y = 0;
	for (var i=0; i<=width/symbolSize; i++) {
		stream = new Stream();
		stream.generateSymbols(x, y);	
		streams.push(stream);
		x += symbolSize;
	}

	textSize(symbolSize);
}

function draw() {
	background(0);
	streams.forEach(function(stream) {
		stream.render();	
	});
	
}

function Symbol(x, y, speed) {
	this.x = x;
	this.y = y;
	this.value;
	this.speed = speed;
	this.switchInterval = round(random(2, 20));

	this.setToRandomSymbol = function() {
		this.value = String.fromCharCode(
			0x30A0 + round(random(0,96))
			);

	}

	this.render = function() {
		fill(0, 255, 70);
		text(this.value, this.x, this.y);
		this.rain();
		if (frameCount % this.switchInterval == 0) {
			this.setToRandomSymbol();	
		}
	}

	this.rain = function() {
		this.y = (this.y >= height) ? 0 : this.y += this.speed;

	}
}

function Stream() {
	this.symbols = [];
	this.totalSymbols = round(random(5, 30));
	this.speed = random(5, 20);

	this.generateSymbols = function(x, y) {
		// var y = 0;
		// var x = width/2;

		for (var i=0; i<=this.totalSymbols; i++) {
			symbol = new Symbol(x, y, this.speed);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize;
		}
	}

	this.render = function() {
		this.symbols.forEach(function(symbol) {
			 symbol.render();
			});
	}
}