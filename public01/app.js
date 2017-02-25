(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

console.warn = function () {};
require('./player.js');
require('./player-mover.js');
require('./ball.js');
require('./enemy.js');

document.addEventListener('DOMContentLoaded', function () {
    if (typeof AFRAME === 'undefined') {
        throw new Error('Application started before AFRAME was available.');
    }

    var scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        main();
    } else {
        scene.addEventListener('loaded', main);
    }

    function main() {
        var ball = document.getElementById('ball');
        ball.emit('startGame');
    }
});

},{"./ball.js":2,"./enemy.js":3,"./player-mover.js":4,"./player.js":5}],2:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function init() {
        var _this = this;

        var el = this.el;
        el.addEventListener('startGame', function () {
            _this.startGame();
        });
        el.addEventListener('collide', function () {
            _this.speedUpIfNeeded();
        });
    },
    speedUpIfNeeded: function speedUpIfNeeded() {
        var velocity = this.el.body.velocity;
        var speedUp = 1.05;
        var speed = new THREE.Vector3().distanceTo(velocity);

        if (speed > 10) {
            speedUp = 1.02;
        } else if (speedUp > 20) {
            speedUp = 1;
        }

        console.log(speed);

        this.el.body.velocity = new CANNON.Vec3(velocity.x * speedUp, velocity.y * speedUp, velocity.z * speedUp);
    },
    startGame: function startGame() {
        var body = this.el.body;
        body.velocity = new CANNON.Vec3(6, 4, 4);
    }
});

},{}],3:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/* here you write your components. */
AFRAME.registerComponent('enemy', {
    init: function init() {
        var _this = this;

        this.isChasingBall = true;
        this.el.addEventListener('collide', function () {
            _this.isChasingBall = false;
        });
        this.el.addEventListener('playerCollide', function () {
            _this.isChasingBall = true;
        });
    },
    tick: function tick(t) {
        var el = this.el;
        var myPos = el.getAttribute('position');
        var targetPos = new THREE.Vector3(0, 0, 0);
        if (this.isChasingBall) {
            var ball = document.getElementById('ball');
            targetPos = ball.getAttribute('position');
        }
        var newPos = new THREE.Vector3(myPos.x + (targetPos.x - myPos.x) * 0.05, myPos.y + (targetPos.y - myPos.y) * 0.05, myPos.z);
        el.setAttribute('position', newPos);
    }
});

},{}],4:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/* here you write your components. */
AFRAME.registerComponent('player-mover', {
    schema: {},
    multiple: false,
    init: function init() {
        var el = this.el;
        var player = document.getElementById('player');
        var playerPos = el.getAttribute('position');

        el.addEventListener('raycaster-intersected', function (e) {
            var intersectedPos = e.detail.intersection.point;
            var newPos = new THREE.Vector3(intersectedPos.x, intersectedPos.y, playerPos.z);
            player.setAttribute('position', newPos);
        });
    }
});

},{}],5:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/* here you write your components. */
AFRAME.registerComponent('player', {
    init: function init() {
        console.log('playerinit');
        var el = this.el;
        var enemy = document.getElementById('enemy');
        el.addEventListener('collide', function () {
            console.log('collide');
            enemy.emit('playerCollide');
        });
    }
});

},{}]},{},[1]);
