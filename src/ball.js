if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function () {
        const el = this.el
        el.addEventListener('collide', () => {
            this.speedUpIfNeeded()
        })
        el.addEventListener('startGame', () => {
            this.startGame()
        })
        el.addEventListener('restartGame', () => {
            el.body.velocity = new CANNON.Vec3(0, 0, 0)
            setTimeout(() => {
                this.startGame()
            }, 3000)
        })
    },
    speedUpIfNeeded: function () {
        const velocity = this.el.body.velocity
        let speedUp = 1.05
        const speed = new THREE.Vector3().distanceTo(velocity)

        if (speed > 10) {
            speedUp = 1.02
        } else if (speedUp > 20) {
            speedUp = 1
        }
        let vz = velocity.z
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
    }
})

