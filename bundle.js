(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const MiniCar = require('./miniCar.js');
const RacerCar = require('./racerCar');
const Sedan = require('./sedan');
const Pickup = require('./pickup');
const LilyPad = require('./lilyPad');
/* Global variables */
var offSet = 64;
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var miniCar = new MiniCar({x: 70, y:0});
var racerCar = new RacerCar({x: 150, y:0});
var sedan = new Sedan({x:300 , y: canvas.height - 60});
var pickup = new Pickup({x:380, y:canvas.height - 60});
var background = new Image()
background.src =  encodeURI('assets/background.png');
var lilyPadRow1 = [];
var lilyPadRow2 = [];
var lilyPadRow3 = [];
for(var i=0; i < 8; i++)
{
  if(i != 1 && i != 3 && i != 5)
  {
    lilyPadRow1.push(new LilyPad({
      x: 520,
      y: 0 + (offSet * i)
    }));
  }
}

for(var i=0; i < 7; i++)
{
  if(i != 3)
  {
    lilyPadRow2.push(new LilyPad({
      x: 570,
      y: 0 + (offSet * i)
    }));
  }
}

for(var i=0; i < 7; i++)
{
  if(i != 0 && i != 2 && i != 3 && i != 5)
  {
    lilyPadRow3.push(new LilyPad({
      x: 620,
      y: 0 + (offSet * i)
    }));
  }
}

var resetIdle = "idle";
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  miniCar.update(elapsedTime, canvas.width);
  racerCar.update(elapsedTime, canvas.width);
  sedan.update(elapsedTime, canvas.width);
  pickup.update(elapsedTime, canvas.width);
  lilyPadRow1.forEach(function(lilyPad) { lilyPad.update(elapsedTime , canvas.width);});
  lilyPadRow2.forEach(function(lilyPad) { lilyPad.update(elapsedTime , canvas.width);});
  lilyPadRow3.forEach(function(lilyPad) { lilyPad.update(elapsedTime , canvas.width);});

  if(player.getState() == "win")
  {
    miniCar.IncreaseSpeed(player.getLevel());
    racerCar.IncreaseSpeed(player.getLevel());
    sedan.IncreaseSpeed(player.getLevel());
    pickup.IncreaseSpeed(player.getLevel());

    lilyPadRow1.IncreaseSpeed(player.getLevel());
    lilyPadRow2.IncreaseSpeed(player.getLevel());
    lilyPadRow3.IncreaseSpeed(player.getLevel());

    player.setState(resetIdle);
  }
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  //ctx.fillStyle = "lightblue";
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0);
  player.render(elapsedTime, ctx);
  miniCar.render(elapsedTime, ctx);
  racerCar.render(elapsedTime, ctx);
  sedan.render(elapsedTime,  ctx);
  pickup.render(elapsedTime, ctx);
  lilyPadRow1.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  lilyPadRow2.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  lilyPadRow3.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
ctx.fillStyle = "black";
  ctx.fillText("Score:" + player.getScore(), canvas.width - 80, 10);
  ctx.fillText("Current level:" + player.getLevel(),10, 10);
}

},{"./game.js":2,"./lilyPad":3,"./miniCar.js":4,"./pickup":5,"./player.js":6,"./racerCar":7,"./sedan":8}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = LilyPad;
/**
 * @constructor miniCar
 * Creates a new miniCar object
 * @param {Postition} position object specifying an x and y
 */
function LilyPad(position) {
  this.state = "aboveWater";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.Lily  = new Image();
  this.Lily.src = encodeURI('assets/lilyPad.png');
  this.timer = 0;
  this.frame = 0;
  this.aboveWater = 4000;
  this.belowWater = 2000;
}

/**
 * @function updates the miniCar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
LilyPad.prototype.update = function(time, y) {
// TODO: Implement your player's update by state
this.timer += time;
switch(this.state) {
  case "aboveWater":
    if(this.timer >= this.aboveWater)
    {
      this.state = "belowWater";
      this.timer = 0;
    }
    break;
  case "belowWater":
  if(this.timer >= this.aboveWater)
  {
    this.state = "aboveWater";
    this.timer = 0;
  }
    break;
  }
}

LilyPad.prototype.decreaseTime = function(level)
{
  this.aboveWater -= (level * 1.5);
  this.belowWater -= (level * 1.5);
}

LilyPad.prototype.render = function(time, ctx) {
      if(this.state == "aboveWater")
      {
        ctx.drawImage(
          // image
          this.Lily,
          // source rectangle
          //this.frame * 64, 64, this.width, this.height,
          // destination rectangle
          this.x, this.y, this.width, this.height
        )
    }
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = MiniCar;
/**
 * @constructor miniCar
 * Creates a new miniCar object
 * @param {Postition} position object specifying an x and y
 */
