'use strict';
// Canvas size
var gameProperties = {
    screenWidth: 760,
    screenHeight: 480,
};
var states = {
    // main: "main",
    game: "game",
};


////////////////////////////////
//////// GRAPHIC ASSETS
////////////////////////////////
// stores game images for manipulation
var graphicAssets = {
    background: {
      URL: 'assets/deep-space-background.jpg',
      name: 'background',
    },
    ship: {
        URL: 'assets/x-wing-white.png',
        name: 'ship'
    },
    bullet: {
        URL: 'assets/green-laser.png',
        name: 'bullet'
    },
    enemySmall: {
        URL: 'assets/tie-fighter-top-white.png',
        name: 'enemySmall'
    },
    // asteroidMedium: {
    //     URL: 'assets/asteroidMedium.png',
    //     name: 'asteroidMedium'
    // },
    // asteroidSmall: {
    //     URL: 'assets/asteroidSmall.png',
    //     name: 'asteroidSmall'
    // },
    explosionSmall: {
      URL:'assets/explosionSmall.png',
      name:'explosionSmall',
      width:128,
      height:128,
      frames:16,
    },
};
//////////////////////////////
////////// SOUND ASSETS
//////////////////////////////
var soundAssets = {
  fire: {
    URL: 'assets/sounds/x-wing-blaster-sound.mp3',
    name: 'fire',
  },
};
//////////////////////////////
////////// SHIP PROPERTIES
//////////////////////////////
var shipProperties = {
    // ship will start at the center of the screen
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    // physics properties
    acceleration: 300,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 200,
    // score properties
    startingLives: 3,
    timeToReset: 3,
    startingScore: 0,
    killCount: 0,
};
//////////////////////////////
////////// BULLET PROPERTIES
//////////////////////////////
var bulletProperties = {
    // physics properties
    speed: 400,
    interval: 250,
    lifespan: 2000,
    maxCount: 30,
}
//////////////////////////////
////////// ASTEROID PROPERTIES
//////////////////////////////
var asteroidProperties = {
    startingAsteroids: 5, // # of asteroids at game start
    maxAsteroids: 20, // # asteroids that will appear in a round
    incrementAsteroids: 2, // # of additional asteroids per round
    // minVelocity: min asteroid speed
    // maxVelocity: max asteroid speed
    // minAngularVelocity: min rotation speed
    // maxAngularVelocity: max rotation speed
    // score: points a player will earn upon destroying
    // explosion: the name property of the explosion image to use upon destruction
    enemySmall: {
        minVelocity: 50,
        maxVelocity: 300,
        minAngularVelocity: 0,
        maxAngularVelocity: 200,
        score: 20,
        explosion: 'explosionSmall',
    },
};
var fontAssets = {
    // font to use for on screen display
    counterFontStyle: {
        font: '20px Arial',
        fill: '#FFFFFF',
        align: 'center'
    },
};
// declarations and initializations
var gameState = function(game) {
    this.backgroundSprite;
    this.shipSprite;
    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;
    this.bulletGroup;
    this.bulletInterval = 0;
    this.asteroidGroup;
    this.asteroidsCount = asteroidProperties.startingAsteroids;
    this.shipLives = shipProperties.startingLives;
    this.shipLivesDisplay;
    this.score = shipProperties.startingScore;
    this.scoreDisplay;
    this.fireSound;
    this.explosionSmallGroup;

};

