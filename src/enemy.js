if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('enemy', {
    init: function () {
        this.isChasingBall = true
        this.el.addEventListener('collide', () => {
            this.isChasingBall = false
        })
        this.el.addEventListener('playerCollide', () => {
            this.isChasingBall = true
        })
    },
    tick: function (t) {
        const el = this.el
        const myPos = el.getAttribute('position')

        let targetPos = new THREE.Vector3(0, 0, 0)
        if (this.isChasingBall) {
            const ball = document.getElementById('ball')
            targetPos = ball.getAttribute('position')
        }
        const newPos = new THREE.Vector3(
            myPos.x + (targetPos.x - myPos.x) * 0.05,
            myPos.y + (targetPos.y - myPos.y) * 0.05,
            myPos.z
        )

        el.setAttribute('position', newPos)
    },
})

