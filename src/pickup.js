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