gameState.prototype = {
    //////////////////////////////
    ////////// PRELOAD
    //////////////////////////////
    preload: function() {
        // load image graphics for use in the game
        // game.load.image(KEY, URL, [OVERWRITE])
        // optional overwrite argument, to replace an asset if the specified key already exists
        game.load.image(graphicAssets.background.name, graphicAssets.background.URL);
        game.load.image(graphicAssets.enemySmall.name, graphicAssets.enemySmall.URL);

        game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
        game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);

        game.load.audio(soundAssets.fire.name, soundAssets.fire.URL);

        game.load.spritesheet(
          graphicAssets.explosionSmall.name,
          graphicAssets.explosionSmall.URL, graphicAssets.explosionSmall.width, graphicAssets.explosionSmall.height, graphicAssets.explosionSmall.frames
        );

    },
    //////////////////////////////
    ////////// CREATE
    //////////////////////////////
    create: function() {
        this.initGraphics();
        this.initSounds();
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids(asteroidProperties.startingAsteroids);

        // Create a label to use as a button
       var pause_label = game.add.text(680, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
       pause_label.inputEnabled = true;
       pause_label.events.onInputUp.add(function () {
       // When the paus button is pressed, we pause the game
       game.paused = true;
       pause_label.setText("Play");
        });
        game.input.onDown.add(unpause, self);
        function unpause(event){
          if(game.paused){
            game.paused = false;
            pause_label.setText("Pause");
          }
        }
    },
    //////////////////////////////
    ////////// UPDATE
    //////////////////////////////
    update: function() {
        this.checkPlayerInput();
        this.checkBoundaries(this.shipSprite);
        this.asteroidGroup.forEachExists(this.checkBoundaries, this);

        // use the physics overlap function to check if any bullet and any asteroid sprite boxes are touching. If so, call the asteroidCollision function.
        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
        game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
    },

    //////////////////////////////
    ////////// RENDER
    //////////////////////////////
    render: function() {
      game.debug.text('Time: ' + this.game.time.totalElapsedSeconds().toFixed(2), 20, 460);
    },
    //////////////////////////////
    ////////// GRAPHICS
    //////////////////////////////
    initGraphics: function() {

        // background must be first
        this.backgroundSprite = game.add.sprite(0, 0, graphicAssets.background.name);

        // add the player's ship to the game world
        //game.add.sprite( x coordinate, y coordinate, key to reference the image to use
        this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);

        // spawn the ship in the center of the screen
        this.shipSprite.anchor.set(0.5, 0.5);

        // create a group for bullets for manipulation
        this.bulletGroup = game.add.group();
        // create a group of asteroids for manipulation
        this.asteroidGroup = game.add.group();

        this.explosionSmallGroup = game.add.group();
        this.explosionSmallGroup.createMultiple(20, graphicAssets.explosionSmall.name, 0);
        this.explosionSmallGroup.setAll('anchor.x', 0.5);
        this.explosionSmallGroup.setAll('anchor.y', 0.5);
        // callAll adds explode animation to each boject in the explosionSmallGroup
        // data structure:
        // callAll( method, context, name for this animation, frames to use (null being all), fps )
        this.explosionSmallGroup.callAll('animations.add', 'animations', 'explode', null, 30);

        game.add.text(20, 10, "Lives", fontAssets.counterFontStyle);
        // display remaining lives
        // (x coordinate, y coordinate, string, style)
        this.shipLivesDisplay = game.add.text(90, 10, shipProperties.startingLives, fontAssets.counterFontStyle);

        game.add.text(20, 30, "Score", fontAssets.counterFontStyle);
        this.scoreDisplay = game.add.text(90, 30, shipProperties.startingScore, fontAssets.counterFontStyle);

    },
    initSounds: function() {
      this.fireSound = game.add.audio(soundAssets.fire.name);
    },
    //////////////////////////////
    ////////// PHYSICS
    //////////////////////////////
    initPhysics: function() {

        // make arcade physics available in this game
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
        // set the spawn point of the bullets to be the x and y location of the player's ship (first parameter). The second parameter specifies the location withing the ship's width/height for the bullet to spawn.
        this.bulletGroup.setAll('anchor.x', 0);
        this.bulletGroup.setAll('anchor.y', 0);
        // set when the bullets will be removed from the game
        this.bulletGroup.setAll('lifespan', bulletProperties.lifespan);

        // ARCADE physics will be used on the asteroids
        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },
    // Pass a key code value that corresponds with the key pressed. For example, LEFT's value is 37.
    initKeyboard: function() {
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },
    // listen for directional arrow presses
    // this is called every frame loop
    // only one key is being checked at a time
    checkPlayerInput: function() {
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
    checkBoundaries: function(sprite) {
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
    fire: function() {
        if (!this.shipSprite.alive) {
          return;
        }
        // check if the game clock has passed the minimum bullet fire interval
        if (game.time.now > this.bulletInterval) {
          this.fireSound.play();
            // create a NEW bullet in our bullet group
            // 'true' would return the first existing bullet in the group
            var bullet = this.bulletGroup.getFirstExists(false);

            // if a new bullet was successfully created (should always be true unless the max bullets number has been reached)...
            if (bullet) {

                // length will be used to calculate the position directly in front of the ship
                var length = this.shipSprite.width * 0.1;
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
    // size argument is asteroidSmall, asteroidMedium, or enemySmall
    createAsteroid: function(x, y, size) {

        // create a new asteroid and add it to the asteroid group
        var asteroid = this.asteroidGroup.create(x, y, size);

        // set rotation axis to the center of the asteroid
        asteroid.anchor.set(0.5, 0.5);
        // generate random rotation speed
        // [size] is replaced with the value of the size argument
        asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[size].minAngularVelocity, asteroidProperties[size].maxAngularVelocity);

        // generate random trajectory
        // angle() returns value between -180 to 180.
        var randomAngle = game.math.degToRad(game.rnd.angle());

        // generate random speed
        var randomVelocity = game.rnd.integerInRange(asteroidProperties[size].minVelocity, asteroidProperties[size].maxVelocity);

        // assign the generated values to the asteroid
        game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
    },

    // example
    // generate random x and y asteroid spawn points
    // resetAsteroids: function() {
    //     for (var i = 0; i < this.asteroidsCount; i++) {
    //         var x = Math.random() * gameProperties.screenWidth;
    //         var y = Math.random() * gameProperties.screenHeight;
    //         this.createAsteroid(x, y, graphicAssets.enemySmall.name);
    //     }
    // },
    resetAsteroids: function(asteroidsToMake) {
      for (var i = 0; i < asteroidsToMake; i++) {
        var x=0;
        var y=0;
        // the asteroid must spawn at one of the screen edges. The z variable splits the options into two groups, top/bottom (if z=1) and left/right (if z=0).
        // inside that decision, z2 will decide which specific side will be used
        var z = Math.round(Math.random());
        var z2 = Math.round(Math.random());
        if (z) {
          x = Math.random() * gameProperties.screenWidth;
          if (z2) {
            y = 0;
          } else {
            y = gameProperties.screenHeight;
          }
        } else {
          y = Math.random() * gameProperties.screenWidth;
          // if (z2) {
          if (z2) {
            x = 0;
          } else {
            x = gameProperties.screenWidth;
          }
        }
        this.createAsteroid(x, y, graphicAssets.enemySmall.name);
      }
    },
    asteroidCollision: function(target, asteroid) {
        // upon collision of 2 objects, delete them both
        target.kill();
        asteroid.kill();
        shipProperties.killCount++;
        if (shipProperties.killCount < asteroidProperties.maxAsteroids) {
          this.resetAsteroids(1);
        } else if (shipProperties.killCount == asteroidProperties.maxAsteroids + 1) {
          //pass the current time and score to the gameover modal
          gameOver(this.score, this.game.time.totalElapsedSeconds().toFixed(2));
          getRandomQuote(successQuotes);
        }

        // check which explosion group the killed asteroid is in
        var explosionGroup = asteroidProperties[asteroid.key].explosion + "Group";
        // create a new explosion for the appropriate group
        var explosion = this[explosionGroup].getFirstExists(false);
        // set the coordinates of the explosion animation to the asteroids coordinates
        explosion.reset(asteroid.x, asteroid.y);
        // .play arguments
        // ( name, frameRate, loop, killOnComplete )
        explosion.animations.play('explode', null, false, true);

        // if the object that hit the asteroid was the ship, run the shipDestroyed function
        if (target.key == graphicAssets.ship.name) {
            this.shipDestroyed();
        // if the object that hit the asteroid was the bullet, run the asteroidDestroyed function
        } else if (target.key == graphicAssets.bullet.name) {
          this.asteroidDestroyed(asteroid);
        }
    },
    shipDestroyed: function() {
        this.shipLives --;
        this.shipLivesDisplay.text = this.shipLives;
        getRandomQuote(encouragementQuotes);
        if (this.shipLives) {
            // arguments ( delay timer, callback, context )
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.timeToReset, this.shipRespawn, this);
        } else {
          //pass the current time and score to the gameover modal
          gameOver(this.score, this.game.time.totalElapsedSeconds().toFixed(2));
          getRandomQuote(failureQuotes);
        }
    },
    asteroidDestroyed(asteroid) {
      this.score += asteroidProperties[asteroid.key].score;
      this.scoreDisplay.text = this.score;

    },
    shipRespawn: function() {
        this.shipSprite.reset(shipProperties.startX, shipProperties.startY);
        this.shipSprite.angle = -90;
    }
};
// var mainState = function(game) {
//   this.tf_start;
// }
var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
