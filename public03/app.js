(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

console.warn = function () {};
require('./player.js');
require('./player-mover.js');
require('./enemy.js');
require('./ball.js');
require('./goal-wall.js');

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

},{"./ball.js":2,"./enemy.js":3,"./goal-wall.js":4,"./player-mover.js":5,"./player.js":6}],2:[function(require,module,exports){
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
        this.points = {
            'player': 0,
            'enemy': 0
        };
        el.addEventListener('collide', function () {
            _this.speedUpIfNeeded();
        });
        el.addEventListener('startGame', function () {
            _this.startGame('player');
        });
        el.addEventListener('gameEnded', function (e) {
            if (!_this.canCollide) {
                return;
            }
            _this.canCollide = false;

            var el = _this.el;
            el.body.velocity = new CANNON.Vec3(0, 0, 0);
            var winner = e.detail.side === 'player' ? 'enemy' : 'player';
            _this.points[winner] += 1;
            _this.reloadLcd();
            if (_this.points.player >= 11 || _this.points.enemy >= 11) {
                return;
            }
            _this.restartGame(e.detail.side);
        });
    },
    speedUpIfNeeded: function speedUpIfNeeded() {
        var velocity = this.el.body.velocity;
        var speedUp = 1.1;
        var vz = velocity.z;
        var speed = new THREE.Vector3().distanceTo(velocity);

        if (speed > 10) {
            speedUp = 1.03;
        } else if (speed > 20) {
            speedUp = 1;
        }
        var zLimit = 5;

        if (Math.abs(vz) < zLimit) {
            vz = vz > 0 ? zLimit : -zLimit;
        }

        this.el.body.velocity = new CANNON.Vec3(velocity.x * speedUp, velocity.y * speedUp, vz * speedUp);
    },
    startGame: function startGame(side) {
        var body = this.el.body;
        var direction = side === 'player' ? 1 : 0;
        var enemy = document.getElementById('enemy');
        this.canCollide = true;
        enemy.emit('gameStart');

        body.position = new CANNON.Vec3(0, 0, -15);
        body.velocity = new CANNON.Vec3(0, 0, 0);
        setTimeout(function () {
            body.velocity = new CANNON.Vec3(Math.random() * 3 + 3, Math.random() * 3 + 3, 4 * direction);
        }, 2000);
    },
    restartGame: function restartGame(side) {
        var _this2 = this;

        setTimeout(function () {
            _this2.startGame(side);
        }, 1000);
    },
    reloadLcd: function reloadLcd() {
        var lcd = document.getElementById('lcd');
        var txt = this.points.player + ' - ' + this.points.enemy;
        if (this.points.player >= 11) {
            txt += '\n You Win!!';
            lcd.setAttribute('bmfont-text', 'color', 'red');
        }
        if (this.points.enemy >= 11) {
            txt += '\n You Lose...';
            lcd.setAttribute('bmfont-text', 'color', 'blue');
        }
        lcd.setAttribute('bmfont-text', 'text', txt);
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
        this.el.addEventListener('gameStart', function () {
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
        var newPos = new THREE.Vector3(myPos.x + (targetPos.x - myPos.x) * 0.1, myPos.y + (targetPos.y - myPos.y) * 0.1, myPos.z);
        el.setAttribute('position', newPos);
    }
});

},{}],4:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/* here you write your components. */
AFRAME.registerComponent('goal-wall', {
    schema: {
        'side': {
            'type': 'string'
        }
    },
    multiple: false,
    init: function init() {
        var _this = this;

        var el = this.el;
        var ball = document.getElementById('ball');
        el.addEventListener('collide', function () {
            var side = _this.data.side;
            ball.emit('gameEnded', { side: side });
        });
    }
});

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/* here you write your components. */
AFRAME.registerComponent('player', {
    init: function init() {
        var el = this.el;
        var enemy = document.getElementById('enemy');
        el.addEventListener('collide', function () {
            enemy.emit('playerCollide');
        });
    }
});

},{}]},{},[1]);
