if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function() {
        const el = this.el
        this.defaultPos = el.getAttribute('position')
        this.matchPoint = 11
        this.points = {
            'player': 0,
            'enemy': 0
        }

        el.addEventListener('collide', () => {
            this.el.components.sound.playSound()
            this.speedUpIfNeeded()
        })
        el.addEventListener('startGame', () => {
            this.startGame('enemy')
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
                el.body.velocity = new CANNON.Vec3(0, 0, 0)
                return
            }
            this.restartGame(winner)
        })
    },
    startGame: function(side) {
        const enemy = document.getElementById('enemy')
        enemy.emit('gameStart')
        this.canCollide = true
        this.Fire(side) // ボールを発射する
    },
    Fire: function(side) {
        const el = this.el
        const body = el.body

        const direction = side === 'player' ? -1 : 1
        body.position = new CANNON.Vec3(this.defaultPos.x, this.defaultPos.y, this.defaultPos.z)
        body.velocity = new CANNON.Vec3(0, 0, 0)
        setTimeout(() => {
            body.velocity = new CANNON.Vec3(
                (Math.random() + 1) * 0.2,
                (Math.random() + 1) * 0.2,
                direction
            )
        }, 2000)
    },
    restartGame: function(side) {
        setTimeout(() => {
            this.startGame(side)
        }, 1000)
    },
    reloadLcd: function() {
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
    },
    speedUpIfNeeded: function() {
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
})