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
var miniCar = new MiniCar({x: 75, y:0});
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

  miniCar.update(elapsedTime, canvas.width);
  racerCar.update(elapsedTime, canvas.width);
  sedan.update(elapsedTime, canvas.width);
  pickup.update(elapsedTime, canvas.width);
  lilyPadRow1.forEach(function(lilyPad) { lilyPad.update(elapsedTime , canvas.width);});
  lilyPadRow2.forEach(function(lilyPad) { lilyPad.update(elapsedTime , canvas.width);});
  lilyPadRow3.forEach(function(lilyPad) { lilyPad.update(elapsedTime , canvas.width);});
  player.update(elapsedTime, canvas.height);

  if(player.getState() == "dead")
  {
    player.resetIdle(resetIdle);
    console.log(player.lives);
  }

if(player.x > 520)
{
  player.onLily = false;
  lilyPadRow1.forEach(function(lilyPad)
  {
    if(player.checkForCollision(player, lilyPad) && lilyPad.state == "aboveWater")
    {
      player.onLily = true;
    }
  });

  lilyPadRow2.forEach(function(lilyPad)
  {
    if(player.checkForCollision(player, lilyPad) && lilyPad.state == "aboveWater")
    {
      player.onLily = true;
    }
  });

  lilyPadRow3.forEach(function(lilyPad)
  {
    if(player.checkForCollision(player, lilyPad) && lilyPad.state == "aboveWater")
    {
      player.onLily = true;
    }
  });
  if(!player.onLily)
  {
    player.state = "dead";
  }
}

if(player.checkForCollision(miniCar,player))
{
  player.state = "dead";
}

if(player.checkForCollision(racerCar,player))
{
  player.state = "dead";
}

if(player.checkForCollision(sedan,player))
{
  player.state = "dead";
}

if(player.checkForCollision(pickup,player))
{
  player.state = "dead";
}

  if(player.getState() == "win")
  {
    miniCar.IncreaseSpeed(player.getLevel());
    racerCar.IncreaseSpeed(player.getLevel());
    sedan.IncreaseSpeed(player.getLevel());
    pickup.IncreaseSpeed(player.getLevel());

    lilyPadRow1.forEach(function(lilyPad) { lilyPad.decreaseTime(player.getLevel());});
    lilyPadRow2.forEach(function(lilyPad) { lilyPad.decreaseTime(player.getLevel());});
    lilyPadRow3.forEach(function(lilyPad) { lilyPad.decreaseTime(player.getLevel());});

    player.resetIdle(resetIdle);
    console.log(player.x);
    console.log(player.y)
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
  miniCar.render(elapsedTime, ctx);
  racerCar.render(elapsedTime, ctx);
  sedan.render(elapsedTime,  ctx);
  pickup.render(elapsedTime, ctx);
  lilyPadRow1.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  lilyPadRow2.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  lilyPadRow3.forEach(function(lilyPad){lilyPad.render(elapsedTime, ctx);});
  player.render(elapsedTime, ctx);
ctx.fillStyle = "black";
  ctx.fillText("Score:" + player.getScore(), canvas.width - 80, 10);
  ctx.fillText("Current level:" + player.getLevel(),10, 10);
  ctx.fillText("Current number of lives:" + player.lives, (canvas.width / 2) , 10);
  if(player.getState() == "gameOver")
  {
    ctx.fillText("Game Over! You lose.", (canvas.width / 2), (canvas.height / 2));
  }
}
