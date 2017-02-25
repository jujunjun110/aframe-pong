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
            this.startGame()
        })
        el.addEventListener('restartGame', (e) => {
            const winner = e.detail.side === 'player' ? 'enemy' : 'player'
            this.restartGame(winner)
        })
    },
    speedUpIfNeeded: function () {
        const velocity = this.el.body.velocity
        let speedUp = 1.1
        let vz = velocity.z
        const speed = new THREE.Vector3().distanceTo(velocity)

        if (speed > 10) {
            speedUp = 1.05
        } else if (speed > 40) {
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
    startGame: function () {
        const body = this.el.body
        body.position = new CANNON.Vec3(0, 0, -15)
        body.velocity = new CANNON.Vec3(6, 4, 4)
    },
    restartGame: function (winner) {
        const el = this.el
        el.body.velocity = new CANNON.Vec3(0, 0, 0)
        this.points[winner] += 1
        this.reloadLcd()
        setTimeout(() => {
            this.startGame()
        }, 3000)
    },
    reloadLcd: function () {
        const lcd = document.getElementById('lcd')
        const txt = this.points.player + ' - ' + this.points.enemy
        lcd.setAttribute('bmfont-text', 'text', txt)
    }
})

