var symbolSize = 12;
var symbolDistanceX = -3;
var symbolDistanceY = symbolSize/3;
var streamMinStartPositionY = -1500;

var gapChance = 0.5;

var streamHandler;

function setup() {
	frameRate(15);
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
		// Randomly select from Katanaka symbols and integers 0-9
		let noOfKatakanaSymbols = 96;
		let arabianIntegers = 10;
		let randomIndex = round(random(0, noOfKatakanaSymbols + arabianIntegers));
		let charCode;
		if (randomIndex <= noOfKatakanaSymbols) {
			charCode = 0x30A0 + randomIndex;
		} else {
			charCode = 0x0030 + (randomIndex - noOfKatakanaSymbols);
		}

		this.value = String.fromCharCode(charCode);

		// Introducing gaps in the code
		this.gapChance = gapChance;
		if (isShiner) {
			this.gapChance /= 8;
		}
		if (random() < this.gapChance) {
			this.value = " ";
		}
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
		this.y += this.speed;
	}
}

function Stream(x) {
	this.symbols = [];
	this.xPos = x;
	this.totalSymbols;
	this.speed;
	this.maxAlpha;
	this.minAlpha;
	this.endPointY;

	this.generateSymbols = function(y) {
		this.symbols.length = 0;
		this.totalSymbols = round(random(5, 40));
		this.speed = round(randomGaussian(10, 2));
		this.maxAlpha = random(80, 250);
		this.minAlpha = this.maxAlpha - 180;
		this.endPointY = this.getRandomEndPoint();
		
		let isShiner = round(random(0, 4)) == 1;
		for (var i=0; i<=this.totalSymbols; i++) {
			// Fade with position in stream
			let alpha = map(i, 0, this.totalSymbols, this.maxAlpha, this.minAlpha);
			symbol = new Symbol(this.xPos, y, this.speed, isShiner, alpha);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize + symbolDistanceY;
			isShiner = false;
		}
	}

	this.render = function() {
		this.removeSymbolsPastEndPoint();

		this.symbols.forEach(function(symbol) {
			 symbol.render();
			});
	}

	this.isGoneFromView = function() {
		return this.symbols.length <= 0;
	}

	this.removeSymbolsPastEndPoint = function() {
		for (let i=this.symbols.length-1; i>=0; i--) {
			if (this.symbols[i].y > this.endPointY || this.symbols[i].y > height) {
				this.symbols.splice(i, 1);
			}
		}
	}

	this.getRandomEndPoint = function() {
		if (random() < 0.4) {
			return round(random(0, height));
		} else {
			return height;
		}
	}
}

function StreamHandler() {
	this.streams = [];

	this.generateStreams = function() {
		this.streams.length = 0;
		let x = 0;
		for (var i=0; i<=width/(symbolSize + symbolDistanceX); i++) {
			stream = new Stream(x);
			stream.generateSymbols(
				random(streamMinStartPositionY, 0)
				);	
			this.streams.push(stream);
			x += symbolSize + symbolDistanceX;
		}
	}

	this.render = function() {
		this.streams.forEach(function(stream) {
			if (stream.isGoneFromView()) {
				stream.generateSymbols(
					random(streamMinStartPositionY, 0)
					);
			}
			stream.render();	
		});
	}
}