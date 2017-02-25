if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function () {
        const el = this.el
        this.points = {
            'player': 0,
            'enemy': 0
        }
        el.addEventListener('collide', () => {
            this.speedUpIfNeeded()
        })
        el.addEventListener('startGame', () => {
            this.startGame('player')
        })
        el.addEventListener('gameEnded', (e) => {
            if (!this.canCollide) {
                return
            }
            this.canCollide = false

            const el = this.el
            el.body.velocity = new CANNON.Vec3(0, 0, 0)
            const winner = e.detail.side === 'player' ? 'enemy' : 'player'
            this.points[winner] += 1
            this.reloadLcd()
            if (this.points.player >= 11 || this.points.enemy >= 11) {
                return
            }
            this.restartGame(e.detail.side)
        })
    },
    speedUpIfNeeded: function () {
        const velocity = this.el.body.velocity
        let speedUp = 1.1
        let vz = velocity.z
        const speed = new THREE.Vector3().distanceTo(velocity)

        if (speed > 10) {
            speedUp = 1.05
        } else if (speed > 25) {
            speedUp = 1
        }
        const zLimit = 5

        if (Math.abs(vz) < zLimit) {
            vz = vz > 0 ? zLimit : -zLimit
        }

        this.el.body.velocity = new CANNON.Vec3(
            velocity.x * speedUp,
            velocity.y * speedUp,
            vz * speedUp
        )
    },
    startGame: function (side) {
        const body = this.el.body
        const direction = side === 'player' ? 1 : 0
        const enemy = document.getElementById('enemy')
        this.canCollide = true
        enemy.emit('gameStart')

        body.position = new CANNON.Vec3(0, 0, -15)
        body.velocity = new CANNON.Vec3(0, 0, 0)
        setTimeout(() => {
            body.velocity = new CANNON.Vec3(6, 4, 4 * direction)
        }, 2000)
    },
    restartGame: function (side) {
        setTimeout(() => {
            this.startGame(side)
        }, 1000)
    },
    reloadLcd: function () {
        const lcd = document.getElementById('lcd')
        let txt = this.points.player + ' - ' + this.points.enemy
        if (this.points.player >= 11) {
            txt += '\n You Win!!'
            lcd.setAttribute('bmfont-text', 'color', 'red')
        }
        if (this.points.enemy >= 11) {
            txt += '\n You Lose...'
            lcd.setAttribute('bmfont-text', 'color', 'blue')
        }
        lcd.setAttribute('bmfont-text', 'text', txt)
    }
})

