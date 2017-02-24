var symbolSize = 13;
var symbolDistanceX = -2;
var symbolDistanceY = 5;
var streamMinStartPositionY = -1000;

var streamHandler;

function setup() {
	createCanvas(
		window.innerWidth, 
		window.innerHeight);
	background(0);

	streamHandler = new StreamHandler();
	streamHandler.generateStreams();
	
	textSize(symbolSize);
}

function draw() {
	background(0, 150);

	streamHandler.render();
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
			fill(170, 255, 170);
		} else {
			fill(0, 255, 70, this.alpha);	
		}
		
		text(this.value, this.x, this.y);
		this.rain();
		if (frameCount % this.switchInterval == 0) {
			this.setToRandomSymbol();
			// New random interval till next switch
			this.switchInterval = round(random(2, 20));	
		}
	}

	this.rain = function() {
		// this.y = (this.y >= height*1.5) ? 0 : this.y += this.speed;
		this.y += this.speed;
	}
}

function Stream() {
	this.symbols = [];
	this.totalSymbols;
	this.speed;
	this.maxAlpha;
	this.minAlpha;

	this.generateSymbols = function(x, y) {
		this.symbols.length = 0;
		this.totalSymbols = round(random(5, 40));
		this.speed = random(5, 20);
		this.maxAlpha = random(80, 250);
		this.minAlpha = this.maxAlpha - 180;
		
		let isShiner = round(random(0, 4)) == 1;
		for (var i=0; i<=this.totalSymbols; i++) {
			// Fade with position in stream
			let alpha = map(i, 0, this.totalSymbols, this.maxAlpha, this.minAlpha);
			symbol = new Symbol(x, y, this.speed, isShiner, alpha);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize + symbolDistanceY;
			isShiner = false;
		}
	}

	this.render = function() {
		this.symbols.forEach(function(symbol) {
			 symbol.render();
			});
	}

	this.isGoneFromView = function() {
		return this.symbols[this.symbols.length-1].y > height;
	}
}

function StreamHandler() {
	this.streams = [];

	this.generateStreams = function() {
		this.streams.length = 0;
		let x = 0;
		for (var i=0; i<=width/(symbolSize + symbolDistanceX); i++) {
			stream = new Stream();
			stream.generateSymbols(
				x, 
				random(streamMinStartPositionY, 0)
				);	
			this.streams.push(stream);
			x += symbolSize + symbolDistanceX;
		}
	}

	this.render = function() {
		this.streams.forEach(function(stream) {
			if (stream.isGoneFromView()) {
				console.log('gone ' + stream.symbols[0].x);
				stream.generateSymbols(
					stream.symbols[0].x, 
					random(streamMinStartPositionY, 0)
					);
			}
			stream.render();	
		});
	}
}