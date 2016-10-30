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

//////////////////////////////
////////// BULLET PROPERTIES
//////////////////////////////
var bulletProperties = {
  speed: 400,
  interval: 250,
  lifespan: 2000,
  maxCount: 30,
}

//////////////////////////////
////////// ASTEROID PROPERTIES
//////////////////////////////
var asteroidProperties = {
  startingAsteroids: 4, // # of asteroids at game start
  maxAsteroids: 20, // # asteroids that will appear in a round
  incrementAsteroids: 2, // # of additional asteroids per round

  // minVelocity: min asteroid speed
  // maxVelocity: max asteroid speed
  // minAngularVelocity: min rotation speed
  // maxAngularVelocity: max rotation speed
  // score: points a player will earn upon destroying
  // nextSize: next asteroid type to appear when this one is destroyed
  asteroidLarge: {minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, nextSize: graphicAssets.asteroidMedium.name },

  asteroidMedium: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50, nextSize: graphicAssets.asteroidSmall.name },

  asteroidSmall: { minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 100 },
};

var gameState = function(game){
  this.shipSprite;

  this.key_left;
  this.key_right;
  this.key_thrust;
  this.key_fire;

  this.bulletGroup;
  this.bulletInterval = 0;

  this.asteroidGroup;
  this.asteroidsCount = asteroidProperties.startingAsteroids;
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
      this.resetAsteroids();
    },


    //////////////////////////////
    ////////// UPDATE
    //////////////////////////////
    update: function () {
      this.checkPlayerInput();
      this.checkBoundaries(this.shipSprite);
      this.asteroidGroup.forEachExists(this.checkBoundaries, this);
    },

    //////////////////////////////
    ////////// GRAPHICS
    //////////////////////////////
    initGraphics: function () {
      // add the player's ship to the game world
      //game.add.sprite( x coordinate, y coordinate, key to reference the image to use
      this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
      // angle the ship so its facing the top of the screen
      this.shipSprite.angle = -90;
      // spawn the ship in the center of the screen
      this.shipSprite.anchor.set(0.5, 0.5);

      // create a group for bullets for manipulation
      this.bulletGroup = game.add.group();
      // create a group of asteroids for manipulation
      this.asteroidGroup = game.add.group();
    },

    //////////////////////////////
    ////////// PHYSICS
    //////////////////////////////
    initPhysics: function () {

      // make physics available in this game
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // apply physics properties on the ship
      game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
      this.shipSprite.body.drag.set(shipProperties.drag);
      this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);

      // apply physics properties to the ship's bullets
      this.bulletGroup.enableBody = true;
      this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
      // add the bullets to the bullet group
      // ( # OF BULLETS, GRAPHIC TO USE )
      this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
      // set the spawn point of the bullets to be the x and y location of the player's ship (first parameter). The second parameter specifies the location withing the ship's width/height for the bullet to spawn. Here is it .5 or 50%
      this.bulletGroup.setAll('anchor.x', 0.5);
      this.bulletGroup.setAll('anchor.y', 0.5);
      // set when the bullets will be removed from the game
      this.bulletGroup.setAll('lifespan', bulletProperties.lifespan);

      // ARCADE physics will be used on the asteroids
      this.asteroidGroup.enableBody = true;
      this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    // Pass a key code value that corresponds with the key pressed. For example, LEFT's value is 37.
    initKeyboard: function () {
      this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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

      if (this.key_fire.isDown) {
        this.fire();
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
    },


    fire: function () {
      // check if the game clock has passed the minimum bullet fire interval
      if (game.time.now > this.bulletInterval) {
        // create a new bullet in our bullet group
        var bullet = this.bulletGroup.getFirstExists(false);

        // if a new bullet was successfully created (should always be true unless the max bullets number has been reached)...
        if (bullet) {

          // length will be used to position the bullet directly in front of the ship
          var length = this.shipSprite.width * 0.5;
          // calculate the coordinates of the bullet in relation to the ship
          var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
          var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);

          // reset makes the bullet appear on the screen at the coordinates calculated in the lines above
          bullet.reset(x, y);
          bullet.lifespan = bulletProperties.lifespan;
          bullet.rotation = this.shipSprite.rotation;

          // set the bullet speed and direction
          game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
          // set when the bullet should disappear
          this.bulletInterval = game.time.now + bulletProperties.interval;
        }
      }
    },

    // size argument is asteroidSmall, asteroidMedium, or asteroidLarge
    createAsteroid: function (x, y, size) {

      // create a new asteroid and add it to the asteroid group
      var asteroid = this.asteroidGroup.create(x, y, size);
      // generate random rotation speed
      // [size] is replaced with the value of the size argument
      asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);

      // generate random angle
      // angle() returns value between -180 to 180.
      var randomAngle = game.math.degToRad(game.rnd.angle());
      // generate random speed
      var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);

      // assign the generated values to the asteroid
      game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);


    },

    resetAsteroids: function () {
      for (var i=0; i < this.asteroidsCount; i++ ) {
        var side = Math.round(Math.random());
        var x;
        var y;

        if (side) {
          x = Math.round(Math.random()) * gameProperties.screenWidth;
          y = Math.random() * gameProperties.screenHeight;
        } else {
          x = Math.random() * gameProperties.screenWidth;
          y = Math.round(Math.random()) * gameProperties.screenHeight;
        }
        this.createAsteroid(x, y, graphicAssets.asteroidLarge.name);
      }
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);