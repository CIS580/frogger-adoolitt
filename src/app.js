"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const MiniCar = require('./miniCar.js');
const RacerCar = require('./racerCar');
const Sedan = require('./sedan');
const Pickup = require('./pickup');
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var miniCar = new MiniCar({x: 70, y:0});
var racerCar = new RacerCar({x: 150, y:0});
var sedan = new Sedan({x:300 , y: canvas.height - 60});
var pickup = new Pickup({x:380, y:canvas.height - 60});
var background = new Image()
background.src =  encodeURI('assets/background.png');
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
ctx.fillStyle = "black";
  ctx.fillText("Score:" + player.getScore(), canvas.width - 80, 10);
  ctx.fillText("Current level:" + player.getLevel(),10, 10);
}
