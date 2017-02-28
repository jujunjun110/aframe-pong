if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.')
}

/* here you write your components. */
AFRAME.registerComponent('enemy', {
    schema: {
        efficiency: {
            default: 0.1
        }
    },
    init: function () {
        this.ball = document.getElementById('ball')
        this.defaultPosition = this.el.getAttribute('position')
        this.isChasingBall = true

        this.el.addEventListener('collide', () => {
            this.isChasingBall = false
        })
        this.el.addEventListener('playerCollide', () => {
            this.isChasingBall = true
        })
        this.el.addEventListener('gameStart', () => {
            this.isChasingBall = true
        })
    },
    tick: function (t) {
        const el = this.el
        const myPos = el.getAttribute('position')
        let targetPos = this.defaultPosition
        if (this.isChasingBall) {
            targetPos = this.ball.getAttribute('position')
        }
        const newPos = new THREE.Vector3(
            myPos.x + (targetPos.x - myPos.x) * this.data.efficiency,
            myPos.y + (targetPos.y - myPos.y) * this.data.efficiency,
            myPos.z
        )
        el.setAttribute('position', newPos)
    }
})