function MiniCar(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.svg');
  this.timer = 0;
  this.frame = 0;
  this.speed = 2;
}

/**
 * @function updates the miniCar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
MiniCar.prototype.update = function(time, y) {
// TODO: Implement your player's update by state
      this.y += this.speed;
      if(this.y > y)
      {
        this.y = 0;
      }
}

MiniCar.prototype.IncreaseSpeed = function()
{
  return speed += (level * 1);
}

MiniCar.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
}

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Pickup;
/**
 * @constructor miniCar
 * Creates a new miniCar object
 * @param {Postition} position object specifying an x and y
 */
function Pickup(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/TRBRYcars [Converted] pickup.svg');
  this.timer = 0;
  this.frame = 0;
  this.speed = 2;
}

/**
 * @function updates the miniCar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Pickup.prototype.update = function(time, y) {
// TODO: Implement your player's update by state
      this.y -= this.speed;
      if(this.y < 0)
      {
        this.y = (y - this.height);
      }
}

Pickup.prototype.IncreaseSpeed = function()
{
  return speed += (level * 1);
}

Pickup.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  this.startPositionX = position.x;
  this.startPositionX = position.y;
  this.lives = 3;
  this.score = 0;
  this.level = 1;
}


Player.prototype.getLevel = function ()
{
  return this.level;
}

Player.prototype.getState = function()
{
  return this.state;
}

Player.prototype.resetIdle = function(idle)
{
  return this.state = idle;
}

Player.prototype.getScore = function ()
{
  return this.score;
}
/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
// TODO: Implement your player's update by state
  if(this.x >= 660)
  {
    this.state = "win";
  }
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
      case "move":
        this.moveFrog();
        this.timer += time;
        if(this.timer > MS_PER_FRAME)
         {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 5) this.frame = 0;
        }
        break;
      case "dead":
        this.x = this.startPositionX;
        this.Y = this.startPositionY;
        this.lives--;
        break;
    case "win":
        this.score += 10;
        this.level++;
        this.x = this.startPositionX;
        this.y = this.startPositionY;
      break;
    case "gameOver":
    break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
    case "moving":
    // image
    this.spritesheet,
    // source rectangle
    this.frame * 64, 64, this.width, this.height,
    // destination rectangle
    this.x, this.y, this.width, this.height
      break;
    case "dead":
      break;
    case "win":
      break;
    case "gameOver":
      break
  }
}

Player.prototype.moveFrog = function(e) {
	switch(e.which){
		case 38: this.moveUp();
             this.state = "move";
			break;
		case 40: this.moveDown();
		 break;
		case 39: this.moveRight();
			break;
		case 37 : this.moveLeft();
			break;
		default : console.log('aqui');
	}
}

Player.prototype.moveUp = function() {
	this.y -= 1;
  this.state = "idle";
}

Player.prototype.moveDown = function () {
	this.y += 1;
  this.state = "idle";
}

Player.prototype.moveLeft = function () {
	this.x -= 1;
  this.state = "idle";
}

Player.prototype.moveRight = function () {
	this.x += 1;
  this.state = "idle";
}

},{}],7:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = RacerCar;
/**
 * @constructor miniCar
 * Creates a new miniCar object
 * @param {Postition} position object specifying an x and y
 */
function RacerCar(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_racer.svg');
  this.timer = 0;
  this.frame = 0;
  this.speed = 5;
}

/**
 * @function updates the miniCar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
RacerCar.prototype.update = function(time, y) {
// TODO: Implement your player's update by state
      this.y += this.speed;
      if(this.y > y)
      {
        this.y = 0;
      }
}

RacerCar.prototype.IncreaseSpeed = function()
{
  return speed += (level * 1.5);
}

RacerCar.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
}

},{}],8:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Sedan;
/**
 * @constructor miniCar
 * Creates a new miniCar object
 * @param {Postition} position object specifying an x and y
 */
function Sedan(position) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/TRBRYcars [Converted] sedan.svg');
  this.timer = 0;
  this.frame = 0;
  this.speed = 2 * Math.random();
}

/**
 * @function updates the miniCar object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Sedan.prototype.update = function(time, y) {
// TODO: Implement your player's update by state
      this.y -= this.speed;
      if(this.y < 0)
      {
        this.y = (y - this.height);
      }
}

Sedan.prototype.IncreaseSpeed = function()
{
  return speed += (level * 1);
}

Sedan.prototype.render = function(time, ctx) {
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
}

},{}]},{},[1]);
