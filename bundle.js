(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
//const MiniCar = require('./miniCar.js');
//const RacerCar = require('./racerCar');
//const Sedan = require('./sedan');
//const Pickup = require('./pickup');
//const LilyPad = require('./lilyPad');
/* Global variables */
var offSet = 64;
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
/*var miniCar = new MiniCar({x: 70, y:0});
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
}*/

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
  /*
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
  */
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
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //ctx.drawImage(background, 0, 0);
  player.render(elapsedTime, ctx);
  /*miniCar.render(elapsedTime, ctx);
  racerCar.render(elapsedTime, ctx);
  sedan.render(elapsedTime,  ctx);
  pickup.render(elapsedTime, ctx);
  lilyPadRow1.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  lilyPadRow2.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  lilyPadRow3.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
*/ctx.fillStyle = "black";
  ctx.fillText("Score:" + player.getScore(), canvas.width - 80, 10);
  ctx.fillText("Current level:" + player.getLevel(),10, 10);
}

},{"./game.js":2,"./player.js":3}],2:[function(require,module,exports){
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

  var self = this;
  window.onkeydown = function(e) {
  	switch(e.which){
  		case 38: self.moveUp();
               self.state = "move";
  			break;
  		case 40: self.moveDown();
  		 break;
  		case 39: self.moveRight();
  			break;
  		case 37 : self.moveLeft();
  			break;
  		default : console.log('aqui');
  	}
  }
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

},{}]},{},[1]);
