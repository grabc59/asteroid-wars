'use strict';
// Canvas size
var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};


// graphicAssets data structure
// OBJECT { // object containing all graphics
//  OBJECT:{ // object for the particular graphic
//    URL: STRING, // the path of the image to use
//    NAME: STRING // the reference to use for the graphic
//    ...
//  }
// }
var graphicAssets = {
  ship:{URL:'assets/ship.png', name:'ship'},
  bullet: {URL:'assets/bullet.png', name:'bullet'},

  asteroidLarge:{URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
  asteroidMedium:{URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
  asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
};

//////////////////////////////
////////// SHIP PROPERTIES
//////////////////////////////
var shipProperties = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    acceleration: 300,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 200,
};


var gameState = function(game){
  this.shipSprite;
  this.key_left;
  this.key_right;
  this.key_thrust;
};

gameState.prototype = {

//////////////////////////////
////////// PRELOAD
//////////////////////////////
    preload: function () {
      // load image graphics for use in the game
      // game.load.image(KEY, URL, [OVERWRITE])
      // optional overwrite argument, to replace an asset if the specified key already exists
      game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
      game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
      game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);

      game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
      game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);


    },


//////////////////////////////
////////// CREATE
//////////////////////////////
    create: function () {
      this.initGraphics();
      this.initPhysics();
      this.initKeyboard();
    },


//////////////////////////////
////////// UPDATE
//////////////////////////////
    update: function () {
      this.checkPlayerInput();
      this.checkBoundaries(this.shipSprite);
    },

//////////////////////////////
////////// GRAPHICS
//////////////////////////////
    initGraphics: function () {
      // add the player's ship to the game world
      //game.add.sprite( x coordinate, y coordinate, key to reference the image to use
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      this.shipSprite.angle = -90;
      this.shipSprite.anchor.set(0.5, 0.5);
    },

//////////////////////////////
////////// PHYSICS
//////////////////////////////
    initPhysics: function () {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
      this.shipSprite.body.drag.set(shipProperties.drag);
      this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
    },

// Pass a key code value that corresponds with the key pressed. For example, LEFT's value is 37.
    initKeyboard: function () {
      this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    },

// listen for directional arrow presses
// this is called every frame loop
// only one key is being checked at a time
    checkPlayerInput: function () {
      if (this.key_left.isDown) {
        this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
      } else if (this.key_right.isDown) {
        this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
      } else {
        this.shipSprite.body.angularVelocity = 0;
      }
      if (this.key_thrust.isDown) {
        game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
      } else {
        this.shipSprite.body.acceleration.set(0);
      }
    },

// If an object reaches the edge of the game screen, make it appear on the opposite side of the screen. This prevents the player from drifting off out of sight. The update function passes this function the player's ship sprite only.
    checkBoundaries: function (sprite) {
      if (sprite.x < 0) {
        sprite.x = game.width;
      } else if (sprite.x > game.width) {
        sprite.x = 0;
      }

      if (sprite.y < 0) {
        sprite.y = game.height;
      } else if (sprite.y > game.height) {
        sprite.y = 0;
      }
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
