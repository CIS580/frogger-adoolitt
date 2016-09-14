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
