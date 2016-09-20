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
  this.startPositionY = position.y;
  this.lives = 3;
  this.score = 0;
  this.level = 1;
  this.direction = "";
  this.lastLife = false;
  this.onLily = false;

  var self = this;
  window.onkeydown = function(e) {
  	switch(e.which){
  		case 38: self.direction = "up";
               self.state = "move";
  			break;
  		case 40: self.direction = "down";
               self.state = "move";
  		 break;
  		case 39: self.direction = "right";
               self.state = "move";
  			break;
  		case 37 : this.direction = "left";
                this.state = "move";
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
  return this.state = "idle";
}

Player.prototype.checkForCollision = function(entity1, entity2) {
  var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);
  if(collides) {
    return true;
  }
}

Player.prototype.getScore = function ()
{
  return this.score;
}
/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time, Can_height) {
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
        if(this.direction == "right")
        {
          this.x++;
          //this.x += this.width;
        }
        else if(this.direction == "left")
        {
          if(this.x <= this.width)
          {
            this.x = this.width;
          }
          else
          {
            this.x -= this.width;
          }
        }
        else if(this.direction == "up")
        {
          if(this.y < this.height)
          {
            //this.y= this.height;
            this.y--;
          }
          else
          {
            this.y--;
            //this.y -= this.height;
          }
        }
        else if(this.direction == "down")
        {
          if(this.y > (Can_height - this.height))
          {
            this.y = Can_height - this.height;
          }
          else
          {
            this.y += this.height;
          }
        }
        else
        {
          console.log("Invalde direction");
        }
        this.timer += time;
        if(this.timer > 30)
         {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 5)
          {
            this.frame = 0;
            this.state = "idle";
          }
        }
        break;
      case "dead":
        this.x = this.startPositionX;
        this.y = this.startPositionY;
        this.lives--;
        if(this.lastLife)
        {
          this.state = "gameOver";
        }
        if(this.lives == 0)
        {
          this.lastLife = true;
        }
        break;
    case "win":
        console.log("Inside the win case");
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
