if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function () {
        const el = this.el
        this.defaultPos = el.getAttribute('position')
        this.matchPoint = 11
        this.points = { 'player': 0, 'enemy': 0 }

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
            if (this.points.player >= this.matchPoint || this.points.enemy >= this.matchPoint) {
                return
            }
            this.restartGame(e.detail.side)
        })
    },
    speedUpIfNeeded: function () {
        const velocity = this.el.body.velocity
        const speed = new THREE.Vector3().distanceTo(velocity)

        const maxSpeed = 5
        const zLimit = 1.5
        let vz = velocity.z
        let speedUpRate = 1.1

        if (speed > 1) {
            speedUpRate = 1.03
        }
        if (speed > maxSpeed) {
            speedUpRate = 0.97
        }
        if (Math.abs(vz) < zLimit) {
            vz = vz > 0 ? zLimit : -zLimit
        }

        this.el.body.velocity = new CANNON.Vec3(
            velocity.x * speedUpRate,
            velocity.y * speedUpRate,
            vz * speedUpRate
        )
    },
    startGame: function (side) {
        const el = document.getElementById('ball')
        const body = el.body
        const direction = side === 'player' ? 1 : -1
        const enemy = document.getElementById('enemy')
        this.canCollide = true
        enemy.emit('gameStart')

        body.position = new CANNON.Vec3(this.defaultPos.x, this.defaultPos.y, this.defaultPos.z)
        body.velocity = new CANNON.Vec3(0, 0, 0)
        setTimeout(() => {
            body.velocity = new CANNON.Vec3(
                (Math.random() + 1) * 0.5,
                (Math.random() + 1) * 0.5,
                direction
            )
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

        if (this.points.player >= this.matchPoint) {
            txt += '\n You Win!!'
            lcd.setAttribute('bmfont-text', 'color', 'red')
        } else if (this.points.enemy >= this.matchPoint) {
            txt += '\n You Lose...'
            lcd.setAttribute('bmfont-text', 'color', 'blue')
        }

        lcd.setAttribute('bmfont-text', 'text', txt)
    }
})

