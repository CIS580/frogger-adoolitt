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
