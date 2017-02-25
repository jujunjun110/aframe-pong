if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('ball', {
    schema: {},
    multiple: false,
    init: function () {
        const el = this.el
        el.addEventListener('startGame', () => {
            this.startGame()
        })
        el.addEventListener('collide', () => {
            this.speedUpIfNeeded()
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

        console.log(speed)

        this.el.body.velocity = new CANNON.Vec3(
            velocity.x * speedUp,
            velocity.y * speedUp,
            velocity.z * speedUp
        )
    },
    startGame: function () {
        const body = this.el.body
        body.velocity = new CANNON.Vec3(6, 4, 4)
    }
})

